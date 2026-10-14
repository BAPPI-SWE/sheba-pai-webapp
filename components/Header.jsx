"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import site from "@/site.config";
import { href } from "@/lib/i18n";
import { dict } from "@/lib/dict";

const NAV = [
  ["doctors", "/doctors"],
  ["medicine", "/medicine"],
  ["caregiver", "/caregiver"],
  ["about", "/about"],
];

export default function Header({ lang }) {
  const t = dict(lang);
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);

  // The same page in the other language.
  const bare = lang === "en" ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
  const other = lang === "en" ? bare : href("en", bare);
  const current = (path) => (bare === path || bare.startsWith(`${path}/`) ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href={href(lang, "/")} className="brand" aria-label={site.name[lang]}>
          <Image src="/img/logo.png" alt="" width={38} height={38} priority />
          <span>
            <span className="brand-name">{site.name.bn}</span>
            <span className="brand-sub">Sheba Pai</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main">
          {NAV.map(([key, path]) => (
            <Link key={key} href={href(lang, path)} aria-current={current(path)}>{t.nav[key]}</Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href={other} className="lang-link" hrefLang={lang === "bn" ? "en" : "bn"} aria-label={t.langSwitchLabel}>{t.langSwitch}</Link>
          <a href={`tel:${site.phone}`} className="btn btn-primary hide-sm"><Icon name="phone" />{site.phoneDisplay[lang]}</a>
          <button className="menu-btn" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? "close" : "menu"} size={22} label={open ? t.close : t.menu} />
          </button>
        </div>
      </div>

      <nav id="mobile-nav" className="mobile-nav" data-open={open} aria-label="Main">
        {NAV.map(([key, path]) => (
          <Link key={key} href={href(lang, path)} aria-current={current(path)}>{t.nav[key]}</Link>
        ))}
        <Link href={href(lang, "/contact")}>{t.nav.contact}</Link>
        <div className="mobile-cta">
          <a href={`tel:${site.phone}`} className="btn btn-primary"><Icon name="phone" />{t.call}</a>
          <a href={`https://wa.me/${site.whatsapp}`} className="btn btn-wa" target="_blank" rel="noopener"><Icon name="whatsapp" />{t.whatsapp}</a>
        </div>
      </nav>
    </header>
  );
}
