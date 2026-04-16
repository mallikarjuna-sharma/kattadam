/**
 * Password hashing without Node's `crypto` module so Next/Webpack bundles
 * (e.g. Netlify instrumentation analysis) never need to resolve `crypto`.
 * Uses PBKDF2-SHA-256 via Web Crypto (available in Node 18+ and browsers).
 */

const PBKDF2_ITERATIONS = 120_000;

function toHex(u8: Uint8Array): string {
  return Array.from(u8, (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const v = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (!Number.isFinite(v)) return null;
    out[i] = v;
  }
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export async function hashPasswordPbkdf2(plain: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Web Crypto (crypto.subtle) is not available in this runtime.");

  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMaterial = await subtle.importKey("raw", enc.encode(plain), "PBKDF2", false, ["deriveBits"]);
  const saltBuf = new Uint8Array(salt);
  const bits = await subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuf,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const hash = new Uint8Array(bits);
  return `pbkdf2:${PBKDF2_ITERATIONS}:${toHex(salt)}:${toHex(hash)}`;
}

export async function verifyPasswordPbkdf2(plain: string, stored: string | null | undefined): Promise<boolean> {
  if (!stored || !plain) return false;

  if (stored.startsWith("scrypt:")) {
    return false;
  }

  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;

  const iterations = Number.parseInt(parts[1]!, 10);
  const salt = fromHex(parts[2]!);
  const expected = fromHex(parts[3]!);
  if (!salt || !expected || !Number.isFinite(iterations) || iterations < 10_000) return false;

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return false;

  try {
    const enc = new TextEncoder();
    const keyMaterial = await subtle.importKey("raw", enc.encode(plain), "PBKDF2", false, ["deriveBits"]);
    const saltBuf = new Uint8Array(salt);
    const bits = await subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBuf,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );
    const derived = new Uint8Array(bits);
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
