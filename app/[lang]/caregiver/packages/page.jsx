import Icon from "@/components/Icon";
import CIcon from "@/components/CIcon";
import Screen from "@/components/Screen";
import EmptyState from "@/components/EmptyState";
import { GlowCall, RequestButton } from "@/components/care/Actions";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta, JsonLd } from "@/lib/seo";
import { CARE_WEB } from "@/lib/careText";
import { careIcon, formatTaka, offerName, offerText, offerFeatures, offerLd } from "@/lib/care";

export const revalidate = 1800;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const w = CARE_WEB[lang];
  return pageMeta({ lang, path: "/caregiver/packages", title: w.packagesTitle, description: w.packagesDesc, image: "/img/caregiver.webp" });
}

/** CarePackagesScreen: monthly packages with price and what is included. */
export default async function Packages({ params }) {
  const { lang } = await params;
  const rows = await getJSON("/api/care/offers?kind=package", { fallback: [] });
  const list = Array.isArray(rows) ? rows : [];
  const crumbs = [
    { href: href(lang, "/"), label: t(lang, "tabHome") },
    { href: href(lang, "/caregiver"), label: t(lang, "wantCaregiver") },
    { href: href(lang, "/caregiver/packages"), label: t(lang, "doorPackages") },
  ];
  const ld = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })) },
    list.length > 0 && {
      "@context": "https://schema.org", "@type": "ItemList",
      itemListElement: list.map((o, i) => ({ "@type": "ListItem", position: i + 1, item: offerLd(o, lang, `${site.url}${href(lang, "/caregiver/packages")}`) })),
    },
  ].filter(Boolean);

  return (
    <Screen title={t(lang, "doorPackages")} back={href(lang, "/caregiver")} backLabel={t(lang, "wantCaregiver")} crumbs={crumbs} tint="helper">
      <div className="narrow-wide">
        <div className="cg-intro helper">
          <span><Icon name="calendar" size={21} /></span>
          <div><b>{t(lang, "pkgIntroTitle")}</b><p>{t(lang, "pkgIntroSub")}</p></div>
        </div>
        {list.length === 0 ? (
          <EmptyState icon="calendar-outline" tone="helper" title={t(lang, "pkgCustomCall")} sub={t(lang, "pkgCustomCallSub")} />
        ) : (
          <div className="cg-pkgs">
            {list.map((o) => {
              const popular = !!(o.badge || o.badgeBangla);
              const feats = offerFeatures(o, lang);
              return (
                <article key={o._id} className={`cg-pkg ${popular ? "popular" : ""}`}>
                  {popular && <span className="cg-ribbon"><CIcon name="star" size={11} />{offerText(o, lang, "badge")}</span>}
                  <div className="cg-pkg-head">
                    <img src={careIcon(o.iconKey)} alt="" width={58} height={58} />
                    <div style={{ minWidth: 0, paddingRight: popular ? 64 : 0 }}>
                      <h2>{offerName(o, lang)}</h2>
                      {offerText(o, lang, "description") && <p>{offerText(o, lang, "description")}</p>}
                    </div>
                  </div>
                  <p className="cg-pkg-price">
                    {o.price != null ? <><b>{formatTaka(o.price)}</b><small> {o.priceUnit ? t(lang, `offerUnit_${o.priceUnit}`) : ""}</small></> : <small>{t(lang, "carePriceOnCall")}</small>}
                  </p>
                  {offerText(o, lang, "priceNote") && <p className="cg-offer-note">* {offerText(o, lang, "priceNote")}</p>}
                  {feats.length > 0 && (
                    <ul className="cg-feats">{feats.map((f, k) => <li key={k}><span><CIcon name="checkmark" size={13} /></span>{f}</li>)}</ul>
                  )}
                  <RequestButton target={{ offer: { _id: o._id, name: o.name, nameBangla: o.nameBangla, price: o.price, priceUnit: o.priceUnit, iconKey: o.iconKey } }} className={`cg-cta ${popular ? "primary" : ""}`}>
                    {t(lang, "pkgTake")}<CIcon name="arrow-forward" size={17} />
                  </RequestButton>
                </article>
              );
            })}
          </div>
        )}
        <div style={{ marginTop: 16 }}><GlowCall title={t(lang, "pkgCustomCall")} sub={t(lang, "pkgCustomCallSub")} tone="helper" /></div>
        <p className="small-note" style={{ marginTop: 12 }}>{CARE_WEB[lang].packagesDesc}</p>
      </div>
      {ld.map((x, i) => <JsonLd key={i} data={x} />)}
    </Screen>
  );
}
