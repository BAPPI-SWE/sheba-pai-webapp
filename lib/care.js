import { placeLabel } from "@/lib/doctors";
export { careIcon } from "@/lib/careIcons";

/**
 * Caregiver helpers — the same rules as the app's CareCards.js
 * (prices, names, shifts, levels, request statuses).
 */
export const SHIFT_KEYS = ["day8", "day12", "night12", "live24"];
export const SHIFT_ICONS = { day8: "partly-sunny-outline", day12: "sunny-outline", night12: "moon-outline", live24: "home-outline" };
export const OPEN_CARE_STATUSES = ["new", "contacted", "confirmed", "ongoing"];

export const CARE_STATUS = {
  new: { key: "careStNew", tone: "warning", icon: "time-outline" },
  contacted: { key: "careStContacted", tone: "primary", icon: "call-outline" },
  confirmed: { key: "careStConfirmed", tone: "primary", icon: "checkmark-circle-outline" },
  ongoing: { key: "careStOngoing", tone: "success", icon: "heart-outline" },
  completed: { key: "careStCompleted", tone: "success", icon: "ribbon-outline" },
  cancelled: { key: "careStCancelled", tone: "danger", icon: "close-circle-outline" },
};

/** ৳1,200 — plain digits, like the app. */
export function formatTaka(n) {
  if (n == null) return "";
  return `৳${String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export const offerName = (o, lang) => (!o ? "" : lang === "bn" && o.nameBangla ? o.nameBangla : o.name);
export function offerText(o, lang, key) {
  const bn = o?.[`${key}Bangla`];
  return lang === "bn" && bn ? bn : o?.[key] || bn || "";
}
export function offerFeatures(o, lang) {
  const bn = o?.featuresBangla || [], en = o?.features || [];
  return lang === "bn" ? (bn.length ? bn : en) : (en.length ? en : bn);
}
export const categoryName = (c, lang) => (!c ? "" : lang === "bn" && c.nameBangla ? c.nameBangla : c.name);

export function tierMeta(tx, tier) {
  if (tier === "nurse") return { label: tx("careTier_nurse"), tone: "helper", icon: "medkit" };
  if (tier === "trained") return { label: tx("careTier_trained"), tone: "primary", icon: "school" };
  return { label: tx("careTier_attendant"), tone: "muted", icon: "heart" };
}

/** "Dhaka, Gazipur +2" in the page language. */
export function districtsText(districts = [], lang, max = 2) {
  const names = districts.slice(0, max).map((d) => placeLabel(d, lang));
  const more = districts.length - max;
  return names.join(", ") + (more > 0 ? ` +${more}` : "");
}

export function yearsText(tx, lang, n) {
  if (!n) return tx("careNewToPlatform");
  return lang === "bn" ? `${n} বছর অভিজ্ঞ` : `${n} yr${n === 1 ? "" : "s"} exp.`;
}

/** Offer prices for Google (Service + Offer). */
export function offerLd(o, lang, url) {
  return {
    "@type": "Service", name: offerName(o, lang), description: offerText(o, lang, "description") || undefined,
    areaServed: { "@type": "Country", name: "Bangladesh" }, url,
    ...(o.price != null ? { offers: { "@type": "Offer", price: o.price, priceCurrency: "BDT" } } : {}),
  };
}

/** Words the server pages hand to the shared pieces (keys must exist in the app's text). */
export const CARE_KEYS = [
  "careFrom", "carePriceOnCall", "careFeatured", "careBusyNow", "careNewToPlatform", "careTier_nurse", "careTier_trained", "careTier_attendant",
  "careUnit_day8", "careUnit_day12", "careUnit_night12", "careUnit_live24", "careUnit_month", "careUnit_visit",
  "offerUnit_day", "offerUnit_month", "offerUnit_shift12", "offerUnit_visit",
  "careCallShort", "careMessageShort", "careBook", "careIdLabel",
];
