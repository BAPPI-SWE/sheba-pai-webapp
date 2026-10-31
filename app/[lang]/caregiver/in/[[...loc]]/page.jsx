import { notFound } from "next/navigation";
import Screen from "@/components/Screen";
import CaregiverFeed from "@/components/care/CaregiverFeed";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta, JsonLd } from "@/lib/seo";
import { CARE_WEB } from "@/lib/careText";
import { careIcon, categoryName, formatTaka } from "@/lib/care";
import { districtBySlug, placeLabel } from "@/lib/doctors";

export const revalidate = 1800;
export const dynamicParams = true;

/** Pre-build every district and care type that has caregivers (the backend tells us which). */
export async function generateStaticParams() {
  const map = await getJSON("/api/care/sitemap", { fallback: null, timeoutMs: 20000 });
  if (!map) return [];
  const { districtByName } = await import("@/lib/doctors");
  const out = [{ loc: [] }];
  for (const c of map.categories) out.push({ loc: ["all", c] });
  for (const d of map.districts) {
    const slug = districtByName(d.district)?.slug;
    if (!slug) continue;
    out.push({ loc: [slug] });
    for (const c of d.categories) out.push({ loc: [slug, c] });
  }
  return out;
}

async function resolve(params) {
  const { lang, loc = [] } = await params;
  if (loc.length > 2) return null;
  const [a, b] = loc;
  let district = null;
  if (a && a !== "all") { district = districtBySlug(a); if (!district) return null; }
  const categories = await getJSON("/api/care/categories", { fallback: [] });
  const cats = Array.isArray(categories) ? categories : [];
  let cat = null;
  if (b) { cat = cats.find((c) => c.slug === b); if (!cat) return null; }
  const qs = new URLSearchParams({ page: "1", limit: "20" });
  if (cat) qs.set("category", cat.slug);
  if (district) qs.set("district", district.name);
  const data = await getJSON(`/api/care/caregivers?${qs}`, { fallback: { caregivers: [], total: 0, hasMore: false } });
  return { lang, district, cat, cats, data };
}

const pathOf = (district, cat) => `/caregiver/in${district ? `/${district.slug}` : cat ? "/all" : ""}${cat ? `/${cat.slug}` : ""}`;

export async function generateMetadata({ params }) {
  const r = await resolve(params);
  if (!r) return {};
  const { lang, district, cat, data } = r;
  const w = CARE_WEB[lang];
  const place = district ? (lang === "bn" ? `${district.bn} জেলায়` : district.name) : "";
  const type = cat ? categoryName(cat, lang) : "";
  // Pages with nobody listed yet are kept out of Google until they have caregivers.
  return pageMeta({ lang, path: pathOf(district, cat), title: w.inTitle(place, type), description: w.inDesc(place, type, data.total), image: "/img/caregiver.webp", noindex: data.total === 0 });
}

/** CareListScreen: caregivers of one district / care type, with the app's filters. */
export default async function CareList({ params }) {
  const r = await resolve(params);
  if (!r) notFound();
  const { lang, district, cat, cats, data } = r;
  const w = CARE_WEB[lang];
  const place = district ? placeLabel(district.name, lang) : "";
  const type = cat ? categoryName(cat, lang) : "";
  const tx = (k) => t(lang, k);
  const crumbs = [
    { href: href(lang, "/"), label: t(lang, "tabHome") },
    { href: href(lang, "/caregiver"), label: t(lang, "wantCaregiver") },
    ...(district ? [{ href: href(lang, `/caregiver/in/${district.slug}`), label: place }] : []),
    ...(cat ? [{ href: href(lang, pathOf(district, cat)), label: type }] : []),
  ];
  if (crumbs.length === 2) crumbs.push({ href: href(lang, "/caregiver/in"), label: t(lang, "careAllCaregivers") });
  const desc = cat ? (lang === "bn" ? cat.descriptionBangla || cat.description : cat.description) : "";
  const ld = [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })) }];

  return (
    <Screen
      title={<>{type || t(lang, "careAllCaregivers")}<span className="desk-only">{place ? (lang === "bn" ? ` — ${place}` : ` in ${place}`) : ""}</span></>}
      back={href(lang, "/caregiver")} backLabel={t(lang, "wantCaregiver")} crumbs={crumbs}>
      {(desc || cat?.fromPrice != null) && (
        <div className="cg-catinfo">
          <img src={careIcon(cat.iconKey)} alt="" width={46} height={46} />
          <div>
            {desc && <p>{desc}</p>}
            {cat.fromPrice != null && <b>{tx("careFrom")} <span>{formatTaka(cat.fromPrice)}</span> {cat.priceUnit ? tx(`careUnit_${cat.priceUnit}`) : ""}</b>}
          </div>
        </div>
      )}
      <CaregiverFeed key={pathOf(district, cat)} lang={lang} initial={data} categories={cats}
        catSlug={cat?.slug || ""} distSlug={district?.slug || ""} query={{ category: cat?.slug || "", district: district?.name || "" }} />
      <p className="small-note" style={{ marginTop: 24 }}>{w.inDesc(place, type, 0)}</p>
      {ld.map((x, i) => <JsonLd key={i} data={x} />)}
    </Screen>
  );
}
