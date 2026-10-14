import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import site from "@/site.config";
import { href } from "@/lib/i18n";
import { dict } from "@/lib/dict";

/** Placeholder for a section that launches in a later phase — still useful: call, WhatsApp, app. */
export default function SoonPage({ lang, name, img, body }) {
  const t = dict(lang);
  return (
    <div className="wrap soon-page">
      <Image src={`/img/${img}.webp`} alt="" width={220} height={220} priority />
      <h1>{t.soonPageTitle(name)}</h1>
      {body && <p className="soon-lead">{body}</p>}
      <p>{t.soonPageBody}</p>
      <div className="actions">
        <a href={`tel:${site.phone}`} className="btn btn-primary"><Icon name="phone" />{t.callUs}</a>
        <a href={`https://wa.me/${site.whatsapp}`} className="btn btn-wa" target="_blank" rel="noopener"><Icon name="whatsapp" />{t.whatsapp}</a>
        <a href={site.playStoreUrl} className="btn btn-ghost" target="_blank" rel="noopener"><Icon name="play" />{t.appBtn}</a>
      </div>
      <p style={{ marginTop: 28 }}><Link href={href(lang, "/")}>{t.backHome}</Link></p>
    </div>
  );
}
