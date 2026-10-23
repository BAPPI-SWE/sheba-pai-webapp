import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import site from "@/site.config";
import { href } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const d = dict(lang);
  return pageMeta({ lang, path: "/contact", title: d.contactTitle, description: d.contactSub });
}

export default async function Contact({ params }) {
  const { lang } = await params;
  const d = dict(lang);
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.en)}`;
  const rows = [
    [`tel:${site.phone}`, "call-outline", "success", d.contactPhone, site.phoneDisplay[lang]],
    [`https://wa.me/${site.whatsapp}`, "logo-whatsapp", "success", d.contactWa, site.phoneDisplay[lang]],
    [`mailto:${site.email}`, "mail-outline", "primary", d.contactEmail, site.email],
    [map, "location-outline", "helper", d.contactAddress, site.address[lang]],
  ];
  return (
    <Screen title={d.contactTitle} back={href(lang, "/account")} backLabel={d.backHome}>
      <div className="narrow">
        <p className="lead">{d.contactSub}</p>
        <ul className="glist">
          {rows.map(([to, icon, tone, label, value]) => (
            <li key={label}>
              <a href={to} className="grow" target={to.startsWith("http") ? "_blank" : undefined} rel="noopener">
                <span className={`icircle tone-${tone}`} style={{ width: 44, height: 44 }}><Icon name={icon} size={20} /></span>
                <span className="grow-main"><span className="grow-sub" style={{ marginTop: 0 }}>{label}</span><span className="grow-title">{value}</span></span>
                <Icon name="chevron-forward" size={18} className="grow-chev" />
              </a>
            </li>
          ))}
          <li>
            <div className="grow">
              <span className="icircle tone-warning" style={{ width: 44, height: 44 }}><Icon name="time-outline" size={20} /></span>
              <span className="grow-main"><span className="grow-sub" style={{ marginTop: 0 }}>{d.contactHours}</span><span className="grow-title">{site.hours[lang]}</span></span>
            </div>
          </li>
        </ul>
      </div>
    </Screen>
  );
}
