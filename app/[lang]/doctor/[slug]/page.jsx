import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import CallButton from "@/components/doctors/CallButton";
import { DoctorAvatar } from "@/components/doctors/DoctorCard";
import site from "@/site.config";
import { getJSONStatus } from "@/lib/api";
import { href } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { t, pick } from "@/lib/appText";
import { DOCTOR_KEYS, placeLabel, doctorName, specialtyName, districtByName } from "@/lib/doctors";
import { pageMeta, JsonLd } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;
export const maxDuration = 30; // the backend may need a moment to wake up
export function generateStaticParams() { return []; } // built on first visit, then cached

async function load(slug) {
  const r = await getJSONStatus(`/api/doctors/${encodeURIComponent(slug)}`);
  if (r.status === 404) notFound();
  // No answer from the backend: throw, so a cached copy keeps being served (or the retry screen shows).
  if (!r.ok) throw new Error("Doctor service unavailable");
  return r.data;
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const d = await load(slug);
  const name = doctorName(d, lang);
  const spec = specialtyName(d.specialty, lang);
  const place = [d.chamberName, d.area, placeLabel(d.district, lang)].filter(Boolean).join(", ");
  const title = lang === "bn" ? `${name} — ${spec} বিশেষজ্ঞ, ${placeLabel(d.district, lang)}` : `${name} — ${spec}, ${d.district}`;
  const fee = d.newPatientFee != null ? (lang === "bn" ? ` ভিজিট ফি ৳${d.newPatientFee}।` : ` Fee ৳${d.newPatientFee}.`) : "";
  const description = lang === "bn"
    ? `${name}${d.degrees ? ` (${d.degrees})` : ""}। চেম্বার: ${place}।${d.visitingDays ? ` ${d.visitingDays}` : ""}${d.visitingHours ? `, ${d.visitingHours}` : ""}।${fee} সিরিয়ালের ফোন নম্বর দেখুন।`
    : `${name}${d.degrees ? ` (${d.degrees})` : ""}. Chamber: ${place}.${d.visitingDays ? ` ${d.visitingDays}` : ""}${d.visitingHours ? `, ${d.visitingHours}` : ""}.${fee} See serial phone numbers.`;
  return pageMeta({ lang, path: `/doctor/${slug}`, title, description, image: d.photoUrl || undefined });
}

