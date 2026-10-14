import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href, taka, digits, L } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { pageMeta, JsonLd } from "@/lib/seo";

export const revalidate = 3600; // rebuilt at most once an hour, served from cache in between

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({
    lang, path: "/",
    title: lang === "bn"
      ? "সেবা পাই — ডাক্তার, ঘরে ওষুধ ও বাসায় কেয়ারগিভার"
      : "Sheba Pai — Doctors, medicine delivery and caregivers at home",
    description: dict(lang).heroSub,
  });
}

const UNIT = { visit: "perVisit", month: "perMonth", day: "perDay", shift12: "per12" };

export default async function Home({ params }) {
  const { lang } = await params;
  const t = dict(lang);
  const [specialties, urgent] = await Promise.all([
    getJSON("/api/specialties", { fallback: [] }),
    getJSON("/api/care/offers?kind=urgent", { fallback: [] }),
  ]);
  const specs = [...(Array.isArray(specialties) ? specialties : [])]
    .sort((a, b) => (b.doctorCount || 0) - (a.doctorCount || 0))
    .slice(0, 18);
  const popular = specs.filter((s) => s.doctorCount > 0).slice(0, 4);
  const prices = (Array.isArray(urgent) ? urgent : []).slice(0, 6);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      {/* ------------------------------ hero ------------------------------ */}
      <section className="hero">
        <div className="wrap">
          <div className="grid">
            <div>
              <h1>{t.heroTitle}</h1>
              <p className="hero-sub">{t.heroSub}</p>

              <form className="search" action={href(lang, "/doctors")} method="get" role="search">
                <label htmlFor="q">{t.searchLabel}</label>
                <input id="q" name="q" type="search" placeholder={t.searchPlaceholder} autoComplete="off" />
                <button className="btn btn-primary" type="submit"><Icon name="search" />{t.searchBtn}</button>
              </form>
              {popular.length > 0 && (
                <div className="popular">
                  <span>{t.popular}</span>
                  {popular.map((s) => (
                    <Link key={s._id} href={href(lang, `/doctors/${s.slug}`)}>{L(s, "name", lang)}</Link>
                  ))}
                </div>
              )}
            </div>

            <div className="doors">
              <Link href={href(lang, "/caregiver")} className="door door-care">
                <Image src="/img/caregiver.webp" alt="" fill sizes="(max-width: 900px) 50vw, 300px" priority />
                <span className="door-label">{t.tileCare}</span>
              </Link>
              <Link href={href(lang, "/doctors")} className="door door-doc">
                <Image src="/img/doctor.webp" alt="" fill sizes="(max-width: 900px) 45vw, 260px" priority />
                <span className="door-label">{t.tileDoctor}</span>
              </Link>
              <Link href={href(lang, "/medicine")} className="door door-med">
                <Image src="/img/medicine.webp" alt="" fill sizes="(max-width: 900px) 45vw, 260px" />
                <span className="door-label">{t.tileMedicine}</span>
              </Link>
            </div>
          </div>

          <div className="facts">
            {t.facts.map((f, i) => (
              <div key={i} className="fact">
                <span className="fact-icon"><Icon name={["shield", "tag", "cash"][i]} /></span>
                <div><strong>{f.t}</strong><span>{f.d}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- services ---------------------------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>{t.servicesTitle}</h2>
            <p>{t.servicesSub}</p>
          </div>
          <div className="svc-list">
            {[["caregiver", "/caregiver", "caregiver"], ["doctor", "/doctors", "doctor"], ["medicine", "/medicine", "medicine"]].map(([k, path, img]) => (
              <Link key={k} href={href(lang, path)} className="svc">
                <div className="svc-img"><Image src={`/img/${img}.webp`} alt="" width={200} height={150} /></div>
                <div>
                  <h3>{t.svc[k].t}</h3>
                  <p>{t.svc[k].d}</p>
                </div>
                <span className="svc-cta">{t.svc[k].cta}</span>
              </Link>
            ))}
          </div>
          <div className="soon">
            <span className="soon-title">{t.soonTitle}:</span>
            {t.soon.map((s) => (
              <span key={s.t} className="soon-item">
                {s.img ? <Image src={`/img/${s.img}.webp`} alt="" width={34} height={34} /> : <span className="soon-dot" style={{ display: "grid", placeItems: "center", color: "var(--coral)" }}><Icon name="ambulance" size={18} /></span>}
                {s.t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- prices ----------------------------- */}
      {prices.length > 0 && (
        <section className="section section-tint">
          <div className="wrap prices">
            <div className="prices-aside">
              <h2>{t.pricesTitle}</h2>
              <p className="muted" style={{ marginTop: 12, fontSize: "1.05rem", color: "var(--ink-2)" }}>{t.pricesSub}</p>
              <a href={`tel:${site.phone}`} className="btn btn-primary"><Icon name="phone" />{t.pricesMore}</a>
            </div>
            <ul className="price-list">
              {prices.map((o) => (
                <li key={o._id} className="price-row">
                  <div>
                    <strong>{L(o, "name", lang)}</strong>
                    {L(o, "priceNote", lang) && <small>{L(o, "priceNote", lang)}</small>}
                  </div>
                  <div className="price">
                    {o.price != null ? (
                      <><b>{taka(o.price, lang)}</b><span>{t[UNIT[o.priceUnit] || "perVisit"]}</span></>
                    ) : <span>{t.priceOnCall}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* --------------------------- specialties --------------------------- */}
      {specs.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>{t.specTitle}</h2>
              <p>{t.specSub}</p>
            </div>
            <div className="spec-grid">
              {specs.map((s) => (
                <Link key={s._id} href={href(lang, `/doctors/${s.slug}`)} className="spec">
                  {L(s, "name", lang)}
                  {s.doctorCount > 0 && <small>{digits(s.doctorCount, lang)}</small>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --------------------------- how it works --------------------------- */}
      <section className={`section ${specs.length > 0 ? "section-tint" : ""}`}>
        <div className="wrap">
          <div className="section-head"><h2>{t.howTitle}</h2></div>
          <ol className="steps">
            {t.how.map((s) => (
              <li key={s.t}><h3>{s.t}</h3><p>{s.d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------- faq ------------------------------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head"><h2>{t.faqTitle}</h2></div>
          <div className="faq">
            {t.faq.map((f) => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- app band ----------------------------- */}
      <section style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="wrap">
          <div className="app-band">
            <div>
              <h2>{t.appTitle}</h2>
              <p>{t.appSub}</p>
            </div>
            <a href={site.playStoreUrl} className="btn btn-light" target="_blank" rel="noopener"><Icon name="play" />{t.appBtn}</a>
          </div>
        </div>
      </section>

      <JsonLd data={faqLd} />
    </>
  );
}
