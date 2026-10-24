"use client";
import TEXT from "@/lib/clientText.json";
import WEB from "@/lib/webText.json";

/**
 * tc(…) in the browser — the app's own words (lib/clientText.json, made by
 * scripts/gen-client-text.mjs) plus a few website-only lines (lib/webText.json).
 */
export function makeT(lang) {
  const a = TEXT[lang] || TEXT.bn, w = WEB[lang] || WEB.bn;
  return function tc(key, vars) {
    let s = w[key] ?? a[key] ?? WEB.bn[key] ?? TEXT.bn[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}
