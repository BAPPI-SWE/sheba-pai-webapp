import site from "@/site.config";
import { href } from "@/lib/i18n";
import { getJSON } from "@/lib/api";
import { districtByName } from "@/lib/doctors";

export const revalidate = 3600;

const PAGES = [
  ["/", 1, "daily"], ["/doctors", 0.9, "daily"], ["/medicine", 0.8, "daily"], ["/caregiver", 0.8, "weekly"],
  ["/about", 0.4, "monthly"], ["/contact", 0.4, "monthly"],
  ["/privacy", 0.2, "yearly"], ["/terms", 0.2, "yearly"], ["/delete-account", 0.2, "yearly"],
];

function both(path, priority, changeFrequency, lastModified = new Date()) {
  return ["bn", "en"].map((lang) => ({
    url: `${site.url}${href(lang, path)}`,
    lastModified, changeFrequency,
    priority: lang === "bn" ? priority : Math.round(priority * 8) / 10,
    alternates: { languages: { "bn-BD": `${site.url}${href("bn", path)}`, en: `${site.url}${href("en", path)}` } },
  }));
}

/** Every public page, including each specialty, specialty + district, and doctor (from the backend). */
export default async function sitemap() {
  const out = PAGES.flatMap(([p, pr, f]) => both(p, pr, f));
  const map = await getJSON("/api/doctors/sitemap", { fallback: null, timeoutMs: 20000 });
  if (map) {
    for (const s of map.specialties) out.push(...both(`/doctors/${s}`, 0.8, "weekly"));
    for (const c of map.specialtyDistricts) out.push(...both(`/doctors/${c.specialty}/${c.district}`, 0.7, "weekly"));
    for (const d of map.doctors) out.push(...both(`/doctor/${d.slug}`, 0.6, "monthly", d.updatedAt ? new Date(d.updatedAt) : new Date()));
  }
  // Medicines and generics — needs the backend's /api/medicines/sitemap (added in phase 3).
  const [meds, cats] = await Promise.all([
    getJSON("/api/medicines/sitemap", { fallback: null, timeoutMs: 20000 }),
    getJSON("/api/categories", { fallback: [] }),
  ]);
  out.push(...both("/medicine/generics", 0.6, "weekly"));
  for (const c of Array.isArray(cats) ? cats : []) out.push(...both(`/medicine/category/${c.slug}`, 0.7, "weekly"));
  if (meds) {
    for (const g of meds.generics) out.push(...both(`/generic/${g.slug}`, 0.7, "monthly", g.updatedAt ? new Date(g.updatedAt) : new Date()));
    for (const m of meds.medicines) out.push(...both(`/medicine/${m.slug}`, 0.7, "weekly", m.updatedAt ? new Date(m.updatedAt) : new Date()));
  }
  // Caregiver pages: services, packages, and every district / care type that has caregivers (needs /api/care/sitemap, added in phase 4).
  out.push(...both("/caregiver/urgent", 0.8, "weekly"), ...both("/caregiver/packages", 0.8, "weekly"), ...both("/caregiver/in", 0.7, "daily"));
  const care = await getJSON("/api/care/sitemap", { fallback: null, timeoutMs: 20000 });
  if (care) {
    for (const c of care.categories) out.push(...both(`/caregiver/in/all/${c}`, 0.6, "weekly"));
    for (const d of care.districts) {
      const slug = districtByName(d.district)?.slug;
      if (!slug) continue;
      out.push(...both(`/caregiver/in/${slug}`, 0.7, "weekly"));
      for (const c of d.categories) out.push(...both(`/caregiver/in/${slug}/${c}`, 0.6, "weekly"));
    }
  }
  return out;
}
