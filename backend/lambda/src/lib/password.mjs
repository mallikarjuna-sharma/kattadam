const PBKDF2_ITERATIONS = 120_000;

function toHex(u8) {
  return Array.from(u8, (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex) {
  if (hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const v = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (!Number.isFinite(v)) return null;
    out[i] = v;
  }
  return out;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPasswordPbkdf2(plain) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Web Crypto not available");
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMaterial = await subtle.importKey("raw", enc.encode(plain), "PBKDF2", false, ["deriveBits"]);
  const bits = await subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return `pbkdf2:${PBKDF2_ITERATIONS}:${toHex(salt)}:${toHex(new Uint8Array(bits))}`;
}

export async function verifyPasswordPbkdf2(plain, stored) {
  if (!stored || !plain) return false;
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number.parseInt(parts[1], 10);
  const salt = fromHex(parts[2]);
  const expected = fromHex(parts[3]);
  if (!salt || !expected || !Number.isFinite(iterations)) return false;
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return false;
  try {
    const enc = new TextEncoder();
    const keyMaterial = await subtle.importKey("raw", enc.encode(plain), "PBKDF2", false, ["deriveBits"]);
    const bits = await subtle.deriveBits(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      keyMaterial,
      256
    );
    return timingSafeEqual(new Uint8Array(bits), expected);
  } catch {
    return false;
  }
}
