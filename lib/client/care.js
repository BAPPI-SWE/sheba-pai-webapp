"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import site from "@/site.config";
import { getPublicSettings, whatsAppUrl } from "./api";

/* ---- the family's chosen area, remembered like the app (careLocation, else the doctor section's choice) ---- */
const EVT = "sp-care-loc";
let cachedRaw = "__init__", cachedVal = null;
const EMPTY = { division: "", district: "" };

function read() {
  try {
    const raw = localStorage.getItem("careLocation") || localStorage.getItem("doctorLocation") || "";
    if (raw !== cachedRaw) { cachedRaw = raw; cachedVal = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY; }
  } catch { cachedVal = EMPTY; }
  return cachedVal;
}
function subscribe(cb) {
  window.addEventListener(EVT, cb); window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
}
/** { division, district } with canonical English names; `null` until the page is in the browser. */
export function useCareLocation() {
  const loc = useSyncExternalStore(subscribe, read, () => null);
  const set = (next) => {
    try { localStorage.setItem("careLocation", JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event(EVT));
  };
  return [loc, set];
}

/* ---- who families call: Sheba Pai, never the caregiver ---- */
export function useCareContact() {
  const [s, setS] = useState({});
  useEffect(() => { getPublicSettings().then(setS).catch(() => {}); }, []);
  const phone = s.careContactNumber || s.emergencyContactNumber || site.phone;
  const wa = s.careWhatsAppNumber || s.supportWhatsAppNumber || site.whatsapp;
  return { phone, waUrl: (message) => whatsAppUrl(wa, message) };
}

/* ---- open the request sheet from anywhere on a caregiver page ---- */
export const REQUEST_EVT = "sp-care-request";
export function openCareRequest(target) {
  window.dispatchEvent(new CustomEvent(REQUEST_EVT, { detail: target || {} }));
}
