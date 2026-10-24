import { notFound } from "next/navigation";
import Link from "next/link";
import Screen from "@/components/Screen";
import { MedicineRow } from "@/components/medicine/MedicineCards";
import CartBar, { HeaderCart } from "@/components/medicine/CartBar";
import site from "@/site.config";
import { getJSONStatus } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { genName, shownPrice, pick } from "@/lib/medicine";
import { pageMeta, JsonLd } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;
export const maxDuration = 30;
export function generateStaticParams() { return []; }

async function load(slug) {
  const r = await getJSONStatus(`/api/generics/${encodeURIComponent(slug)}`);
  if (r.status === 404) notFound();
  if (!r.ok) throw new Error("Medicine service unavailable");
  return r.data;
}

const SECTIONS = [
  ["indications", "Indications", "কী কাজে ব্যবহার হয়"], ["dosage", "Dosage", "সেবনবিধি"],
  ["sideEffects", "Side effects", "পার্শ্বপ্রতিক্রিয়া"], ["contraindications", "Contraindications", "যাদের জন্য নিষেধ"],
  ["pharmacology", "Pharmacology", "ফার্মাকোলজি"],
];

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const { generic: g, brands = [] } = await load(slug);
  const n = genName(g, lang);
  const low = brands.length ? Math.min(...brands.map(shownPrice)) : null;
  return pageMeta({
    lang, path: `/generic/${slug}`,
    title: lang === "bn" ? `${n} — কী কাজ করে, সেবনবিধি, পার্শ্বপ্রতিক্রিয়া ও ব্র্যান্ডের দাম` : `${n} — uses, dosage, side effects and brand prices`,
    description: lang === "bn"
      ? `${n} (${g.name}) কী কাজে ব্যবহার হয়, কীভাবে খেতে হয়, পার্শ্বপ্রতিক্রিয়া। বাংলাদেশে ${brands.length}টি ব্র্যান্ড${low != null ? `, দাম ৳${low} থেকে` : ""}।`
      : `What ${g.name} is used for, how to take it and side effects. ${brands.length} brands in Bangladesh${low != null ? `, from ৳${low}` : ""}.`,
  });
}

/** Generic page: plain-language information plus every brand, cheapest first. */
export default async function GenericPage({ params }) {
  const { lang, slug } = await params;
  const { generic: g, brands = [] } = await load(slug);
  const n = genName(g, lang);
  const crumbs = [
    { href: href(lang, "/"), label: t(lang, "tabHome") }, { href: href(lang, "/medicine"), label: t(lang, "wantMedicine") },
    { href: href(lang, "/medicine/generics"), label: lang === "bn" ? "জেনেরিক" : "Generics" }, { href: href(lang, `/generic/${slug}`), label: n },
  ];
  const faq = SECTIONS.map(([k, en, bn]) => [lang === "en" ? `${g.name}: ${en}` : `${n} — ${bn}`, pick(lang, g[k], g[`${k}Bangla`])]).filter(([, a]) => a);
  return (
    <Screen title={n} sub={lang === "bn" && g.nameBangla ? g.name : undefined} back={href(lang, "/medicine")} backLabel={t(lang, "wantMedicine")} crumbs={crumbs}
      right={<HeaderCart lang={lang} label={t(lang, "cartTitle")} />}>
      <div className="med-grid">
        <div>
          {g.drugClasses?.length > 0 && <div className="chips" style={{ marginBottom: 16 }}>{g.drugClasses.map((c) => <span key={c._id} className="pill-badge tone-helper" style={{ fontSize: 13 }}>{pick(lang, c.name, c.nameBangla)}</span>)}</div>}
          {(g.simpleSummary || g.simpleSummaryBangla) && <p className="summary-card">{pick(lang, g.simpleSummary, g.simpleSummaryBangla)}</p>}
          {SECTIONS.map(([k, en, bn]) => {
            const text = pick(lang, g[k], g[`${k}Bangla`]);
            return text ? <section key={k} className="med-section"><h2>{lang === "en" ? en : bn}</h2><p>{text}</p></section> : null;
          })}
          <p className="disclaimer" style={{ marginTop: 8 }}>{lang === "bn" ? "এই তথ্য শুধু জানার জন্য। ওষুধ খাওয়ার আগে ডাক্তারের পরামর্শ নিন।" : "This information is for general knowledge. Ask your doctor before taking any medicine."}</p>
        </div>
        <section>
          <h2 className="section-title sp" style={{ marginTop: 0 }}>{lang === "bn" ? `${n}-এর ব্র্যান্ড (${brands.length})` : `Brands of ${g.name} (${brands.length})`}</h2>
          <div className="mrows" style={{ margin: "0 calc(var(--lg) * -1)" }}>
            {brands.map((m) => <MedicineRow key={m._id} medicine={{ ...m, generic: { name: g.name } }} lang={lang} />)}
          </div>
        </section>
      </div>
      <CartBar lang={lang} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })) }} />
      {faq.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }} />}
    </Screen>
  );
}
