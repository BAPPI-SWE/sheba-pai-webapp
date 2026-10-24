import Link from "next/link";
import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import EmptyState from "@/components/EmptyState";
import MedicineSearch from "@/components/medicine/MedicineSearch";
import Banners from "@/components/medicine/Banners";
import CartBar from "@/components/medicine/CartBar";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta, JsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({
    lang, path: "/medicine",
    title: lang === "bn" ? "ঔষধ সেবা — অনলাইনে ওষুধ অর্ডার, ঘরে ডেলিভারি" : "Medicine — order online, delivered home",
    description: lang === "bn"
      ? "ব্র্যান্ড বা জেনেরিক নাম দিয়ে ওষুধ খুঁজুন, দাম দেখুন আর অর্ডার করুন। প্রেসক্রিপশনের ওষুধে ছবি দিন, ক্যাশ অন ডেলিভারি।"
      : "Search medicines by brand or generic name, see prices and order. Add a prescription photo where needed; cash on delivery.",
  });
}

/** PharmacyHomeScreen: search, promo banners, categories. */
export default async function PharmacyHome({ params }) {
  const { lang } = await params;
  const [banners, categories] = await Promise.all([
    getJSON("/api/banners", { fallback: [] }),
    getJSON("/api/categories", { fallback: [] }),
  ]);
  const cats = Array.isArray(categories) ? categories : [];
  const bans = Array.isArray(banners) ? banners.filter((b) => b.imageUrl) : [];
  const name = (c) => (lang === "en" ? c.name : c.nameBangla || c.name);

  return (
    <Screen title={t(lang, "wantMedicine")} back={href(lang, "/")} backLabel={t(lang, "tabHome")}
      crumbs={[{ href: href(lang, "/"), label: t(lang, "tabHome") }, { href: href(lang, "/medicine"), label: t(lang, "wantMedicine") }]}>
      <MedicineSearch lang={lang}>
        {bans.length > 0 && <Banners banners={bans} lang={lang} />}
        {cats.length > 0 && (
          <section style={{ marginTop: bans.length ? 24 : 0 }}>
            <h2 className="section-title">{t(lang, "categoriesTitle")}</h2>
            <div className="cat-grid">
              {cats.map((c) => (
                <Link key={c._id} href={href(lang, `/medicine/category/${c.slug}`)} className="cat-card press">
                  <span className={`icircle tone-${c.tone || "primary"}`} style={{ width: 52, height: 52 }}><Icon name={c.icon || "medkit"} size={23} /></span>
                  <span>{name(c)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
        {cats.length === 0 && bans.length === 0 && <EmptyState icon="medkit-outline" tone="muted" title={t(lang, "noMedicinesFound")} />}
        <p style={{ marginTop: 24, textAlign: "center" }}>
          <Link href={href(lang, "/medicine/generics")} className="chip press" style={{ background: "var(--surface)" }}>
            {lang === "bn" ? "জেনেরিক নাম অনুযায়ী সব ওষুধ" : "All medicines by generic name"}<Icon name="chevron-forward" size={14} />
          </Link>
        </p>
      </MedicineSearch>
      <CartBar lang={lang} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", url: site.url, name: site.name[lang] }} />
    </Screen>
  );
}
