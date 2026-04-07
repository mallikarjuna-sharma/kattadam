export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { probeDataLayerOnStartup } = await import("@kattadam/data-layer/server");
  await probeDataLayerOnStartup();
}
