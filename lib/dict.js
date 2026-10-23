/**
 * Every visible word on the website, in both languages. Pages read
 * `dict(lang)`; legal page texts live in their own files under lib/legal/.
 */
const bn = {
  skip: "মূল অংশে যান",
  nav: { doctors: "ডাক্তার", medicine: "ওষুধ", caregiver: "কেয়ারগিভার", about: "আমাদের সম্পর্কে", contact: "যোগাযোগ" },
  call: "কল করুন",
  callUs: "আমাদের কল করুন",
  whatsapp: "হোয়াটসঅ্যাপ",
  menu: "মেনু",
  close: "বন্ধ করুন",
  langSwitch: "English",
  langSwitchLabel: "Switch to English",
  getApp: "অ্যাপ ডাউনলোড",

  heroTitle: "বাবা-মায়ের যত্ন, এক জায়গায়",
  heroSub: "বিশেষজ্ঞ ডাক্তারের চেম্বারের খোঁজ, ঘরে বসে ওষুধ, আর বাসায় যাচাই করা কেয়ারগিভার ও নার্স — ঢাকাসহ সারা দেশে।",
  searchLabel: "ডাক্তার খুঁজুন",
  searchPlaceholder: "বিভাগ, উপসর্গ বা ডাক্তারের নাম — যেমন: হার্ট, মাথাব্যথা",
  searchBtn: "খুঁজুন",
  popular: "জনপ্রিয়:",
  tileCare: "বাসায় কেয়ারগিভার",
  tileDoctor: "ডাক্তারের চেম্বার",
  tileMedicine: "ঘরে ওষুধ",

  facts: [
    { t: "পরিচয় যাচাই করা কেয়ারগিভার", d: "জাতীয় পরিচয়পত্র ও কাগজপত্র দেখে তবেই তালিকায়" },
    { t: "দাম আগেই জানা", d: "সেবা ও প্যাকেজের দাম খোলাখুলি লেখা" },
    { t: "ক্যাশ অন ডেলিভারি", d: "ওষুধ হাতে পেয়ে টাকা দিন" },
  ],

  servicesTitle: "যে সেবাগুলো পাবেন",
  servicesSub: "একটি অ্যাকাউন্টে পুরো পরিবারের স্বাস্থ্যসেবা।",
  svc: {
    caregiver: { t: "বাসায় কেয়ারগিভার ও নার্স", d: "ইনজেকশন, ড্রেসিং, স্যালাইনের মতো জরুরি কাজ থেকে শুরু করে বয়স্ক বা শয্যাশায়ী রোগীর মাসিক দেখাশোনা।", cta: "সেবা ও দাম দেখুন" },
    doctor: { t: "ডাক্তার ও চেম্বারের তথ্য", d: "বিভাগ আর জেলা অনুযায়ী বিশেষজ্ঞ ডাক্তার, চেম্বারের ঠিকানা, সময়, ফি আর সিরিয়ালের নম্বর।", cta: "ডাক্তার খুঁজুন" },
    medicine: { t: "ওষুধ অর্ডার", d: "ব্র্যান্ড বা জেনেরিক নাম দিয়ে খুঁজে অর্ডার করুন। প্রেসক্রিপশনের ওষুধে শুধু ছবি তুলে দিন।", cta: "ওষুধ দেখুন" },
  },
  soonTitle: "শীঘ্রই আসছে",
  soon: [
    { t: "বাসা থেকে টেস্টের নমুনা সংগ্রহ", img: "test" },
    { t: "মেডিকেল যন্ত্রপাতি", img: "equipment" },
    { t: "অ্যাম্বুলেন্স", img: null },
  ],

  pricesTitle: "বাসায় নার্স — দাম আগেই জানুন",
  pricesSub: "প্রশিক্ষিত নার্স আপনার বাসায় এসে সেবা দেবেন। ওষুধ বা সামগ্রী লাগলে তার দাম আলাদা।",
  pricesMore: "অন্য সেবার জন্য কল করুন",
  perVisit: "প্রতি ভিজিট",
  perMonth: "প্রতি মাস",
  perDay: "প্রতি দিন",
  per12: "প্রতি ১২ ঘণ্টা",
  priceOnCall: "দাম জানতে কল করুন",
  book: "বুক করুন",

  specTitle: "বিভাগ অনুযায়ী ডাক্তার",
  specSub: "যে বিভাগের ডাক্তার দরকার সেটি বেছে নিন, তারপর আপনার জেলা।",
  specAll: "সব বিভাগ দেখুন",
  doctorsCount: (n) => `${n} জন ডাক্তার`,

  howTitle: "কীভাবে কাজ করে",
  how: [
    { t: "সেবা বেছে নিন", d: "ডাক্তার, ওষুধ বা কেয়ারগিভার — যা দরকার। দাম আগেই দেখতে পাবেন।" },
    { t: "নাম ও ফোন নম্বর দিন", d: "লম্বা ফর্ম নেই। আমাদের টিম ফোন করে বাকিটা জেনে নেবে।" },
    { t: "সেবা পৌঁছে যাবে", d: "ওষুধ আপনার ঠিকানায়, কেয়ারগিভার আপনার বাসায়। প্রতিটি ধাপ অ্যাকাউন্ট থেকে দেখা যাবে।" },
  ],

  faqTitle: "সাধারণ প্রশ্ন",
  faq: [
    { q: "সেবা পাই কোন কোন এলাকায় সেবা দেয়?", a: "ডাক্তার ও চেম্বারের তথ্য সারা বাংলাদেশের জন্য। ওষুধ ঢাকার ভেতরে ও বাইরে কুরিয়ারে পাঠানো হয়। কেয়ারগিভার যে জেলাগুলোতে কাজ করেন, তালিকায় সেই জেলাগুলো লেখা থাকে।" },
    { q: "কেয়ারগিভারদের কীভাবে যাচাই করা হয়?", a: "প্রত্যেকের জাতীয় পরিচয়পত্র, ছবি এবং প্রয়োজনে প্রশিক্ষণ সনদ ও পুলিশ ক্লিয়ারেন্স আমাদের টিম দেখে নেয়। যাচাই শেষ হলেই তাঁরা তালিকায় আসেন।" },
    { q: "টাকা কীভাবে দেব?", a: "ওষুধে ক্যাশ অন ডেলিভারি — হাতে পেয়ে টাকা দিন। কেয়ারগিভার সেবার দাম ও পরিশোধের নিয়ম আমাদের টিম ফোনে নিশ্চিত করে।" },
    { q: "প্রেসক্রিপশন লাগে এমন ওষুধ কীভাবে অর্ডার করব?", a: "অর্ডারের সময় প্রেসক্রিপশনের একটি পরিষ্কার ছবি দিন। ছবি দেখে আমাদের ফার্মাসিস্ট অর্ডার নিশ্চিত করবেন।" },
    { q: "অ্যাপ ছাড়া কি ওয়েবসাইট থেকেই সব করা যাবে?", a: "হ্যাঁ। একই অ্যাকাউন্ট দিয়ে ওয়েবসাইট ও অ্যাপ — দুই জায়গা থেকেই অর্ডার, বুকিং আর অবস্থা দেখা যাবে।" },
  ],

  appTitle: "অ্যাপেও আছে সেবা পাই",
  appSub: "অর্ডারের খবর নোটিফিকেশনে পান, এক ট্যাপে আবার অর্ডার করুন।",
  appBtn: "Google Play থেকে নিন",

  footerAbout: "পরিবারের স্বাস্থ্যসেবা সহজ করার একটি বাংলাদেশি প্ল্যাটফর্ম।",
  footerServices: "সেবা",
  footerCompany: "প্রতিষ্ঠান",
  footerHelp: "সাহায্য",
  privacy: "গোপনীয়তা নীতি",
  terms: "ব্যবহারের শর্তাবলি",
  deleteAccount: "অ্যাকাউন্ট মুছে ফেলা",
  rights: "সর্বস্বত্ব সংরক্ষিত",
  disclaimer: "জরুরি অবস্থায় নিকটস্থ হাসপাতালে যান বা ৯৯৯-এ কল করুন।",

  soonPageTitle: (name) => `${name} — ওয়েবসাইটে শীঘ্রই`,
  soonPageBody: "এই অংশটি ওয়েবসাইটে খুব শীঘ্রই চালু হচ্ছে। এখনই সেবা নিতে আমাদের কল করুন বা অ্যাপ ব্যবহার করুন।",
  backHome: "হোম পেজে ফিরুন",

  notFoundTitle: "পেজটি পাওয়া যায়নি",
  notFoundBody: "লিংকটি পুরোনো বা ভুল হতে পারে। হোম পেজ থেকে আবার খুঁজে দেখুন।",

  aboutTitle: "আমাদের সম্পর্কে",
  contactTitle: "যোগাযোগ",
  contactSub: "প্রশ্ন, অভিযোগ বা অর্ডারের খোঁজ — যেকোনো দরকারে আমাদের জানান।",
  contactPhone: "ফোন",
  contactWa: "হোয়াটসঅ্যাপ",
  contactEmail: "ইমেইল",
  contactAddress: "অফিস",
  contactHours: "সময়",
  updated: "সর্বশেষ হালনাগাদ",
  guestTitle: "অতিথি",
  guestSub: "ওয়েবসাইটে লগইন খুব শীঘ্রই চালু হচ্ছে। এখন অর্ডার বা বুকিংয়ের জন্য কল করুন বা অ্যাপ ব্যবহার করুন।",
};

