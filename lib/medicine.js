/** Medicine helpers shared by server and browser — same rules as the app's MedicineCards.js. */
export const medName = (m, lang) => (lang === "en" ? m.brandName : m.brandNameBangla || m.brandName);
export const genName = (g, lang) => (!g ? "" : lang === "en" ? g.name : g.nameBangla || g.name);
export const shownPrice = (m) => (m.onSale ? m.effectivePrice : m.price);
export const inStock = (m) => !(m.stock <= 0 || m.isAvailable === false);
export const pick = (lang, en, bn) => (lang === "en" ? en : bn || en);
