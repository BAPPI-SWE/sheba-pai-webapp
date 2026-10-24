"use client";
import site from "@/site.config";
import { getSession, clearSession } from "./session";

/**
 * Talk to the app's backend from the browser, signed in as the visitor.
 * A 401 means the login has expired: it is cleared so the page shows the
 * guest view (and "Log in") instead of failing silently.
 */
export async function apiFetch(path, { method = "GET", body, form, headers = {} } = {}) {
  const { token } = getSession();
  const h = { Accept: "application/json", ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form; // FormData — the browser sets the multipart header itself
  else if (body !== undefined) { h["Content-Type"] = "application/json"; payload = JSON.stringify(body); }
  const res = await fetch(`${site.apiUrl}${path}`, { method, headers: h, body: payload });
  if (res.status === 401 && token) clearSession();
  let data = null;
  try { data = await res.json(); } catch {}
  return { ok: res.ok, status: res.status, data };
}

let settingsCache = null, settingsPromise = null;
/** Admin-controlled public settings (support numbers, fees, order mode). Cached for the visit. */
export function getPublicSettings() {
  if (settingsCache) return Promise.resolve(settingsCache);
  if (!settingsPromise) {
    settingsPromise = apiFetch("/api/settings/public")
      .then((r) => { settingsPromise = null; if (r.ok) settingsCache = r.data; return r.data || {}; })
      .catch(() => { settingsPromise = null; return {}; });
  }
  return settingsPromise;
}

/** wa.me link from any way the number was typed (same rules as the app). */
export function whatsAppUrl(rawNumber, message) {
  let d = String(rawNumber || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = "88" + d;
  if (!d) return null;
  return `https://wa.me/${d}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** 01XXXXXXXXX / +8801XXXXXXXXX / 8801XXXXXXXXX → 11 digits, or null. */
export function normalizePhone(raw) {
  let d = String(raw || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+88")) d = d.slice(3);
  else if (d.startsWith("88") && d.length === 13) d = d.slice(2);
  return /^01[3-9]\d{8}$/.test(d) ? d : null;
}
