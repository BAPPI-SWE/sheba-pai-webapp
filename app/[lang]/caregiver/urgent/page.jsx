import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import EmptyState from "@/components/EmptyState";
import { GlowCall, RequestButton, WaLink } from "@/components/care/Actions";
import CIcon from "@/components/CIcon";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta, JsonLd } from "@/lib/seo";
import { CARE_WEB } from "@/lib/careText";
import { careIcon, formatTaka, offerName, offerText, offerLd } from "@/lib/care";

export const revalidate = 1800;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const w = CARE_WEB[lang];
  return pageMeta({ lang, path: "/caregiver/urgent", title: w.urgentTitle, description: w.urgentDesc, image: "/img/caregiver.webp" });
}

/** CareUrgentScreen: home-visit jobs with clear prices — tap one, give name + phone, done. */
export default async function Urgent({ params }) {
  const { lang } = await params;
  const rows = await getJSON("/api/care/offers?kind=urgent", { fallback: [] });
  const list = Array.isArray(rows) ? rows : [];
  const crumbs = [
    { href: href(lang, "/"), label: t(lang, "tabHome") },
    { href: href(lang, "/caregiver"), label: t(lang, "wantCaregiver") },
    { href: href(lang, "/caregiver/urgent"), label: t(lang, "doorUrgent") },
  ];
  const ld = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })) },
    list.length > 0 && {
      "@context": "https://schema.org", "@type": "ItemList",
      itemListElement: list.map((o, i) => ({ "@type": "ListItem", position: i + 1, item: offerLd(o, lang, `${site.url}${href(lang, "/caregiver/urgent")}`) })),
    },
  ].filter(Boolean);

  return (
    <Screen title={t(lang, "doorUrgent")} back={href(lang, "/caregiver")} backLabel={t(lang, "wantCaregiver")} crumbs={crumbs}>
      <div className="narrow-wide">
        <div className="cg-intro accent">
          <span><Icon name="flash" size={22} /></span>
          <div><b>{t(lang, "urgIntroTitle")}</b><p>{t(lang, "urgIntroSub")}</p></div>
        </div>
        {list.length === 0 ? (
          <EmptyState icon="flash-outline" tone="accent" title={t(lang, "urgMoreCall")} sub={t(lang, "urgMoreCallSub")} />
        ) : (
          <div className="cg-offers">
            {list.map((o) => (
              <article key={o._id} className="cg-offer">
                <img src={careIcon(o.iconKey)} alt="" width={56} height={56} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2>{offerName(o, lang)}</h2>
                  {offerText(o, lang, "description") && <p className="cg-offer-desc">{offerText(o, lang, "description")}</p>}
                  <div className="cg-offer-price">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {o.price != null
                        ? <b>{formatTaka(o.price)}<small> {o.priceUnit ? t(lang, `offerUnit_${o.priceUnit}`) : ""}</small></b>
                        : <small>{t(lang, "carePriceOnCall")}</small>}
                      {offerText(o, lang, "priceNote") && <span className="cg-offer-note">* {offerText(o, lang, "priceNote")}</span>}
                    </div>
                    <RequestButton target={{ offer: { _id: o._id, name: o.name, nameBangla: o.nameBangla, price: o.price, priceUnit: o.priceUnit, iconKey: o.iconKey } }} className="cg-take">{t(lang, "urgTake")}</RequestButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <div style={{ marginTop: 16 }}><GlowCall title={t(lang, "urgMoreCall")} sub={t(lang, "urgMoreCallSub")} /></div>
        <WaLink message={t(lang, "careWaGeneral")} className="cg-walink"><CIcon name="logo-whatsapp" size={17} color="#16A34A" />{t(lang, "urgOrWhatsApp")}</WaLink>
        <p className="small-note" style={{ marginTop: 8 }}>{CARE_WEB[lang].urgentDesc}</p>
      </div>
      {ld.map((x, i) => <JsonLd key={i} data={x} />)}
    </Screen>
  );
}
