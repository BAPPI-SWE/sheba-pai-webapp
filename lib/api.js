import site from "@/site.config";

/**
 * Read from the app's backend on the server, cached (ISR). Pages are rebuilt
 * at most once per `revalidate` seconds, so visitors get a cached page
 * instantly even while the Render server is waking up. Never throws: on a
 * failure it returns `fallback`, and the page renders without that section.
 */
export async function getJSON(path, { revalidate = 3600, fallback = null, timeoutMs = 9000 } = {}) {
  try {
    const res = await fetch(`${site.apiUrl}${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch (e) {
    return fallback;
  }
}

/**
 * Like getJSON but tells "not found" apart from "server unreachable":
 * returns { ok, status, data }. status 0 = no answer (timeout / offline).
 */
export async function getJSONStatus(path, { revalidate = 3600, timeoutMs = 20000 } = {}) {
  try {
    const res = await fetch(`${site.apiUrl}${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json" },
    });
    const data = res.ok ? await res.json() : null;
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: null };
  }
}
