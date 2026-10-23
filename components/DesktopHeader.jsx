"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CIcon from "@/components/CIcon";
import { splitPath, isActive } from "@/lib/paths";

/** Top navigation on wide screens. On phones the app-style bars are used instead. */
export default function DesktopHeader({ lang, L, phone, phoneDisplay }) {
  const { path } = splitPath(usePathname());
  const pre = lang === "en" ? "/en" : "";
  const to = (p) => (lang === "en" ? (p === "/" ? "/en" : `/en${p}`) : p);
  const other = lang === "en" ? path : path === "/" ? "/en" : `/en${path}`;
  const nav = [["/", L.home, "home-outline"], ["/doctors", L.doctor, "medkit-outline"], ["/medicine", L.medicine, "cart-outline"], ["/caregiver", L.caregiver, "heart-outline"]];
  return (
    <header className="dhead">
      <div className="dhead-in">
        <Link href={to("/")} className="brand" aria-label={L.brand}>
          <Image src="/img/logo.png" alt="" width={40} height={40} priority />
          <span>
            <span className="brand-name">Sheba Pai</span>
            <span className="brand-tag">সেবা পাই</span>
          </span>
        </Link>
        <nav className="dnav" aria-label={L.navLabel}>
          {nav.map(([p, label, icon]) => (
            <Link key={p} href={to(p)} aria-current={isActive(path, p) ? "page" : undefined}>
              <CIcon name={icon} size={18} />{label}
            </Link>
          ))}
        </nav>
        <div className="topbar-actions">
          <Link href={other} hrefLang={lang === "en" ? "bn" : "en"} className="lang-pill" lang={lang === "en" ? "bn" : "en"}>
            <CIcon name="language-outline" size={16} />{L.langSwitch}
          </Link>
          <a href={`tel:${phone}`} className="dcall"><CIcon name="call" size={16} /><span className="num">{phoneDisplay}</span></a>
          <Link href={to("/cart")} className="round-btn" aria-label={L.cart}><CIcon name="cart-outline" size={21} /></Link>
          <Link href={to("/activity")} className="round-btn" aria-label={L.activity}><CIcon name="receipt-outline" size={20} /></Link>
          <Link href={to("/account")} className="round-btn avatar" aria-label={L.profile}><CIcon name="person" size={18} /></Link>
        </div>
      </div>
    </header>
  );
}
