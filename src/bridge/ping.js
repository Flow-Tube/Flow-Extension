import { PING_TIMEOUT_MS } from "../lib/const.js";

export async function pingPort(port) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  try {
    const res = await fetch(`http://127.0.0.1:${port}/flow/ping`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    if (data && data.app && data.app !== "flow") return null;
    // `open`: this Flow takes whole YouTube links on /flow/open.
    return { port, version: data?.version ?? null, open: data?.open === true };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Returns { port, version, open } for the first responsive port, else null.
export async function findRunning(ports) {
  for (const port of ports) {
    const hit = await pingPort(port);
    if (hit) return hit;
  }
  return null;
}
