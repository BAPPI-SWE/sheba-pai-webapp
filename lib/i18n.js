/**
 * Languages: Bangla is the main language and lives at the root ("/doctors"),
 * English lives under "/en" ("/en/doctors"). middleware.js does the mapping.
 */
export const LANGS = ["bn", "en"];

export function isLang(v) { return LANGS.includes(v); }

/** Link to a page in the given language: href("en", "/about") → "/en/about". */
export function href(lang, path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (lang === "en") return p === "/" ? "/en" : `/en${p}`;
  return p;
}

/** The same page in the other language (for the language switch and hreflang). */
export function altPath(lang, path) {
  return href(lang === "bn" ? "en" : "bn", path);
}

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
export function digits(v, lang) {
  return lang === "bn" ? String(v).replace(/[0-9]/g, (d) => BN_DIGITS[d]) : String(v);
}

/** ৳1,200 / ৳১,২০০ */
export function taka(n, lang) {
  if (n == null) return "";
  const s = String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `৳${digits(s, lang)}`;
}

/** Pick the Bangla or English field of an API object: L(o, "name", lang). */
export function L(o, key, lang) {
  if (!o) return "";
  const bn = o[`${key}Bangla`];
  return lang === "bn" ? bn || o[key] || "" : o[key] || bn || "";
}
