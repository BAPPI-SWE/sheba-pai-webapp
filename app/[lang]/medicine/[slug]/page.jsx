import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import BuyBox from "@/components/medicine/BuyBox";
import CartBar, { HeaderCart } from "@/components/medicine/CartBar";
import site from "@/site.config";
import { getJSONStatus } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { medName, genName, shownPrice, inStock, pick } from "@/lib/medicine";
import { pageMeta, JsonLd } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;
export const maxDuration = 30;
export function generateStaticParams() { return []; } // built on first visit, then cached

async function load(slug) {
  const r = await getJSONStatus(`/api/medicines/${encodeURIComponent(slug)}`);
  if (r.status === 404) notFound();
  if (!r.ok) throw new Error("Medicine service unavailable");
  return r.data;
}

const SECTIONS = [
  ["indications", "Indications", "কী কাজে ব্যবহার হয়"],
  ["dosage", "Dosage", "সেবনবিধি"],
  ["sideEffects", "Side effects", "পার্শ্বপ্রতিক্রিয়া"],
  ["contraindications", "Contraindications", "যাদের জন্য নিষেধ"],
  ["pharmacology", "Pharmacology", "ফার্মাকোলজি"],
];

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const { medicine: m } = await load(slug);
  const g = m.generic || {};
  const name = `${medName(m, lang)} ${m.strength || ""}`.trim();
  const title = m.metaTitle || (lang === "bn"
    ? `${name} ${m.dosageForm || ""} — দাম ৳${shownPrice(m)}, ${genName(g, lang)}`
    : `${name} ${m.dosageForm || ""} — price ৳${shownPrice(m)}, ${g.name || ""}`);
  const description = m.metaDescription || (lang === "bn"
    ? `${name} (${g.name || ""}) — ${m.manufacturer?.name || ""}। দাম ৳${shownPrice(m)} / ${m.sellUnit}। ব্যবহার, সেবনবিধি, পার্শ্বপ্রতিক্রিয়া ও অন্য ব্র্যান্ডের দাম। ঘরে বসে অর্ডার করুন।`
    : `${name} (${g.name || ""}) by ${m.manufacturer?.name || ""}. Price ৳${shownPrice(m)} per ${m.sellUnit}. Uses, dosage, side effects and other brands. Order to your door.`);
  return pageMeta({ lang, path: `/medicine/${slug}`, title, description, image: m.images?.[0] || undefined });
}

/** MedicineDetailScreen — the page meant to rank in search. */
export default async function MedicineDetail({ params }) {
  const { lang, slug } = await params;
  const { medicine: m, alternatives = [] } = await load(slug);
  const g = m.generic || {};
  const gName = genName(g, lang);
  const pageUrl = `${site.url}${href(lang, `/medicine/${slug}`)}`;
  const crumbs = [
    { href: href(lang, "/"), label: t(lang, "tabHome") },
    { href: href(lang, "/medicine"), label: t(lang, "wantMedicine") },
    ...(g.slug ? [{ href: href(lang, `/generic/${g.slug}`), label: gName }] : []),
    { href: href(lang, `/medicine/${slug}`), label: `${medName(m, lang)} ${m.strength || ""}` },
  ];
  const ld = [
    {
      "@context": "https://schema.org", "@type": "Product",
      name: `${m.brandName} ${m.strength || ""}`.trim(), alternateName: m.brandNameBangla || undefined,
      image: m.images?.length ? m.images : undefined, sku: m.sku || m._id,
      brand: m.manufacturer?.name ? { "@type": "Brand", name: m.manufacturer.name } : undefined,
      description: pick(lang, g.simpleSummary, g.simpleSummaryBangla) || undefined,
      offers: {
        "@type": "Offer", url: pageUrl, priceCurrency: "BDT", price: shownPrice(m),
        availability: inStock(m) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: site.name[lang] },
      },
    },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })) },
  ];

  return (
    <Screen title="" titleAs="p" deskTitle={false} back={href(lang, "/medicine")} backLabel={t(lang, "wantMedicine")} crumbs={crumbs}
      right={<HeaderCart lang={lang} label={t(lang, "cartTitle")} />}>
      <div className="med-grid">
        <div>
          <div className="med-hero">
            <span className="med-hero-img">{m.images?.[0] ? <img src={m.images[0]} alt={`${m.brandName} ${m.strength || ""}`} /> : <Icon name="medkit" size={44} />}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1>{medName(m, lang)} <span className="desk-only" style={{ fontWeight: 600, color: "var(--text-muted)" }}>{m.strength}</span></h1>
              <p className="med-sub">{[m.strength, m.dosageForm, m.manufacturer?.name].filter(Boolean).join(" · ")}</p>
              {gName && g.slug && <Link href={href(lang, `/generic/${g.slug}`)} className="gen-pill">{gName}</Link>}
            </div>
          </div>

          <div className="mob-only"><BuyBox medicine={m} lang={lang} /></div>

          {(g.simpleSummary || g.simpleSummaryBangla) && <p className="summary-card">{pick(lang, g.simpleSummary, g.simpleSummaryBangla)}</p>}
          {SECTIONS.map(([k, en, bn]) => {
            const text = pick(lang, g[k], g[`${k}Bangla`]);
            return text ? <section key={k} className="med-section"><h2>{lang === "en" ? en : bn}</h2><p>{text}</p></section> : null;
          })}

          {alternatives.length > 0 && (
            <section style={{ marginTop: 24 }}>
              <h2 className="section-title">{lang === "en" ? `Other brands of ${gName}` : `${gName}-এর অন্য ব্র্যান্ড`}</h2>
              {alternatives.map((a) => (
                <Link key={a._id} href={href(lang, `/medicine/${a.slug}`)} className="alt-row press">
                  <span><strong>{a.brandName} {a.strength}</strong><small>{a.manufacturer?.name}</small></span>
                  <span className="p"><b>৳{shownPrice(a)}</b>{a.onSale && <s>৳{a.price}</s>}</span>
                </Link>
              ))}
            </section>
          )}
        </div>
        <div className="desk-only"><BuyBox medicine={m} lang={lang} /></div>
      </div>
      <CartBar lang={lang} />
      {ld.map((x, i) => <JsonLd key={i} data={x} />)}
    </Screen>
  );
}
