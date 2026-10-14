import site from "@/site.config";

/**
 * Text of the About, Privacy, Terms and Delete-account pages.
 * Each page: { title, description, updated, intro?, sections: [{ h, p: [..], list?: [..] }] }
 * Update `UPDATED` whenever the wording changes.
 */
const UPDATED = { bn: "১৩ অক্টোবর ২০২৬", en: "13 October 2026" };

const bn = {
  about: {
    title: "আমাদের সম্পর্কে",
    description: "সেবা পাই — বাংলাদেশে পরিবারের স্বাস্থ্যসেবা সহজ করার প্ল্যাটফর্ম। ডাক্তারের তথ্য, ঘরে ওষুধ আর বাসায় কেয়ারগিভার।",
    intro: "বাবা-মা বা পরিবারের কারও অসুখ হলে ছোট ছোট কাজেই দিন চলে যায় — কোন ডাক্তার কোথায় বসেন, ওষুধ কোথায় পাওয়া যাবে, ইনজেকশন দিতে কে বাসায় আসবে। সেবা পাই এই কাজগুলো এক জায়গায় এনেছে।",
    sections: [
      { h: "আমরা কী করি", p: ["সেবা পাই-তে তিন ধরনের সেবা পাবেন:"], list: [
        "ডাক্তার: বিভাগ ও জেলা অনুযায়ী বিশেষজ্ঞ ডাক্তার, তাঁদের চেম্বারের ঠিকানা, সময়, ফি আর সিরিয়ালের নম্বর।",
        "ওষুধ: ব্র্যান্ড বা জেনেরিক নাম দিয়ে খুঁজে অর্ডার, প্রেসক্রিপশনের ছবি দিয়ে অর্ডার, আর বাসায় ডেলিভারি।",
        "কেয়ারগিভার ও নার্স: ইনজেকশন, ড্রেসিং, স্যালাইনের মতো জরুরি কাজ, আর বয়স্ক, শয্যাশায়ী বা অপারেশনের পরের রোগীর নিয়মিত দেখাশোনা।",
      ] },
      { h: "কীভাবে যাচাই করি", p: [
        "প্রত্যেক কেয়ারগিভার ও নার্সের জাতীয় পরিচয়পত্র, ছবি এবং প্রশিক্ষণের সনদ আমাদের টিম নিজে দেখে তারপর তালিকায় রাখে। ডাক্তারদের তথ্য তাঁদের চেম্বার বা প্রকাশিত উৎস থেকে নিয়ে নিয়মিত হালনাগাদ করা হয়।",
        "কোনো তথ্য ভুল দেখলে আমাদের জানান — আমরা দ্রুত ঠিক করি।",
      ] },
      { h: "দাম নিয়ে আমাদের নীতি", p: [
        "যে সেবার দাম ঠিক করা যায়, তার দাম আমরা আগেই লিখে রাখি। লুকোনো চার্জ নেই। ওষুধ বা সামগ্রী লাগলে তার দাম আলাদা, এবং সেটা আগে জানিয়ে নেওয়া হয়।",
      ] },
      { h: "আমাদের অফিস", p: [`${site.address.bn}। ${site.hours.bn}।`] },
    ],
  },

  privacy: {
    title: "গোপনীয়তা নীতি",
    description: "সেবা পাই আপনার কোন তথ্য নেয়, কেন নেয়, কার সঙ্গে শেয়ার করে এবং কীভাবে আপনি তা মুছে ফেলতে পারেন।",
    intro: `এই নীতি ${site.name.bn} মোবাইল অ্যাপ এবং ওয়েবসাইট (${site.url.replace(/^https?:\/\//, "")}) — দুটোর জন্যই প্রযোজ্য। আমরা শুধু সেই তথ্যই নিই যা সেবা দিতে দরকার।`,
    sections: [
      { h: "যে তথ্য আমরা নিই", list: [
        "অ্যাকাউন্ট: নাম, মোবাইল নম্বর এবং পাসওয়ার্ড। পাসওয়ার্ড এনক্রিপ্ট করে (hash) রাখা হয় — আমরা নিজেরাও তা দেখতে পারি না।",
        "অর্ডার ও বুকিং: ডেলিভারির ঠিকানা, রোগীর বয়স বা অবস্থার মতো যে তথ্য আপনি নিজে দেন, প্রেসক্রিপশনের ছবি এবং অর্ডারের ইতিহাস।",
        "লোকেশন: ডেলিভারির ঠিকানা ঠিক করতে বা কাছের সেবা দেখাতে, শুধু আপনি অনুমতি দিলে।",
        "নোটিফিকেশন: অর্ডারের খবর পাঠাতে আপনার ফোনের নোটিফিকেশন টোকেন।",
        "পার্টনার (কেয়ারগিভার, নার্স, রাইডার, দোকান): যাচাইয়ের জন্য জাতীয় পরিচয়পত্র, সেলফি, পুলিশ ক্লিয়ারেন্স ও সনদ।",
      ] },
      { h: "কেন নিই", list: [
        "অর্ডার ডেলিভারি, কেয়ারগিভার পাঠানো এবং আপনার সঙ্গে যোগাযোগ করতে।",
        "অর্ডারের অবস্থা জানাতে এবং সমস্যা হলে সমাধান করতে।",
        "প্রতারণা ঠেকাতে এবং পার্টনারদের যাচাই করতে।",
      ], after: ["আমরা আপনার তথ্য বিক্রি করি না এবং বিজ্ঞাপনের জন্য ব্যবহার করি না।"] },
      { h: "কার সঙ্গে শেয়ার হয়", p: [
        "আপনার অর্ডার যিনি সম্পন্ন করবেন — দোকান, রাইডার বা কেয়ারগিভার — শুধু তিনিই কাজের জন্য দরকারি অংশটুকু (নাম, ফোন, ঠিকানা) দেখেন।",
        "সেবা চালাতে আমরা এই প্রতিষ্ঠানগুলোর সার্ভিস ব্যবহার করি: MongoDB Atlas (ডেটাবেস), Render ও Vercel (সার্ভার ও ওয়েবসাইট), Cloudinary (ছবি সংরক্ষণ), Expo (নোটিফিকেশন)। তারা শুধু আমাদের হয়ে তথ্য সংরক্ষণ বা পাঠানোর কাজ করে।",
        "আইন অনুযায়ী সরকারি কর্তৃপক্ষ চাইলে প্রয়োজনীয় তথ্য দিতে হতে পারে।",
      ] },
      { h: "তথ্য কতদিন রাখি", p: [
        "অ্যাকাউন্ট চালু থাকা পর্যন্ত তথ্য রাখা হয়। অ্যাকাউন্ট মুছে ফেললে আপনার নাম, ফোন ও ঠিকানা মুছে দেওয়া হয়; হিসাবের প্রয়োজনে অর্ডারের রেকর্ড নামহীনভাবে থেকে যায়।",
      ] },
      { h: "নিরাপত্তা", p: [
        "সব তথ্য এনক্রিপ্টেড সংযোগে (HTTPS) আদান-প্রদান হয়। শুধু অনুমোদিত কর্মীরা প্রয়োজনমতো তথ্য দেখতে পারেন।",
      ] },
      { h: "আপনার অধিকার", p: [
        "আপনি যেকোনো সময় নিজের তথ্য দেখতে, ঠিক করতে বা অ্যাকাউন্ট মুছে ফেলতে পারেন। কীভাবে মুছবেন তা “অ্যাকাউন্ট মুছে ফেলা” পেজে লেখা আছে।",
        "এই সেবা ১৮ বছরের কম বয়সীদের নিজে অ্যাকাউন্ট খোলার জন্য নয়; পরিবারের বড় কেউ তাঁদের হয়ে অর্ডার করতে পারেন।",
      ] },
      { h: "যোগাযোগ", p: [`গোপনীয়তা নিয়ে প্রশ্ন থাকলে ইমেইল করুন ${site.email} অথবা কল করুন ${site.phoneDisplay.bn}।`] },
    ],
  },

  terms: {
    title: "ব্যবহারের শর্তাবলি",
    description: "সেবা পাই অ্যাপ ও ওয়েবসাইট ব্যবহারের শর্ত — অর্ডার, পেমেন্ট, বাতিল এবং দায়দায়িত্ব।",
    intro: `${site.name.bn} ব্যবহার করলে আপনি নিচের শর্তগুলো মেনে নিচ্ছেন।`,
    sections: [
      { h: "সেবার ধরন", p: [
        "সেবা পাই রোগী ও পরিবারকে ডাক্তারের তথ্য, ফার্মেসি, রাইডার এবং কেয়ারগিভার ও নার্সের সঙ্গে যুক্ত করে। ডাক্তারের তথ্য শুধু খোঁজার সুবিধার জন্য; চিকিৎসার সিদ্ধান্ত ডাক্তারের পরামর্শ অনুযায়ী নিন।",
        "সেবা পাই জরুরি চিকিৎসা সেবা নয়। জরুরি অবস্থায় নিকটস্থ হাসপাতালে যান বা ৯৯৯-এ কল করুন।",
      ] },
      { h: "অ্যাকাউন্ট", p: [
        "সঠিক নাম ও নিজের মোবাইল নম্বর দিয়ে অ্যাকাউন্ট খুলুন। পাসওয়ার্ড কাউকে দেবেন না — আপনার অ্যাকাউন্ট থেকে হওয়া অর্ডারের দায় আপনার।",
      ] },
      { h: "ওষুধের অর্ডার", list: [
        "প্রেসক্রিপশন লাগে এমন ওষুধের জন্য বৈধ প্রেসক্রিপশনের ছবি দিতে হবে। প্রেসক্রিপশন ছাড়া এসব ওষুধ দেওয়া হবে না।",
        "দোকানে ওষুধ না থাকলে বা দাম বদলালে আমরা ডেলিভারির আগে আপনাকে জানাব।",
        "পেমেন্ট ডেলিভারির সময় ক্যাশে (ক্যাশ অন ডেলিভারি)।",
        "ডেলিভারির আগে অর্ডার বাতিল করা যায়। ভুল বা ক্ষতিগ্রস্ত ওষুধ এলে ডেলিভারির সময়ই জানান।",
      ] },
      { h: "কেয়ারগিভার ও নার্স", list: [
        "ওয়েবসাইট বা অ্যাপে লেখা দাম শুধু সেবার মজুরি; ওষুধ, সামগ্রী ও যাতায়াতের বাড়তি খরচ (যদি থাকে) আগে জানিয়ে নেওয়া হয়।",
        "কেয়ারগিভার আসার আগে বুকিং বাতিল করতে আমাদের কল করুন।",
        "কেয়ারগিভার বা নার্স ডাক্তারের দেওয়া নির্দেশনার বাইরে চিকিৎসা দেন না।",
      ] },
      { h: "দায়দায়িত্ব", p: [
        "পার্টনারদের যাচাই করতে আমরা যথাসাধ্য চেষ্টা করি, তবে তাঁরা স্বাধীনভাবে কাজ করেন। কোনো অভিযোগ থাকলে ২৪ ঘণ্টার মধ্যে আমাদের জানান — আমরা তদন্ত করে ব্যবস্থা নিই।",
      ] },
      { h: "পরিবর্তন", p: ["এই শর্তাবলি সময়ে সময়ে হালনাগাদ হতে পারে। বড় পরিবর্তন হলে অ্যাপে জানানো হবে। শর্তাবলি বাংলাদেশের আইন অনুযায়ী পরিচালিত।"] },
      { h: "যোগাযোগ", p: [`${site.phoneDisplay.bn} · ${site.email}`] },
    ],
  },

  deleteAccount: {
    title: "অ্যাকাউন্ট মুছে ফেলা",
    description: "সেবা পাই অ্যাকাউন্ট এবং তার তথ্য কীভাবে মুছে ফেলবেন, আর কোন তথ্য থেকে যায়।",
    intro: "আপনি যেকোনো সময় আপনার সেবা পাই অ্যাকাউন্ট মুছে ফেলতে পারেন।",
    sections: [
      { h: "অ্যাপ থেকে", list: [
        "সেবা পাই অ্যাপ খুলুন এবং লগইন করুন।",
        "নিচের “প্রোফাইল” ট্যাবে যান।",
        "“অ্যাকাউন্ট মুছে ফেলুন” চাপুন এবং নিশ্চিত করুন।",
      ] },
      { h: "অ্যাপ ছাড়া", p: [
        `অ্যাকাউন্টের মোবাইল নম্বর থেকে ${site.phoneDisplay.bn} নম্বরে কল বা হোয়াটসঅ্যাপ করুন, অথবা ${site.email} ঠিকানায় ইমেইল করুন। নম্বরটি আপনার কি না নিশ্চিত হয়ে ৭ দিনের মধ্যে অ্যাকাউন্ট মুছে দেওয়া হবে।`,
      ] },
      { h: "কী মুছে যায়", list: [
        "আপনার নাম, মোবাইল নম্বর, পাসওয়ার্ড ও সংরক্ষিত ঠিকানা।",
        "প্রেসক্রিপশনের ছবি এবং নোটিফিকেশন টোকেন।",
        "পার্টনার হলে যাচাইয়ের কাগজপত্র (পরিচয়পত্র, সেলফি, সনদ)।",
      ] },
      { h: "কী থেকে যায়", p: [
        "হিসাব ও আইনগত প্রয়োজনে আগের অর্ডারের রেকর্ড (তারিখ, ওষুধ, দাম) নামহীনভাবে থেকে যায় — সেগুলো আর আপনার সঙ্গে যুক্ত থাকে না।",
      ] },
    ],
  },
};

