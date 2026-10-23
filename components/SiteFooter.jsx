import Link from "next/link";
import site from "@/site.config";
import { href, digits } from "@/lib/i18n";
import { dict } from "@/lib/dict";

/** Quiet footer with the links Google and the Play Store need. */
export default function SiteFooter({ lang }) {
  const t = dict(lang);
  const links = [["/about", t.nav.about], ["/contact", t.nav.contact], ["/privacy", t.privacy], ["/terms", t.terms], ["/delete-account", t.deleteAccount]];
  return (
    <footer className="sfoot">
      <nav aria-label={t.footerCompany}>
        {links.map(([p, l]) => <Link key={p} href={href(lang, p)}>{l}</Link>)}
        <Link href={lang === "en" ? "/" : "/en"} hrefLang={lang === "en" ? "bn" : "en"}>{t.langSwitch}</Link>
      </nav>
      <p>{site.address[lang]} · {site.phoneDisplay[lang]}</p>
      <p>© {digits(new Date().getFullYear(), lang)} {site.name[lang]}. {t.disclaimer}</p>
    </footer>
  );
}
