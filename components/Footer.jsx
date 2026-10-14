import Link from "next/link";
import Image from "next/image";
import site from "@/site.config";
import { href, digits } from "@/lib/i18n";
import { dict } from "@/lib/dict";

export default function Footer({ lang }) {
  const t = dict(lang);
  const year = digits(new Date().getFullYear(), lang);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href={href(lang, "/")} className="brand">
              <Image src="/img/logo.png" alt="" width={36} height={36} />
              <span className="brand-name">{site.name.bn}</span>
            </Link>
            <p>{t.footerAbout}</p>
          </div>
          <div>
            <h3>{t.footerServices}</h3>
            <ul>
              <li><Link href={href(lang, "/doctors")}>{t.nav.doctors}</Link></li>
              <li><Link href={href(lang, "/medicine")}>{t.nav.medicine}</Link></li>
              <li><Link href={href(lang, "/caregiver")}>{t.nav.caregiver}</Link></li>
            </ul>
          </div>
          <div>
            <h3>{t.footerCompany}</h3>
            <ul>
              <li><Link href={href(lang, "/about")}>{t.nav.about}</Link></li>
              <li><Link href={href(lang, "/contact")}>{t.nav.contact}</Link></li>
              <li><Link href={href(lang, "/privacy")}>{t.privacy}</Link></li>
              <li><Link href={href(lang, "/terms")}>{t.terms}</Link></li>
              <li><Link href={href(lang, "/delete-account")}>{t.deleteAccount}</Link></li>
            </ul>
          </div>
          <div>
            <h3>{t.footerHelp}</h3>
            <ul>
              <li><a href={`tel:${site.phone}`}>{site.phoneDisplay[lang]}</a></li>
              <li><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">{t.whatsapp}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li>{site.address[lang]}</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {year} {site.name[lang]}. {t.rights}.</span>
          <span>{t.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
