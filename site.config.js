/**
 * Everything about the business in ONE place. Change these when the details
 * are final — every page, the footer, Google's business info and the
 * share previews read from here.
 *
 * TODO before launch: real phone, WhatsApp, email and address.
 */
const site = {
  name: { bn: "সেবা পাই", en: "Sheba Pai" },
  // The live web address. Set NEXT_PUBLIC_SITE_URL in Vercel once you have a domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://sheba-pai-webapp.vercel.app").replace(/\/$/, ""),
  // The app's backend (same server as the mobile app).
  apiUrl: (process.env.NEXT_PUBLIC_API_URL || "https://sheba-pai.onrender.com").replace(/\/$/, ""),

  phone: "+8801700000000", // PLACEHOLDER
  phoneDisplay: { bn: "০১৭০০-০০০০০০", en: "01700-000000" }, // PLACEHOLDER
  whatsapp: "8801700000000", // PLACEHOLDER — international format, no +
  email: "hello@shebapai.com", // PLACEHOLDER

  address: {
    bn: "শ্যামলী, ঢাকা ১২০৭, বাংলাদেশ",
    en: "Shyamoli, Dhaka 1207, Bangladesh",
    street: "Shyamoli",
    locality: "Dhaka",
    postalCode: "1207",
    country: "BD",
  },
  hours: { bn: "প্রতিদিন সকাল ৮টা – রাত ১০টা", en: "Every day, 8 am – 10 pm" },

  playStoreUrl: "https://play.google.com/store/apps/details?id=com.paisoftlab.shebapai",
};

export default site;
