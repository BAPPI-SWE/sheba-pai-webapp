// Collects every tc("key") used by browser components and copies just those
// words (Bangla + English) from lib/appText.js into lib/clientText.json, so
// the browser downloads a few kB of text instead of the app's whole dictionary.
// Run after adding new tc("...") keys:   node scripts/gen-client-text.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = fs.readFileSync(path.join(root, "lib/appText.js"), "utf8");
const start = src.indexOf("export const translations");
const objText = src.slice(src.indexOf("{", start), src.lastIndexOf("};", src.indexOf("export function t(")) + 1);
const translations = Function(`return (${objText});`)();

const keys = new Set();
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name === "node_modules" || f.name.startsWith(".")) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(jsx?|mjs)$/.test(f.name)) {
      const text = fs.readFileSync(p, "utf8");
      for (const m of text.matchAll(/\btc\(\s*["']([A-Za-z0-9_]+)["']/g)) keys.add(m[1]);
      // Keys built at run time are listed in a comment:  // tc-keys: keyA keyB
      for (const m of text.matchAll(/tc-keys:([^\n]*)/g)) m[1].trim().split(/\s+/).filter(Boolean).forEach((k) => keys.add(k));
    }
  }
}
["app", "components", "lib"].forEach((d) => walk(path.join(root, d)));

const out = { bn: {}, en: {} };
const missing = [];
for (const k of [...keys].sort()) {
  for (const l of ["bn", "en"]) out[l][k] = translations[l]?.[k] ?? translations.bn[k] ?? null;
  if (translations.bn[k] == null && !k.startsWith("web")) missing.push(k);
}
fs.writeFileSync(path.join(root, "lib/clientText.json"), JSON.stringify(out));
console.log(`${keys.size} keys written${missing.length ? `; NOT in app text: ${missing.join(", ")}` : ""}`);
