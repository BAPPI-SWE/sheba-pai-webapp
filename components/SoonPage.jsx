import Image from "next/image";
import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import site from "@/site.config";
import { href } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { t } from "@/lib/appText";

/**
 * The app's ComingSoon screen. Still useful today: call, WhatsApp, or the app.
 * `tone` and `img` match the service's tile on the home screen.
 */
export default function SoonPage({ lang, title, img, icon, tone = "primary", body }) {
  const d = dict(lang);
  return (
    <Screen title={title} back={href(lang, "/")} backLabel={d.backHome}>
      <div className="soon-screen">
        <span className={`tile-icon bg-${tone}`}>
          {img ? <Image src={`/img/${img}.webp`} alt="" width={112} height={112} priority /> : <Icon name={icon} size={60} color={`var(--${tone})`} />}
        </span>
        <h2>{t(lang, "comingSoonTitle")}</h2>
        {body && <p style={{ color: "var(--text)" }}>{body}</p>}
        <p>{d.soonPageBody}</p>
        <div className="actions">
          <a href={`tel:${site.phone}`} className="btn btn-primary"><Icon name="call" size={18} />{d.callUs}</a>
          <a href={`https://wa.me/${site.whatsapp}`} className="btn btn-wa" target="_blank" rel="noopener"><Icon name="logo-whatsapp" size={20} />{d.whatsapp}</a>
          <a href={site.playStoreUrl} className="btn btn-outline" target="_blank" rel="noopener"><Icon name="logo-google-playstore" size={18} />{d.appBtn}</a>
        </div>
      </div>
    </Screen>
  );
}
