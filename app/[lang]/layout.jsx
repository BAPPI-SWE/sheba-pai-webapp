import { notFound } from "next/navigation";
import "@fontsource/noto-sans-bengali/400.css";
import "@fontsource/noto-sans-bengali/500.css";
import "@fontsource/noto-sans-bengali/600.css";
import "@fontsource/noto-sans-bengali/700.css";
import "@fontsource/noto-sans-bengali/800.css";
import "../globals.css";
import DesktopHeader from "@/components/DesktopHeader";
import TabBar from "@/components/TabBar";
import SiteFooter from "@/components/SiteFooter";
import site from "@/site.config";
import { LANGS, isLang } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { t } from "@/lib/appText";
import { JsonLd, organizationLd } from "@/lib/seo";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}
// Unknown languages are rejected below with notFound(); keeping params dynamic lets
// new doctor pages render on first visit in both languages.
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const name = site.name[lang] || site.name.bn;
  return {
    metadataBase: new URL(site.url),
    title: { default: name, template: `%s | ${name}` },
    applicationName: name,
    formatDetection: { telephone: false },
    appleWebApp: { capable: true, title: name, statusBarStyle: "default" },
  };
}

export const viewport = { themeColor: "#FFFFFF", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict(lang);
  const L = {
    brand: site.name[lang], navLabel: d.menu, langSwitch: d.langSwitch,
    home: t(lang, "tabHome"), doctor: t(lang, "wantDoctor"), medicine: t(lang, "wantMedicine"), caregiver: t(lang, "wantCaregiver"),
    cart: t(lang, "tabCart"), activity: t(lang, "tabActivity"), profile: t(lang, "tabProfile"),
    homeLabel: t(lang, "tabHome"), cartLabel: t(lang, "tabCart"), activityLabel: t(lang, "tabActivity"), tabsLabel: d.menu,
  };
  return (
    <html lang={lang === "bn" ? "bn-BD" : "en"}>
      <body>
        <a href="#main" className="skip">{d.skip}</a>
        <div className="page">
          <DesktopHeader lang={lang} L={L} phone={site.phone} phoneDisplay={site.phoneDisplay[lang]} />
          <main id="main">{children}</main>
          <SiteFooter lang={lang} />
          <TabBar lang={lang} L={L} />
        </div>
        <JsonLd data={organizationLd(lang)} />
      </body>
    </html>
  );
}
