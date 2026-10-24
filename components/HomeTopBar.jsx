import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import { href } from "@/lib/i18n";
import TopBarAuth from "@/components/TopBarAuth";

/** HomeHubScreen's top bar: logo, "Sheba Pai — সেবা পাই —", bell and profile. */
export default function HomeTopBar({ lang, L }) {
  return (
    <div className="topbar">
      <Link href={href(lang, "/")} className="brand" aria-label={L.brand}>
        <Image src="/img/logo.png" alt="" width={40} height={40} priority />
        <span>
          <span className="brand-name">Sheba Pai</span>
          <span className="brand-tag">সেবা পাই</span>
        </span>
      </Link>
      <div className="topbar-actions">
        <Link href={href(lang, "/activity")} className="round-btn press" aria-label={L.activity}>
          <Icon name="notifications-outline" size={22} />
        </Link>
        <TopBarAuth lang={lang} L={L} />
      </div>
    </div>
  );
}
