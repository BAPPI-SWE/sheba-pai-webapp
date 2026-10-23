// Pictures for caregiver services — the same files as the app's assets/icons/care.
const KNOWN = new Set(["bedridden", "catheter", "checkup", "dementia", "dressing", "elderly", "general", "hospital", "injection", "livein", "newborn", "ngtube", "night", "nursing", "postop", "saline", "stroke"]);
export const careIcon = (key) => `/img/care/${KNOWN.has(key) ? key : "general"}.webp`;
