import { notFound } from "next/navigation";
import MedicineListPage from "@/components/medicine/MedicineListPage";
import { getJSON } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const cats = await getJSON("/api/categories", { fallback: [] });
  return (Array.isArray(cats) ? cats : []).map((c) => ({ slug: c.slug }));
}

async function find(slug) {
  const cats = await getJSON("/api/categories", { fallback: null });
  return Array.isArray(cats) ? cats.find((c) => c.slug === slug) : null;
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const c = await find(slug);
  if (!c) return {};
  const n = lang === "en" ? c.name : c.nameBangla || c.name;
  return pageMeta({
    lang, path: `/medicine/category/${slug}`,
    title: lang === "bn" ? `${n} — ওষুধের দাম ও অনলাইন অর্ডার` : `${n} medicines — prices and online order`,
    description: lang === "bn" ? `${n} বিভাগের ওষুধ: দাম, কোম্পানি, জেনেরিক নাম। ঘরে বসে অর্ডার করুন।` : `${n} medicines with prices, makers and generic names. Order to your door.`,
  });
}

export default async function Category({ params }) {
  const { lang, slug } = await params;
  const c = await find(slug);
  if (!c) notFound();
  const n = lang === "en" ? c.name : c.nameBangla || c.name;
  return (
    <MedicineListPage lang={lang} title={n} query={{ categorySlug: slug }}
      crumbs={[{ href: href(lang, "/"), label: t(lang, "tabHome") }, { href: href(lang, "/medicine"), label: t(lang, "wantMedicine") }, { href: href(lang, `/medicine/category/${slug}`), label: n }]} />
  );
}