/** DoctorDetailScreen: profile, fees, chamber & schedule, other chambers, call for serial. */
export default async function DoctorDetail({ params }) {
  const { lang, slug } = await params;
  const d = await load(slug);
  const dd = dict(lang);
  const L = { ...pick(lang, DOCTOR_KEYS), close: dd.close };
  const name = doctorName(d, lang);
  const spec = specialtyName(d.specialty, lang);
  const district = placeLabel(d.district, lang);
  const division = placeLabel(d.division, lang);
  const specUrl = d.specialty?.slug ? href(lang, `/doctors/${d.specialty.slug}`) : href(lang, "/doctors");
  const distSlug = districtByName(d.district)?.slug;
  const hasFees = d.newPatientFee != null || d.followUpFee != null;
  const window = d.followUpWithinDays ? (lang === "bn" ? `${d.followUpWithinDays} দিনের মধ্যে` : `within ${d.followUpWithinDays} days`) : "";
  const pageUrl = `${site.url}${href(lang, `/doctor/${slug}`)}`;
  const reportMsg = lang === "bn"
    ? `আসসালামু আলাইকুম, ${name}-এর তথ্যে ভুল আছে (${pageUrl}):\n`
    : `Hello, some information about ${name} is wrong (${pageUrl}):\n`;

  const crumbs = [
    { href: href(lang, "/"), label: t(lang, "tabHome") },
    { href: href(lang, "/doctors"), label: t(lang, "wantDoctor") },
    { href: specUrl, label: spec || t(lang, "docDetailTitle") },
    ...(distSlug && d.specialty?.slug ? [{ href: `${specUrl}/${distSlug}`, label: district }] : []),
    { href: href(lang, `/doctor/${slug}`), label: name },
  ];
  const ld = [
    {
      "@context": "https://schema.org", "@type": "Physician",
      name: d.name, alternateName: d.nameBangla || undefined, url: pageUrl, image: d.photoUrl || undefined,
      description: [d.degrees, d.designation, d.workplace].filter(Boolean).join(", ") || undefined,
      medicalSpecialty: d.specialty?.name, telephone: d.phones?.[0],
      address: {
        "@type": "PostalAddress", streetAddress: [d.chamberName, d.chamberAddress].filter(Boolean).join(", ") || undefined,
        addressLocality: d.area || d.district, addressRegion: d.division, addressCountry: "BD",
      },
      priceRange: d.newPatientFee != null ? `৳${d.newPatientFee}` : undefined,
      isAcceptingNewPatients: true,
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })),
    },
  ];

  return (
    <Screen title={spec || t(lang, "docDetailTitle")} back={specUrl} backLabel={spec} crumbs={crumbs} titleAs="p" deskTitle={false}>
      <div className="detail-grid">
        <div>
          <section className="profile">
            <DoctorAvatar doctor={d} size={88} />
            <h1>{name}</h1>
            {lang === "bn" && d.nameBangla && d.name !== d.nameBangla && <p className="alt">{d.name}</p>}
            {!!d.degrees && <p className="deg">{d.degrees}</p>}
            {d.specialty && (
              <Link href={specUrl} className="spec-pill"><Icon name={d.specialty.icon || "medkit"} size={13} />{spec}</Link>
            )}
            {!!(d.designation || d.workplace) && <p className="work">{[d.designation, d.workplace].filter(Boolean).join("\n")}</p>}
            {(d.onlineConsultation || d.bmdcNumber) && (
              <div className="badges">
                {d.onlineConsultation && <span className="pill-badge tone-success"><Icon name="videocam" size={12} />{t(lang, "docOnlineAvailable")}</span>}
                {!!d.bmdcNumber && <span className="pill-badge tone-helper"><Icon name="shield-checkmark" size={12} />BMDC {d.bmdcNumber}</span>}
              </div>
            )}
          </section>

          {d.phones?.length > 0 && (
            <div className="dock">
              <div className="dock-info">
                <small>{t(lang, "docSerialByPhone")}</small>
                {d.newPatientFee != null && <b>৳{d.newPatientFee} <span>{t(lang, "docNewPatient")}</span></b>}
              </div>
              <CallButton phones={d.phones} title={name} sub={d.chamberName} label={t(lang, "docCallForSerial")} L={L} className="btn btn-helper" iconSize={18} />
            </div>
          )}
        </div>

        <div>
          {hasFees && (
            <section>
              <h2 className="section-title sp">{t(lang, "docFees")}</h2>
              <div className="fee-block">
                {d.newPatientFee != null && (
                  <div className="fee-row">
                    <div style={{ flex: 1 }}><strong>{t(lang, "docNewPatient")}</strong><small>{t(lang, "docNewPatientHint")}</small></div>
                    <span className="fee-amt">৳{d.newPatientFee}</span>
                  </div>
                )}
                {d.followUpFee != null && (
                  <div className="fee-row">
                    <div style={{ flex: 1 }}>
                      <strong>{t(lang, "docFollowUp")}</strong>
                      <small>{window ? `${t(lang, "docFollowUpHintPre")} ${window} ${t(lang, "docFollowUpHintPost")}` : t(lang, "docFollowUpHintNoDays")}</small>
                    </div>
                    <span className="fee-amt" style={{ color: "var(--success)" }}>৳{d.followUpFee}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          <section>
            <h2 className="section-title sp">{t(lang, "docChamber")}</h2>
            <div className="info-card">
              {!!d.chamberName && <h3>{d.chamberName}</h3>}
              <Row icon="location-outline" text={[d.chamberAddress, d.area, district, division].filter(Boolean).join(", ")} />
              <Row icon="calendar-outline" text={d.visitingDays} />
              <Row icon="time-outline" text={d.visitingHours} />
              {d.phones?.map((p) => (
                <a key={p} href={`tel:${p}`} className="phone-line press">
                  <Icon name="call-outline" size={16} /><b>{p}</b><small>{t(lang, "docTapToCall")}</small>
                </a>
              ))}
            </div>
          </section>

          {d.otherChambers?.length > 0 && (
            <section>
              <h2 className="section-title sp">{t(lang, "docOtherChambers")}</h2>
              {d.otherChambers.map((c) => (
                <Link key={c._id} href={href(lang, `/doctor/${c.slug}`)} className="other press">
                  <span className="icircle tone-helper" style={{ width: 38, height: 38 }}><Icon name="business-outline" size={18} /></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <strong>{c.chamberName || placeLabel(c.district, lang)}</strong>
                    <small>{[c.area, placeLabel(c.district, lang), c.visitingDays].filter(Boolean).join(" · ")}</small>
                  </span>
                  <Icon name="chevron-forward" size={18} color="var(--border-strong)" />
                </Link>
              ))}
            </section>
          )}

          <p className="disclaimer"><Icon name="information-circle-outline" size={16} />{t(lang, "docDisclaimer")}</p>
          <a className="report-link" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(reportMsg)}`} target="_blank" rel="noopener">
            <Icon name="flag-outline" size={15} />{t(lang, "docReportWrong")}
          </a>
        </div>
      </div>
      {d.phones?.length > 0 && <div className="mob-only" style={{ height: 96 }} aria-hidden />}
      {ld.map((x, i) => <JsonLd key={i} data={x} />)}
    </Screen>
  );
}

function Row({ icon, text }) {
  if (!text) return null;
  return <p className="irow"><Icon name={icon} size={16} />{text}</p>;
}