const en = {
  about: {
    title: "About us",
    description: "Sheba Pai makes family healthcare simple in Bangladesh — doctor information, medicine delivered and caregivers at home.",
    intro: "When a parent or anyone in the family is unwell, the day goes on small jobs: which doctor sits where, where to find the medicine, who can come home to give an injection. Sheba Pai brings these into one place.",
    sections: [
      { h: "What we do", p: ["Sheba Pai offers three kinds of service:"], list: [
        "Doctors: specialists by department and district, with chamber address, hours, fees and serial numbers.",
        "Medicine: search by brand or generic name, order with a prescription photo, and get it delivered.",
        "Caregivers and nurses: urgent jobs like injections, dressing and saline, and regular care for elderly, bedridden or post-surgery patients.",
      ] },
      { h: "How we verify", p: [
        "Our team checks every caregiver's and nurse's national ID, photo and training certificates before they are listed. Doctor information comes from their chambers or published sources and is updated regularly.",
        "If you see anything wrong, tell us — we fix it quickly.",
      ] },
      { h: "How we price", p: [
        "Where a service can have a fixed price, we show it upfront. There are no hidden charges. Medicine or supplies, if needed, are charged separately and agreed with you first.",
      ] },
      { h: "Our office", p: [`${site.address.en}. ${site.hours.en}.`] },
    ],
  },

  privacy: {
    title: "Privacy policy",
    description: "What information Sheba Pai collects, why, who it is shared with, and how you can delete it.",
    intro: `This policy covers both the ${site.name.en} mobile app and the website (${site.url.replace(/^https?:\/\//, "")}). We only collect what we need to provide the service.`,
    sections: [
      { h: "What we collect", list: [
        "Account: name, mobile number and password. Passwords are stored hashed — even we cannot read them.",
        "Orders and bookings: delivery address, details you give about the patient, prescription photos and order history.",
        "Location: to set a delivery address or show nearby services, only when you allow it.",
        "Notifications: your device's notification token, to send order updates.",
        "Partners (caregivers, nurses, riders, shops): national ID, selfie, police clearance and certificates for verification.",
      ] },
      { h: "Why we collect it", list: [
        "To deliver orders, send caregivers and contact you.",
        "To keep you updated on orders and resolve problems.",
        "To prevent fraud and verify partners.",
      ], after: ["We do not sell your information or use it for advertising."] },
      { h: "Who sees it", p: [
        "Only the shop, rider or caregiver handling your order sees the part they need (name, phone, address).",
        "We use these service providers to run Sheba Pai: MongoDB Atlas (database), Render and Vercel (servers and website), Cloudinary (image storage) and Expo (notifications). They only store or deliver data on our behalf.",
        "We may have to share information with government authorities when the law requires it.",
      ] },
      { h: "How long we keep it", p: [
        "We keep your information while your account is open. When you delete your account, your name, phone and addresses are erased; order records stay, anonymised, for accounting.",
      ] },
      { h: "Security", p: ["All data travels over encrypted connections (HTTPS). Only authorised staff can view information, and only when needed."] },
      { h: "Your rights", p: [
        "You can view, correct or delete your information at any time. The Delete your account page explains how.",
        "Sheba Pai is not for people under 18 to open their own account; an adult family member can order on their behalf.",
      ] },
      { h: "Contact", p: [`For privacy questions, email ${site.email} or call ${site.phoneDisplay.en}.`] },
    ],
  },

  terms: {
    title: "Terms of use",
    description: "Terms for using the Sheba Pai app and website — orders, payment, cancellation and responsibility.",
    intro: `By using ${site.name.en}, you agree to these terms.`,
    sections: [
      { h: "The service", p: [
        "Sheba Pai connects patients and families with doctor information, pharmacies, riders, and caregivers and nurses. Doctor information is for finding care; follow your doctor's advice for treatment decisions.",
        "Sheba Pai is not an emergency service. In an emergency, go to the nearest hospital or call 999.",
      ] },
      { h: "Your account", p: ["Use your real name and your own mobile number. Keep your password private — you are responsible for orders placed from your account."] },
      { h: "Medicine orders", list: [
        "Prescription medicine needs a photo of a valid prescription. We will not supply it without one.",
        "If a medicine is out of stock or its price changes, we tell you before delivery.",
        "Payment is cash on delivery.",
        "You can cancel before delivery. If the wrong or damaged medicine arrives, tell us at delivery.",
      ] },
      { h: "Caregivers and nurses", list: [
        "Listed prices are for the service only; medicine, supplies and any extra travel cost are agreed with you first.",
        "To cancel a booking before the caregiver arrives, call us.",
        "Caregivers and nurses do not give treatment beyond a doctor's instructions.",
      ] },
      { h: "Responsibility", p: ["We do our best to verify partners, but they work independently. If you have a complaint, tell us within 24 hours — we investigate and act."] },
      { h: "Changes", p: ["These terms may be updated from time to time; we announce major changes in the app. They are governed by the laws of Bangladesh."] },
      { h: "Contact", p: [`${site.phoneDisplay.en} · ${site.email}`] },
    ],
  },

  deleteAccount: {
    title: "Delete your account",
    description: "How to delete your Sheba Pai account and its data, and what is kept.",
    intro: "You can delete your Sheba Pai account at any time.",
    sections: [
      { h: "From the app", list: [
        "Open the Sheba Pai app and sign in.",
        "Go to the Profile tab.",
        "Tap Delete account and confirm.",
      ] },
      { h: "Without the app", p: [
        `Call or WhatsApp ${site.phoneDisplay.en} from your account's mobile number, or email ${site.email}. Once we confirm the number is yours, the account is deleted within 7 days.`,
      ] },
      { h: "What is deleted", list: [
        "Your name, mobile number, password and saved addresses.",
        "Prescription photos and notification tokens.",
        "For partners, verification documents (ID, selfie, certificates).",
      ] },
      { h: "What is kept", p: ["Past order records (date, items, price) are kept anonymised for accounting and legal reasons — they are no longer linked to you."] },
    ],
  },
};

export function legal(lang, key) {
  return { ...(lang === "en" ? en : bn)[key], updated: UPDATED[lang] };
}