const en = {
  skip: "Skip to main content",
  nav: { doctors: "Doctors", medicine: "Medicine", caregiver: "Caregivers", about: "About", contact: "Contact" },
  call: "Call",
  callUs: "Call us",
  whatsapp: "WhatsApp",
  menu: "Menu",
  close: "Close",
  langSwitch: "বাংলা",
  langSwitchLabel: "বাংলায় দেখুন",
  getApp: "Get the app",

  heroTitle: "Care for your parents, all in one place",
  heroSub: "Find specialist doctors and their chambers, get medicine delivered, and book verified caregivers and nurses at home — in Dhaka and across Bangladesh.",
  searchLabel: "Find a doctor",
  searchPlaceholder: "Specialty, symptom or doctor's name — e.g. heart, headache",
  searchBtn: "Search",
  popular: "Popular:",
  tileCare: "Caregivers at home",
  tileDoctor: "Doctors' chambers",
  tileMedicine: "Medicine delivered",

  facts: [
    { t: "ID-verified caregivers", d: "Listed only after we check their national ID and papers" },
    { t: "Prices shown up front", d: "Every service and package has its price written" },
    { t: "Cash on delivery", d: "Pay when the medicine reaches you" },
  ],

  servicesTitle: "What you can get",
  servicesSub: "Healthcare for the whole family, from one account.",
  svc: {
    caregiver: { t: "Caregivers & nurses at home", d: "From urgent jobs like injections, dressing and saline, to monthly care for elderly or bedridden patients.", cta: "See services & prices" },
    doctor: { t: "Doctors & chambers", d: "Specialists by department and district, with chamber address, hours, fees and serial numbers.", cta: "Find a doctor" },
    medicine: { t: "Order medicine", d: "Search by brand or generic name and order. For prescription medicine, just add a photo.", cta: "Browse medicine" },
  },
  soonTitle: "Coming soon",
  soon: [
    { t: "Test samples collected at home", img: "test" },
    { t: "Medical equipment", img: "equipment" },
    { t: "Ambulance", img: null },
  ],

  pricesTitle: "Nurse at home — see the price first",
  pricesSub: "A trained nurse comes to your home. Medicine or supplies, if needed, are charged separately.",
  pricesMore: "Call for any other service",
  perVisit: "per visit",
  perMonth: "per month",
  perDay: "per day",
  per12: "per 12 hours",
  priceOnCall: "Call for price",
  book: "Book",

  specTitle: "Doctors by specialty",
  specSub: "Choose the specialty you need, then your district.",
  specAll: "See all specialties",
  doctorsCount: (n) => `${n} doctor${n === 1 ? "" : "s"}`,

  howTitle: "How it works",
  how: [
    { t: "Choose a service", d: "A doctor, medicine or a caregiver — whatever you need. Prices are shown first." },
    { t: "Leave your name and number", d: "No long forms. Our team calls you for the rest." },
    { t: "We bring it to you", d: "Medicine to your address, a caregiver to your home. Follow every step from your account." },
  ],

  faqTitle: "Common questions",
  faq: [
    { q: "Where does Sheba Pai work?", a: "Doctor and chamber information covers all of Bangladesh. Medicine is delivered inside and outside Dhaka by courier. Each caregiver's listing shows the districts they work in." },
    { q: "How are caregivers checked?", a: "Our team checks every caregiver's national ID, photo, and — where needed — training certificates and police clearance. Only then are they listed." },
    { q: "How do I pay?", a: "Medicine is cash on delivery. For caregiver services, our team confirms the price and how to pay on the phone." },
    { q: "How do I order prescription medicine?", a: "Add a clear photo of the prescription when you order. Our pharmacist checks it before confirming." },
    { q: "Can I do everything on the website, without the app?", a: "Yes. The same account works on the website and the app — order, book and track from either." },
  ],

  appTitle: "Sheba Pai is also an app",
  appSub: "Get order updates as notifications and reorder in one tap.",
  appBtn: "Get it on Google Play",

  footerAbout: "A Bangladeshi platform that makes family healthcare simple.",
  footerServices: "Services",
  footerCompany: "Company",
  footerHelp: "Help",
  privacy: "Privacy policy",
  terms: "Terms of use",
  deleteAccount: "Delete your account",
  rights: "All rights reserved",
  disclaimer: "In an emergency, go to the nearest hospital or call 999.",

  soonPageTitle: (name) => `${name} — coming soon to the website`,
  soonPageBody: "This part of the website is launching very soon. To use the service now, call us or use the app.",
  backHome: "Back to home",

  notFoundTitle: "Page not found",
  notFoundBody: "The link may be old or mistyped. Start again from the home page.",

  aboutTitle: "About us",
  contactTitle: "Contact",
  contactSub: "Questions, complaints or checking on an order — tell us anything.",
  contactPhone: "Phone",
  contactWa: "WhatsApp",
  contactEmail: "Email",
  contactAddress: "Office",
  contactHours: "Hours",
  updated: "Last updated",
  guestTitle: "Guest",
  guestSub: "Signing in on the website is coming very soon. To order or book now, call us or use the app.",
};

export function dict(lang) {
  return lang === "en" ? en : bn;
}
