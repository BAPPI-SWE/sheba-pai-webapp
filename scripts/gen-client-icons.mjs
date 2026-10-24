// Collects every icon name used by <CIcon name="..."> (plus names listed in
// "cicon-keys:" comments) and copies those SVGs from lib/ion/all.json into
// lib/ion/client.json, the small set the browser downloads.
//   node scripts/gen-client-icons.mjs
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const all = JSON.parse(fs.readFileSync(path.join(root, "lib/ion/all.json"), "utf8"));
const names = new Set(["home", "home-outline", "cart", "cart-outline", "receipt", "receipt-outline"]); // tab bar
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name === "node_modules" || f.name.startsWith(".")) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(jsx?)$/.test(f.name)) {
      const t = fs.readFileSync(p, "utf8");
      if (!t.includes("CIcon")) continue;
      for (const m of t.matchAll(/<CIcon[^>]*?name=(?:"([a-z0-9-]+)"|\{([^}]+)\})/g)) {
        if (m[1]) names.add(m[1]);
        else for (const q of m[2].matchAll(/"([a-z0-9-]+)"/g)) names.add(q[1]);
      }
      for (const m of t.matchAll(/cicon-keys:([^\n]*)/g)) m[1].trim().split(/\s+/).forEach((n) => n && names.add(n));
    }
  }
}
["app", "components"].forEach((d) => walk(path.join(root, d)));
const out = {}, missing = [];
for (const n of [...names].sort()) (all[n] ? (out[n] = all[n]) : n.includes("-") && missing.push(n));
fs.writeFileSync(path.join(root, "lib/ion/client.json"), JSON.stringify(out));
console.log(`${Object.keys(out).length} icons${missing.length ? `; unknown: ${missing.join(", ")}` : ""}`);
