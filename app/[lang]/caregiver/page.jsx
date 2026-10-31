import Link from "next/link";
import Icon from "@/components/Icon";
import CIcon from "@/components/CIcon";
import Screen from "@/components/Screen";
import AreaBar from "@/components/care/AreaBar";
import FeaturedArea from "@/components/care/FeaturedArea";
import { CallLink, WaLink } from "@/components/care/Actions";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t, pick } from "@/lib/appText";
import { pageMeta, JsonLd } from "@/lib/seo";
import { CARE_WEB } from "@/lib/careText";
import { CARE_KEYS, careIcon, formatTaka, offerName, categoryName } from "@/lib/care";
import { districtByName, placeLabel } from "@/lib/doctors";

export const revalidate = 1800;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const w = CARE_WEB[lang];
  return pageMeta({ lang, path: "/caregiver", title: w.title, description: w.description, image: "/img/caregiver.webp" });
}

/** CareHomeScreen: where, the two doors (urgent / monthly), trust, caregivers nearby, how it works. */
export default async function CareHome({ params }) {
  const { lang } = await params;
  const w = CARE_WEB[lang];
  const [home, offers, cats, map] = await Promise.all([
    getJSON("/api/care/home", { fallback: { caregivers: [], total: 0, categories: [] } }),
    getJSON("/api/care/offers", { fallback: [] }),
    getJSON("/api/care/categories", { fallback: [] }),
    getJSON("/api/care/sitemap", { fallback: null }),
  ]);
  const list = Array.isArray(offers) ? offers : [];
  const urgent = list.filter((o) => o.kind === "urgent"), packages = list.filter((o) => o.kind === "package");
  const minPrice = (l) => l.reduce((m, o) => (o.price != null && (m == null || o.price < m) ? o.price : m), null);
  const uFrom = minPrice(urgent), pFrom = minPrice(packages);
  const tx = (k) => t(lang, k);
  const categories = Array.isArray(cats) ? cats : [];
  const districts = (map?.districts || []).map((x) => districtByName(x.district)).filter(Boolean);
  const crumbs = [{ href: href(lang, "/"), label: t(lang, "tabHome") }, { href: href(lang, "/caregiver"), label: t(lang, "wantCaregiver") }];
  const ld = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })),
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: w.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <Screen title={t(lang, "wantCaregiver")} back={href(lang, "/")} backLabel={t(lang, "tabHome")} crumbs={crumbs} titleAs="p" deskTitle={false}>
      <div className="cg-page">
        <AreaBar lang={lang} />

        <div className="cg-hero">
          <div className="cg-hero-glow" />
          <div className="cg-hero-text">
            <p className="cg-eyebrow">{t(lang, "careHeroEyebrow")}</p>
            <h1>{t(lang, "careHeroTitle")}</h1>
            <p className="cg-hero-sub">{t(lang, "careHeroSub")}</p>
          </div>
          <img src="/img/caregiver.webp" alt="" width={118} height={112} className="cg-hero-img" />
          <div className="cg-hero-actions">
            <CallLink className="cg-hbtn"><CIcon name="call" size={16} />{t(lang, "careCallUs")}</CallLink>
            <WaLink message={t(lang, "careWaGeneral")} className="cg-hbtn ghost"><CIcon name="logo-whatsapp" size={17} />{t(lang, "careWhatsApp")}</WaLink>
          </div>
        </div>

        <h2 className="section-title sp">{t(lang, "homeChooseService")}</h2>
        <div className="cg-doors">
          <Door tone="accent" glow icon="flash" to={href(lang, "/caregiver/urgent")} title={t(lang, "doorUrgent")} sub={t(lang, "doorUrgentSub")}
            from={uFrom != null ? `${t(lang, "careFrom")} ${formatTaka(uFrom)}` : null}
            chips={urgent.slice(0, 3).map((o) => ({ key: o._id, label: offerName(o, lang), icon: careIcon(o.iconKey) }))} />
          <Door tone="helper" icon="calendar" to={href(lang, "/caregiver/packages")} title={t(lang, "doorPackages")} sub={t(lang, "doorPackagesSub")}
            from={pFrom != null ? `${t(lang, "careFrom")} ${formatTaka(pFrom)} ${t(lang, "offerUnit_month")}` : null}
            chips={packages.slice(0, 3).map((o) => ({ key: o._id, label: offerName(o, lang), icon: careIcon(o.iconKey) }))} />
        </div>

        <div className="cg-trust">
          {[["shield-checkmark", "careTrustVerified"], ["swap-horizontal", "careTrustReplace"], ["chatbubbles", "careTrustUpdates"]].map(([ic, k]) => (
            <div key={k}><span><Icon name={ic} size={17} /></span><p>{t(lang, k)}</p></div>
          ))}
        </div>

        <FeaturedArea lang={lang} initial={{ caregivers: home?.caregivers || [], total: home?.total || 0 }} />

        <h2 className="section-title sp">{t(lang, "careHowTitle")}</h2>
        <ol className="cg-panel cg-how">
          {[1, 2, 3].map((n) => (
            <li key={n}><span>{n}</span><div><b>{t(lang, `careHow${n}`)}</b><p>{t(lang, `careHow${n}Sub`)}</p></div></li>
          ))}
        </ol>

        <Link href={href(lang, "/activity")} className="cg-myrow press">
          <Icon name="receipt-outline" size={20} /><span>{t(lang, "careMyRequests")}</span><Icon name="chevron-forward" size={18} />
        </Link>

        {categories.length > 0 && (
          <section>
            <h2 className="section-title sp">{w.byType}</h2>
            <div className="chips">
              {categories.map((c) => (
                <Link key={c._id} href={href(lang, `/caregiver/in/all/${c.slug}`)} className="cg-linkchip">
                  <img src={careIcon(c.iconKey)} alt="" width={20} height={20} />{categoryName(c, lang)}
                </Link>
              ))}
            </div>
          </section>
        )}
        {districts.length > 0 && (
          <section>
            <h2 className="section-title sp">{w.byDistrict}</h2>
            <div className="chips">
              {districts.map((d) => (
                <Link key={d.slug} href={href(lang, `/caregiver/in/${d.slug}`)} className="cg-linkchip"><Icon name="location-outline" size={14} />{placeLabel(d.name, lang)}</Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="section-title sp">{w.faqTitle}</h2>
          <div className="glist faq">
            {w.faq.map((f) => (<details key={f.q}><summary>{f.q}<Icon name="chevron-forward" size={18} /></summary><p>{f.a}</p></details>))}
          </div>
        </section>
        <p className="disclaimer" style={{ marginTop: 24 }}><Icon name="information-circle-outline" size={16} />{lang === "bn" ? "সেবা পাই হাসপাতাল বা জরুরি সেবা নয়। জরুরি অবস্থায় ৯৯৯-এ কল করুন।" : "Sheba Pai is not a hospital or emergency service. In an emergency, call 999."}</p>
      </div>
      {ld.map((x, i) => <JsonLd key={i} data={x} />)}
    </Screen>
  );
}

function Door({ tone, glow, icon, to, title, sub, from, chips }) {
  return (
    <Link href={to} className={`cg-door tone-${tone} press ${glow ? "glow" : ""}`}>
      <div className="cg-door-top">
        <span className="cg-door-ico"><Icon name={icon} size={24} /></span>
        <span style={{ flex: 1, minWidth: 0 }}><b>{title}</b><small>{sub}</small></span>
        <span className="cg-door-go"><Icon name="arrow-forward" size={18} /></span>
      </div>
      {chips.length > 0 && <div className="cg-door-chips">{chips.map((c) => <span key={c.key}><img src={c.icon} alt="" width={18} height={18} />{c.label}</span>)}</div>}
      {from && <p className="cg-door-from">{from}</p>}
    </Link>
  );
}
