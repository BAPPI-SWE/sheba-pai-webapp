import GEO from "@/lib/bdGeo.json";

/**
 * Doctor-directory helpers — same rules as the app's DoctorCards.js.
 * GEO is a copy of the backend's 8 divisions / 64 districts (bdGeo.js).
 */
export { GEO };
export const ALL_DISTRICTS = GEO.flatMap((dv) => dv.districts);

export const districtBySlug = (slug) => ALL_DISTRICTS.find((d) => d.slug === slug) || null;
export const divisionBySlug = (slug) => GEO.find((d) => d.slug === slug) || null;
export const districtByName = (name) => ALL_DISTRICTS.find((d) => d.name === name) || null;

/**
 * The optional location part of a list URL:
 *   /doctors/cardiology/dhaka            → district Dhaka
 *   /doctors/cardiology/dhaka-division   → whole Dhaka division
 */
export function parseLoc(seg) {
  if (!seg) return { ok: true, division: null, district: null };
  if (seg.endsWith("-division")) {
    const dv = divisionBySlug(seg.slice(0, -"-division".length));
    return dv ? { ok: true, division: dv, district: null } : { ok: false };
  }
  const d = districtBySlug(seg);
  return d ? { ok: true, division: divisionBySlug(d.divisionSlug), district: d } : { ok: false };
}
export function locSegment({ division, district }) {
  if (district) return district.slug;
  if (division) return `${division.slug}-division`;
  return "";
}

/** Canonical English place name → label in the page language. */
export function placeLabel(name, lang) {
  if (!name || lang !== "bn") return name || "";
  const dv = GEO.find((x) => x.name === name);
  if (dv) return dv.bn;
  const d = districtByName(name);
  return d ? d.bn : name;
}

export const doctorName = (d, lang) => (lang === "bn" && d?.nameBangla ? d.nameBangla : d?.name || "");
export const specialtyName = (s, lang) => (!s ? "" : lang === "bn" && s.nameBangla ? s.nameBangla : s.name);

export function initials(name) {
  // Identical to the app, so the same doctor shows the same letters everywhere.
  const clean = String(name || "").replace(/^(dr\.?|prof\.?|ডা\.?|ডাঃ)\s*/i, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "Dr";
}

/** Words the doctor components need, picked once on the server. */
export const DOCTOR_KEYS = [
  "docCall", "docNewPatient", "docFollowUp", "docOnlineAvailable", "docChooseNumber", "close",
  "docAllDivisions", "docAllDistricts", "docChooseDivision", "docChooseDistrict", "docSearchDistrict",
  "docSearchPlaceholder", "docMatchingSpecialties", "docMatchingDoctors", "docNoResults", "docNoResultsSub",
  "docDoctorsFound", "docDoctorFound",
];
