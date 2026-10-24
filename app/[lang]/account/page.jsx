import Link from "next/link";
import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import site from "@/site.config";
import { href } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";
import { AccountHeader, AccountActions } from "@/components/account/AccountPanel";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/account", title: t(lang, "tabProfile"), description: dict(lang).footerAbout, noindex: true });
}

function Row({ to, ext, icon, tone = "primary", title, sub, rowLang }) {
  const inner = (
    <>
      <span className={`icircle tone-${tone}`} style={{ width: 40, height: 40 }}><Icon name={icon} size={19} /></span>
      <span className="grow-main"><span className="grow-title">{title}</span>{sub && <span className="grow-sub">{sub}</span>}</span>
      <Icon name="chevron-forward" size={18} className="grow-chev" />
    </>
  );
  return (
    <li>
      {ext
        ? <a href={to} className="grow" target={to.startsWith("http") ? "_blank" : undefined} rel="noopener">{inner}</a>
        : <Link href={to} className="grow" hrefLang={rowLang}>{inner}</Link>}
    </li>
  );
}

/** The app's Profile screen for a visitor who has not signed in yet. */
export default async function Account({ params }) {
  const { lang } = await params;
  const d = dict(lang);
  return (
    <Screen title={t(lang, "tabProfile")} back={href(lang, "/")} backLabel={d.backHome}>
      <div className="narrow">
        <AccountHeader lang={lang} />

        <ul className="glist">
          <Row to={href(lang, "/activity")} icon="receipt-outline" title={t(lang, "profMyActivity")} />
          <Row to={lang === "en" ? "/account" : "/en/account"} rowLang={lang === "en" ? "bn" : "en"} icon="language-outline" tone="helper"
            title={`${t(lang, "language")}: ${lang === "en" ? "English" : "বাংলা"}`} sub={d.langSwitchLabel} />
        </ul>

        <h2 className="section-title sp">{d.footerHelp}</h2>
        <ul className="glist">
          <Row ext to={`tel:${site.phone}`} icon="call-outline" tone="success" title={t(lang, "profCallSupport")} sub={site.phoneDisplay[lang]} />
          <Row ext to={`https://wa.me/${site.whatsapp}`} icon="logo-whatsapp" tone="success" title={t(lang, "profWhatsAppSupport")} />
          <Row to={href(lang, "/contact")} icon="mail-outline" title={d.nav.contact} sub={site.email} />
        </ul>

        <h2 className="section-title sp">{d.footerCompany}</h2>
        <ul className="glist">
          <Row to={href(lang, "/about")} icon="information-circle-outline" tone="muted" title={d.nav.about} />
          <Row to={href(lang, "/privacy")} icon="shield-checkmark-outline" tone="muted" title={d.privacy} />
          <Row to={href(lang, "/terms")} icon="document-text-outline" tone="muted" title={d.terms} />
          <Row to={href(lang, "/delete-account")} icon="trash-outline" tone="danger" title={d.deleteAccount} />
          <Row ext to={site.playStoreUrl} icon="logo-google-playstore" title={d.appBtn} />
        </ul>

        <AccountActions lang={lang} />
      </div>
    </Screen>
  );
}
