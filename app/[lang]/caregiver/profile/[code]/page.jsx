import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import CIcon from "@/components/CIcon";
import Screen from "@/components/Screen";
import { CaregiverAvatar, TierBadge, Pill, Stars } from "@/components/care/bits";
import { CallLink, WaLink, RequestButton } from "@/components/care/Actions";
import site from "@/site.config";
import { getJSONStatus } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";
import { CARE_WEB } from "@/lib/careText";
import { SHIFT_ICONS, careIcon, categoryName, formatTaka, districtsText } from "@/lib/care";
import { fmtDate } from "@/lib/datetime";
import { placeLabel, districtByName } from "@/lib/doctors";

export const revalidate = 1800;
export const dynamicParams = true;
export const maxDuration = 30;
export function generateStaticParams() { return []; }

async function load(code) {
  const r = await getJSONStatus(`/api/care/caregivers/${encodeURIComponent(code)}`);
  if (r.status === 404) notFound();
  if (!r.ok) throw new Error("Caregiver service unavailable");
  return r.data;
}

export async function generateMetadata({ params }) {
  const { lang, code } = await params;
  const c = await load(code);
  const w = CARE_WEB[lang];
  const price = c.fromPrice != null ? `${t(lang, "careFrom")} ${formatTaka(c.fromPrice)}` : "";
  // A person's page: reachable from the lists, but kept out of search results.
  return pageMeta({ lang, path: `/caregiver/profile/${c.code}`, title: w.profileTitle(c.name, c.code), description: w.profileDesc(c.name, districtsText(c.districts, lang, 3), price), image: "/img/caregiver.webp", noindex: true });
}

