import { notFound } from "next/navigation";
import Link from "next/link";
import Screen from "@/components/Screen";
import EmptyState from "@/components/EmptyState";
import DoctorCard from "@/components/doctors/DoctorCard";
import FilterBar from "@/components/doctors/FilterBar";
import LoadMore from "@/components/doctors/LoadMore";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href, digits } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { t, pick } from "@/lib/appText";
import { DOCTOR_KEYS, parseLoc, locSegment, specialtyName, doctorName } from "@/lib/doctors";
import { pageMeta, JsonLd } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true; // new specialties / districts render on first visit, then stay cached

/** Pre-build every specialty, and every specialty + district that has doctors. */
export async function generateStaticParams() {
  const map = await getJSON("/api/doctors/sitemap", { fallback: null, timeoutMs: 20000 });
  if (!map) return [];
  return [
    ...map.specialties.map((specialty) => ({ specialty, loc: [] })),
    ...map.specialtyDistricts.map((c) => ({ specialty: c.specialty, loc: [c.district] })),
  ];
}

async function resolve(params) {
  const { lang, specialty: slug, loc } = await params;
  if (loc && loc.length > 1) return null;
  const where = parseLoc(loc?.[0]);
  if (!where.ok) return null;
  const specialties = await getJSON("/api/specialties", { fallback: null });
  const spec = Array.isArray(specialties) ? specialties.find((s) => s.slug === slug) : null;
  if (!spec) return null;
  return { lang, slug, spec, ...where };
}

function words(lang, spec, district, division) {
  const sName = specialtyName(spec, lang);
  const place = district ? (lang === "bn" ? `${district.bn} জেলা` : district.name) : division ? (lang === "bn" ? `${division.bn} বিভাগ` : `${division.name} Division`) : "";
  return { sName, place };
}

export async function generateMetadata({ params }) {
  const r = await resolve(params);
  if (!r) return {};
  const { lang, slug, spec, district, division } = r;
  const { sName, place } = words(lang, spec, district, division);
  const seg = locSegment({ division, district });
  const title = lang === "bn"
    ? `${sName} বিশেষজ্ঞ ডাক্তার${place ? ` — ${place}` : ""} | চেম্বার, ফি ও সিরিয়াল`
    : `${sName} specialists${place ? ` in ${place}` : " in Bangladesh"} — chambers, fees & serial numbers`;
  const description = lang === "bn"
    ? `${place || "সারা বাংলাদেশের"} ${sName} বিশেষজ্ঞ ডাক্তারদের চেম্বারের ঠিকানা, বসার দিন ও সময়, নতুন ও পুরাতন রোগীর ফি আর সিরিয়ালের ফোন নম্বর।`
    : `${sName} doctors${place ? ` in ${place}` : " across Bangladesh"}: chamber address, visiting days and hours, new and follow-up fees, and phone numbers to book a serial.`;
  return pageMeta({ lang, path: `/doctors/${slug}${seg ? `/${seg}` : ""}`, title, description });
}

/** DoctorListScreen: doctors of one specialty, filtered by division / district. */
export default async function DoctorList({ params }) {
  const r = await resolve(params);
  if (!r) notFound();
  const { lang, slug, spec, district, division } = r;
  const d = dict(lang);
  const L = { ...pick(lang, DOCTOR_KEYS), close: d.close };
  const { sName, place } = words(lang, spec, district, division);

  const query = { specialty: slug };
  if (district) query.district = district.slug;
  else if (division) query.division = division.slug;
  const data = await getJSON(`/api/doctors?${new URLSearchParams({ ...query, page: "1", limit: "20" })}`, { fallback: { doctors: [], total: 0, hasMore: false } });
  const doctors = data.doctors || [];
  const base = href(lang, `/doctors/${slug}`);
  const hasFilter = !!(district || division);

  const count = lang === "bn"
    ? `${data.total} ${t(lang, "docDoctorsFound")}`
    : `${data.total} ${data.total === 1 ? t(lang, "docDoctorFound") : t(lang, "docDoctorsFound")}`;

  const crumbs = [
    { href: href(lang, "/"), label: t(lang, "tabHome") },
    { href: href(lang, "/doctors"), label: t(lang, "wantDoctor") },
    { href: base, label: sName },
    ...(hasFilter ? [{ href: `${base}/${locSegment({ division, district })}`, label: place }] : []),
  ];
  const ld = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })),
    },
    doctors.length > 0 && {
      "@context": "https://schema.org", "@type": "ItemList",
      itemListElement: doctors.map((doc, i) => ({ "@type": "ListItem", position: i + 1, name: doctorName(doc, lang), url: `${site.url}${href(lang, `/doctor/${doc.slug}`)}` })),
    },
  ].filter(Boolean);

  return (
    <Screen
      title={<>{sName}<span className="desk-only">{lang === "bn" ? " বিশেষজ্ঞ ডাক্তার" : " specialists"}{place ? (lang === "bn" ? ` — ${place}` : ` in ${place}`) : ""}</span></>}
      back={href(lang, "/doctors")} backLabel={t(lang, "wantDoctor")} crumbs={crumbs}
      after={<FilterBar lang={lang} L={L} base={base} division={division?.slug || null} district={district?.slug || null} />}
    >
      {doctors.length === 0 ? (
        <EmptyState icon="people-outline" tone="muted"
          title={hasFilter ? t(lang, "docNoneInArea") : t(lang, "docNoneYet")}
          sub={hasFilter ? t(lang, "docNoneInAreaSub") : t(lang, "docNoneYetSub")}
          action={hasFilter ? t(lang, "docShowAllAreas") : undefined} actionHref={hasFilter ? base : undefined} />
      ) : (
        <>
          <p className="count-text">{count}</p>
          <div className="dcards">
            {doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} lang={lang} L={L} headingLevel={2} />)}
          </div>
          {data.hasMore && (
            <LoadMore api={site.apiUrl} query={query} lang={lang} L={L}
              label={lang === "bn" ? "আরও ডাক্তার দেখুন" : "Show more doctors"} loadingLabel={lang === "bn" ? "লোড হচ্ছে…" : "Loading…"} />
          )}
        </>
      )}

      {!hasFilter && doctors.length > 0 && <AreaLinks lang={lang} base={base} doctors={doctors} />}
      {ld.map((x, i) => <JsonLd key={i} data={x} />)}
    </Screen>
  );
}

/** Links to the districts these doctors sit in — helps people and Google find the area pages. */
function AreaLinks({ lang, base, doctors }) {
  const seen = new Map();
  for (const doc of doctors) {
    const p = parseLoc(String(doc.district || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-"));
    if (p.ok && p.district && !seen.has(p.district.slug)) seen.set(p.district.slug, p.district);
  }
  if (seen.size < 2) return null;
  return (
    <section style={{ marginTop: 32 }}>
      <h2 className="section-title">{lang === "bn" ? "জেলা অনুযায়ী দেখুন" : "Browse by district"}</h2>
      <div className="chips">
        {[...seen.values()].map((x) => (
          <Link key={x.slug} href={`${base}/${x.slug}`} className="chip press">{lang === "bn" ? x.bn : x.name}</Link>
        ))}
      </div>
    </section>
  );
}
