import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import HomeTopBar from "@/components/HomeTopBar";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href, taka, digits, L } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { t } from "@/lib/appText";
import { pageMeta, JsonLd } from "@/lib/seo";
import { careIcon } from "@/lib/careIcons";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({
    lang, path: "/",
    title: lang === "bn"
      ? "সেবা পাই — ডাক্তার খুঁজুন, ঔষধ সেবা ও বাসায় নার্স / কেয়ারগিভার"
      : "Sheba Pai — Find a doctor, medicine delivery and nurses at home",
    description: dict(lang).heroSub,
  });
}

/** The same six services, tones and icons as the app's HomeHubScreen. */
const OPTIONS = [
  { key: "caregiver", img: "caregiver", tone: "primary", live: true, title: "wantCaregiver", sub: "wantCaregiverSub", path: "/caregiver" },
  { key: "medicine", img: "medicine", tone: "accent", live: true, title: "wantMedicine", sub: "wantMedicineSub", path: "/medicine" },
  { key: "doctor", img: "doctor", tone: "helper", live: true, title: "wantDoctor", sub: "wantDoctorSub", path: "/doctors" },
  { key: "test", img: "test", tone: "warning", live: false, title: "wantSample", sub: "wantSampleSub", path: "/services/test" },
  { key: "equipment", img: "equipment", tone: "success", live: false, title: "wantEquipment", sub: "wantEquipmentSub", path: "/services/equipment" },
  { key: "ambulance", icon: "car", tone: "danger", live: false, title: "wantAmbulance", sub: "wantAmbulanceSub", path: "/services/ambulance" },
];
const ICON_COLOR = { danger: "var(--danger)" };
const UNIT = { visit: "careUnit_visit", month: "careUnit_month", day8: "careUnit_day8", shift12: "careUnit_shift12", day12: "careUnit_day12", night12: "careUnit_night12", live24: "careUnit_live24" };

export default async function Home({ params }) {
  const { lang } = await params;
  const d = dict(lang);
  const [settings, urgent, specialties] = await Promise.all([
    getJSON("/api/settings/public", { fallback: {} }),
    getJSON("/api/care/offers?kind=urgent", { fallback: [] }),
    getJSON("/api/specialties", { fallback: [] }),
  ]);
  const helpNumber = settings?.emergencyContactNumber || site.phone;
  const prices = (Array.isArray(urgent) ? urgent : []).slice(0, 6);
  const specs = (Array.isArray(specialties) ? specialties : []).filter((s) => s.doctorCount > 0).slice(0, 10);

  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <HomeTopBar lang={lang} L={{ brand: site.name[lang], activity: t(lang, "tabActivity"), profile: t(lang, "tabProfile"), login: t(lang, "login") }} />

      <div className="body">
        <div className="home-grid">
          <div className="home-hero">
            <h1 className="greet">{t(lang, "homeHubWelcomeLabel")}, <b>{t(lang, "homeHubGreeting")}</b> 👋</h1>
            <p className="hero-sub">{t(lang, "homeHubGreetingDesc")}</p>
            <a href={`tel:${helpNumber}`} className="helpbar press">
              <Image src="/img/support.webp" alt="" width={32} height={32} />
              <span className="helpbar-text">{t(lang, "needHelpQuestion")}</span>
              <span className="callpulse"><Icon name="call" size={16} /></span>
            </a>
          </div>

          <section aria-labelledby="svc-title">
            <h2 id="svc-title" className="section-title">{t(lang, "servicesTitle")}</h2>
            <div className="tiles">
              {OPTIONS.map((o, i) => (
                <Link key={o.key} href={href(lang, o.path)}
                  className={`tile press bg-${o.tone} ${o.live ? "live" : ""} ${i === OPTIONS.length - 1 && OPTIONS.length % 2 ? "full" : ""}`}>
                  <span className="tile-head">{!o.live && <span className="soon-pill">{t(lang, "comingSoonTitle")}</span>}</span>
                  <span className="tile-icon">
                    {o.img
                      ? <Image src={`/img/${o.img}.webp`} alt="" width={72} height={72} priority={i < 4} />
                      : <Icon name={o.icon} size={46} color={ICON_COLOR[o.tone]} />}
                  </span>
                  <span className="tile-title">{t(lang, o.title)}</span>
                  <span className="tile-sub">{t(lang, o.sub)}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="home-more">
          <div>
            {prices.length > 0 && (
              <section aria-labelledby="price-title">
                <h2 id="price-title" className="section-title sp">{d.pricesTitle}</h2>
                <div className="glist">
                  {prices.map((o) => (
                    <div key={o._id} className="price-row">
                      <span className="icircle tone-primary" style={{ width: 44, height: 44 }}><Image src={careIcon(o.iconKey)} alt="" width={36} height={36} /></span>
                      <div className="grow-main">
                        <span className="grow-title">{L(o, "name", lang)}</span>
                        {L(o, "priceNote", lang) && <small>{L(o, "priceNote", lang)}</small>}
                      </div>
                      <div className="price">
                        {o.price != null
                          ? <><b>{taka(o.price, lang)}</b><span>{o.priceUnit === "day" ? `/ ${d.perDay.replace(/^প্রতি |^per /, "")}` : t(lang, UNIT[o.priceUnit] || "careUnit_visit")}</span></>
                          : <span>{d.priceOnCall}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <a href={`tel:${site.phone}`} className="btn btn-soft btn-block" style={{ marginTop: 12 }}>
                  <Icon name="call" size={18} />{d.pricesMore}
                </a>
              </section>
            )}

            {specs.length > 0 && (
              <section aria-labelledby="spec-title">
                <h2 id="spec-title" className="section-title sp">{t(lang, "docSpecialtiesTitle")}</h2>
                <div className="chips">
                  {specs.map((s) => (
                    <Link key={s._id} href={href(lang, `/doctors/${s.slug}`)} className="chip press">
                      {L(s, "name", lang)}
                      <span className="count-pill" style={{ background: "#fff" }}>{s.doctorCount}</span>
                    </Link>
                  ))}
                  <Link href={href(lang, "/doctors")} className="chip press" style={{ background: "#fff" }}>
                    {d.specAll}<Icon name="chevron-forward" size={14} />
                  </Link>
                </div>
              </section>
            )}
          </div>

          <div>
            <section aria-labelledby="faq-title">
              <h2 id="faq-title" className="section-title sp">{d.faqTitle}</h2>
              <div className="glist faq">
                {d.faq.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}<Icon name="chevron-forward" size={18} /></summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <div className="appcard">
              <div style={{ flex: 1 }}>
                <h2>{d.appTitle}</h2>
                <p>{d.appSub}</p>
              </div>
              <a href={site.playStoreUrl} className="btn" target="_blank" rel="noopener"><Icon name="logo-google-playstore" size={18} />{d.appBtn}</a>
            </div>
          </div>
        </div>
      </div>

      <JsonLd data={faqLd} />
    </>
  );
}
