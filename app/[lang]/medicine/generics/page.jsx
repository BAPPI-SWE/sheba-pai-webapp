import Link from "next/link";
import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import { getJSON } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { genName } from "@/lib/medicine";
import { pageMeta } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({
    lang, path: "/medicine/generics",
    title: lang === "bn" ? "জেনেরিক নাম অনুযায়ী ওষুধ (A–Z)" : "Medicines by generic name (A–Z)",
    description: lang === "bn" ? "সব জেনেরিক ওষুধের তালিকা — প্রতিটির ব্যবহার, সেবনবিধি আর বাংলাদেশের ব্র্যান্ডগুলোর দাম।" : "Every generic medicine — uses, dosage and the prices of its brands in Bangladesh.",
  });
}

/** A–Z index of generics, grouped by first letter. */
export default async function Generics({ params }) {
  const { lang } = await params;
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const d = await getJSON(`/api/generics?limit=200&page=${page}`, { fallback: null, revalidate: 86400 });
    if (!d) break;
    all.push(...d.generics);
    if (!d.hasMore) break;
  }
  const groups = {};
  for (const g of all) (groups[(g.name[0] || "#").toUpperCase()] ||= []).push(g);
  return (
    <Screen title={lang === "bn" ? "জেনেরিক নাম (A–Z)" : "Generics (A–Z)"} back={href(lang, "/medicine")} backLabel={t(lang, "wantMedicine")}
      crumbs={[{ href: href(lang, "/"), label: t(lang, "tabHome") }, { href: href(lang, "/medicine"), label: t(lang, "wantMedicine") }, { href: href(lang, "/medicine/generics"), label: "A–Z" }]}>
      {Object.keys(groups).sort().map((L) => (
        <section key={L} style={{ marginBottom: 20 }}>
          <h2 className="section-title">{L}</h2>
          <ul className="glist two">
            {groups[L].map((g) => (
              <li key={g._id}><Link href={href(lang, `/generic/${g.slug}`)} className="grow" style={{ minHeight: 56 }}>
                <span className="grow-main"><span className="grow-title">{genName(g, lang)}</span>{lang === "bn" && g.nameBangla && <span className="grow-sub">{g.name}</span>}</span>
                <Icon name="chevron-forward" size={18} className="grow-chev" />
              </Link></li>
            ))}
          </ul>
        </section>
      ))}
    </Screen>
  );
}
