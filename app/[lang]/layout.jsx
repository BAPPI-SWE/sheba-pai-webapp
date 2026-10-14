import { notFound } from "next/navigation";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/noto-serif-bengali/700.css";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import site from "@/site.config";
import { LANGS, isLang } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { JsonLd, organizationLd } from "@/lib/seo";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const name = site.name[lang] || site.name.bn;
  return {
    metadataBase: new URL(site.url),
    title: { default: name, template: `%s | ${name}` },
    applicationName: name,
    formatDetection: { telephone: false },
  };
}

export const viewport = { themeColor: "#0d9488", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  return (
    <html lang={lang === "bn" ? "bn-BD" : "en"}>
      <body>
        <a href="#main" className="skip">{t.skip}</a>
        <Header lang={lang} />
        <main id="main">{children}</main>
        <Footer lang={lang} />
        <JsonLd data={organizationLd(lang)} />
      </body>
    </html>
  );
}
