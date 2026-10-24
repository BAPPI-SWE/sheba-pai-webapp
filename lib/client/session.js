"use client";
import { useSyncExternalStore } from "react";

/**
 * Login on the website — the same idea as the app's auth.js:
 * the token and user are stored on this device (localStorage, same key names),
 * and every page reads them the same way.
 */
const EVT = "sp-session";
let cachedRaw = null, cachedValue = { token: null, user: null };

function read() {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const raw = `${token}|${userStr}`;
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    cachedValue = token && userStr ? { token, user: JSON.parse(userStr) } : { token: null, user: null };
  } catch { cachedValue = { token: null, user: null }; }
  return cachedValue;
}

export function getSession() { return typeof window === "undefined" ? { token: null, user: null } : read(); }

export function saveSession(data) {
  try {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  } catch {}
  window.dispatchEvent(new Event(EVT));
}

export function clearSession() {
  try { localStorage.removeItem("token"); localStorage.removeItem("user"); } catch {}
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb); // another tab logged in / out
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
}
const SERVER = { token: null, user: null, ready: false };

/** { ready, loggedIn, token, user } — `ready` is false during the first paint. */
export function useSession() {
  const s = useSyncExternalStore(subscribe, read, () => SERVER);
  return { ready: s !== SERVER, loggedIn: !!(s.token && s.user), token: s.token, user: s.user };
}
