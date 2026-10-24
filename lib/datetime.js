// COPIED from the mobile app (app/datetime.js) — dates and times shown exactly as in the app.
/**
 * Dates and times, shown the same way on every screen.
 *
 * Always Bangladesh time (UTC+6, no daylight saving) — never the phone's
 * timezone setting, so an order placed at 2:35 PM in Dhaka reads 2:35 PM for
 * everyone. No Intl dependency (Hermes on older Android phones handles locale
 * dates inconsistently), so Bangla months, digits and "দুপুর / বিকেল" are built here.
 *
 *   fmtDateTime(iso, lang)  ১৩ অক্টোবর ২০২৬, দুপুর ২:৩৫    13 Oct 2026, 2:35 PM
 *   fmtSmart(iso, lang)     আজ, দুপুর ২:৩৫ / গতকাল, … / full date
 *   fmtDate(iso, lang)      ১৩ অক্টোবর ২০২৬                 13 Oct 2026
 *   fmtTime(iso, lang)      দুপুর ২:৩৫                     2:35 PM
 *   timeAgo(iso, lang)      ৫ মিনিট আগে                    5 min ago
 */
const OFFSET_MS = 6 * 60 * 60 * 1000;
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const MONTHS_BN = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function bnDigits(v) {
  return String(v).replace(/[0-9]/g, (d) => BN_DIGITS[d]);
}
const num = (v, lang) => (lang === "bn" ? bnDigits(v) : String(v));

/** Calendar parts in Dhaka time, or null for a missing/invalid date. */
function parts(iso) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  const d = new Date(t + OFFSET_MS);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), min: d.getUTCMinutes(), t };
}

function dayNumber(t) {
  return Math.floor((t + OFFSET_MS) / 86400000);
}

function bnPeriod(h) {
  if (h < 4) return "রাত";
  if (h < 6) return "ভোর";
  if (h < 12) return "সকাল";
  if (h < 15) return "দুপুর";
  if (h < 18) return "বিকেল";
  if (h < 20) return "সন্ধ্যা";
  return "রাত";
}

export function fmtTime(iso, lang) {
  const p = parts(iso);
  if (!p) return "";
  const h12 = p.h % 12 || 12;
  const mm = String(p.min).padStart(2, "0");
  if (lang === "bn") return `${bnPeriod(p.h)} ${bnDigits(h12)}:${bnDigits(mm)}`;
  return `${h12}:${mm} ${p.h < 12 ? "AM" : "PM"}`;
}

export function fmtDate(iso, lang, { year = true } = {}) {
  const p = parts(iso);
  if (!p) return "";
  if (lang === "bn") return `${bnDigits(p.d)} ${MONTHS_BN[p.m]}${year ? ` ${bnDigits(p.y)}` : ""}`;
  return `${p.d} ${MONTHS_EN[p.m]}${year ? ` ${p.y}` : ""}`;
}

export function fmtDateTime(iso, lang) {
  if (!parts(iso)) return "";
  return `${fmtDate(iso, lang)}, ${fmtTime(iso, lang)}`;
}

/** "আজ, দুপুর ২:৩৫" / "গতকাল, …" / same year → no year / else full. */
export function fmtSmart(iso, lang) {
  const p = parts(iso);
  if (!p) return "";
  const diffDays = dayNumber(Date.now()) - dayNumber(p.t);
  if (diffDays === 0) return `${lang === "bn" ? "আজ" : "Today"}, ${fmtTime(iso, lang)}`;
  if (diffDays === 1) return `${lang === "bn" ? "গতকাল" : "Yesterday"}, ${fmtTime(iso, lang)}`;
  const sameYear = parts(Date.now()).y === p.y;
  return `${fmtDate(iso, lang, { year: !sameYear })}, ${fmtTime(iso, lang)}`;
}

export function timeAgo(iso, lang) {
  const p = parts(iso);
  if (!p) return "";
  const s = Math.max(0, Math.floor((Date.now() - p.t) / 1000));
  const bn = lang === "bn";
  if (s < 60) return bn ? "এইমাত্র" : "just now";
  if (s < 3600) { const n = Math.floor(s / 60); return bn ? `${num(n, lang)} মিনিট আগে` : `${n} min ago`; }
  if (s < 86400) { const n = Math.floor(s / 3600); return bn ? `${num(n, lang)} ঘণ্টা আগে` : `${n} hr${n === 1 ? "" : "s"} ago`; }
  return fmtSmart(iso, lang);
}

/** The order number customers see: "MD-7K3M9Q" (older orders: last 6 of the id). */
export function orderNumber(order) {
  if (!order) return "";
  return order.orderNo || `#${String(order._id || "").slice(-6).toUpperCase()}`;
}