/** CaregiverDetailScreen: trust badges, what they help with, shifts & rates, areas, reviews. */
export default async function CaregiverProfile({ params }) {
  const { lang, code } = await params;
  const c = await load(code);
  const tx = (k) => t(lang, k);
  const bn = lang === "bn";
  const wa = tx("careWaAboutCaregiver").replace("{name}", c.name).replace("{code}", c.code);
  const badges = [
    { on: c.badges?.nid, icon: "id-card", key: "careBadgeNid" },
    { on: c.badges?.police, icon: "shield-checkmark", key: "careBadgePolice" },
    { on: c.badges?.certified, icon: "school", key: c.tier === "nurse" ? "careBadgeNurse" : "careBadgeCertified" },
  ].filter((b) => b.on);
  const rateRows = (c.shifts || []).map((k) => ({ key: k, label: tx(`careShift_${k}`), hint: tx(`careShiftHint_${k}`), price: c.rates?.[k] }));
  const crumbs = [
    { href: href(lang, "/"), label: t(lang, "tabHome") },
    { href: href(lang, "/caregiver"), label: t(lang, "wantCaregiver") },
    { href: href(lang, "/caregiver/in"), label: t(lang, "careAllCaregivers") },
    { href: href(lang, `/caregiver/profile/${c.code}`), label: c.name },
  ];

  return (
    <Screen title={t(lang, "wantCaregiver")} back={href(lang, "/caregiver/in")} backLabel={t(lang, "careAllCaregivers")} crumbs={crumbs} titleAs="p" deskTitle={false}>
      <div className="detail-grid">
        <div>
          <section className="profile">
            <CaregiverAvatar caregiver={c} size={100} showDot />
            <h1>{c.name} <CIcon name="checkmark-circle" size={20} color="var(--primary)" /></h1>
            <div className="cg-pills center">
              <TierBadge tier={c.tier} tx={tx} big />
              <Pill label={c.available ? tx("careAvailableNow") : tx("careBusyNow")} tone={c.available ? "success" : "muted"} icon={c.available ? "flash" : "time-outline"} big />
            </div>
            <p className="alt" style={{ marginTop: 8 }}>{tx("careIdLabel")}: {c.code}</p>
          </section>

          <div className="cg-stats">
            <div><b>{c.yearsExperience || "—"}</b><small>{tx("careStatYears")}</small></div>
            <div><b>{c.completedBookings || 0}</b><small>{tx("careStatJobs")}</small></div>
            <div><b>{c.ratingCount ? <><CIcon name="star" size={16} color="#F59E0B" />{c.ratingAvg.toFixed(1)}</> : "—"}</b><small>{c.ratingCount ? `${tx("careStatRating")} (${c.ratingCount})` : tx("careStatRating")}</small></div>
          </div>

          <div className="cg-dock">
            <CallLink className="cg-sqbtn" label={tx("careCallUs")}><CIcon name="call" size={22} /></CallLink>
            <WaLink message={wa} className="cg-sqbtn wa" label={tx("careWhatsApp")}><CIcon name="logo-whatsapp" size={24} /></WaLink>
            <RequestButton target={{ caregiver: { code: c.code, name: c.name } }} className="btn-app"><CIcon name="calendar-outline" size={19} />{tx("careRequestThis")}</RequestButton>
          </div>
        </div>

        <div>
          <section className="cg-panel">
            <h2 className="cg-ptitle">{tx("careTrustTitle")}</h2>
            {badges.map((b) => (
              <div key={b.key} className="cg-badge"><span><Icon name={b.icon} size={16} /></span><p>{tx(b.key)}</p><Icon name="checkmark" size={18} /></div>
            ))}
            <p className="cg-guarantee"><Icon name="swap-horizontal" size={18} />{tx("careGuaranteeLine")}</p>
          </section>

          {!!c.bio && <section className="cg-panel"><h2 className="cg-ptitle">{tx("careAbout")}</h2><p className="cg-bio">{c.bio}</p></section>}

          {c.categories?.length > 0 && (
            <section className="cg-panel">
              <h2 className="cg-ptitle">{tx("careCanHelpWith")}</h2>
              <div className="chips">
                {c.categories.map((cat) => (
                  <Link key={cat._id} href={href(lang, `/caregiver/in/all/${cat.slug}`)} className="cg-linkchip">
                    <img src={careIcon(cat.iconKey)} alt="" width={22} height={22} />{categoryName(cat, lang)}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="cg-panel">
            <h2 className="cg-ptitle">{tx("careShiftsAndRates")}</h2>
            {rateRows.map((r) => (
              <div key={r.key} className="cg-rate">
                <span><Icon name={SHIFT_ICONS[r.key]} size={17} /></span>
                <div><b>{r.label}</b><small>{r.hint}</small></div>
                <em className={r.price == null ? "ask" : ""}>{r.price != null ? formatTaka(r.price) : tx("careAskPrice")}</em>
              </div>
            ))}
            {c.rates?.month != null && (
              <div className="cg-rate"><span><Icon name="calendar-outline" size={17} /></span><div><b>{tx("careMonthly")}</b></div><em>{formatTaka(c.rates.month)}</em></div>
            )}
            <p className="cg-ratenote">{tx("careRateNote")}</p>
          </section>

          <section className="cg-panel">
            <h2 className="cg-ptitle">{tx("careWorksIn")}</h2>
            <div className="chips">
              {(c.districts || []).map((d) => (
                <Link key={d} href={href(lang, `/caregiver/in/${districtByName(d)?.slug || ""}`)} className="cg-linkchip"><Icon name="location-outline" size={13} />{placeLabel(d, lang)}</Link>
              ))}
            </div>
          </section>

          <section className="cg-panel">
            <h2 className="cg-ptitle">{tx("careReviews")}</h2>
            {(c.reviews || []).length === 0 ? <p className="muted">{tx("careNoReviews")}</p> : c.reviews.map((r, i) => (
              <div key={i} className="cg-review">
                <p><Stars value={r.stars} /><b>{r.by || tx("careFamily")}</b><time>{fmtDate(r.at, lang)}</time></p>
                {!!r.comment && <p className="cg-rtext">{r.comment}</p>}
              </div>
            ))}
          </section>
          <p className="small-note">{tx("careMemberSince")}: {fmtDate(c.memberSince, lang)}</p>
        </div>
      </div>
      <div className="mob-only" style={{ height: 96 }} aria-hidden />
    </Screen>
  );
}
