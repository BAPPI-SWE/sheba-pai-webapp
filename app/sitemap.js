import site from "@/site.config";
import { href } from "@/lib/i18n";

const PAGES = [
  ["/", 1, "daily"], ["/doctors", 0.9, "daily"], ["/medicine", 0.9, "daily"], ["/caregiver", 0.9, "weekly"],
  ["/about", 0.5, "monthly"], ["/contact", 0.5, "monthly"],
  ["/privacy", 0.2, "yearly"], ["/terms", 0.2, "yearly"], ["/delete-account", 0.2, "yearly"],
];

export default function sitemap() {
  const now = new Date();
  return PAGES.flatMap(([path, priority, changeFrequency]) =>
    ["bn", "en"].map((lang) => ({
      url: `${site.url}${href(lang, path)}`,
      lastModified: now,
      changeFrequency,
      priority: lang === "bn" ? priority : Math.round(priority * 8) / 10,
      alternates: { languages: { "bn-BD": `${site.url}${href("bn", path)}`, en: `${site.url}${href("en", path)}` } },
    })),
  );
}
