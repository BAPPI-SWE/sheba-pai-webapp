import MedicineListPage from "@/components/medicine/MedicineListPage";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/medicine/deals", title: t(lang, "hotDealsTitle"), description: t(lang, "hotDealsTitle") });
}

export default async function Deals({ params }) {
  const { lang } = await params;
  return (
    <MedicineListPage lang={lang} title={t(lang, "hotDealsTitle")} query={{ onSale: "true" }}
      crumbs={[{ href: href(lang, "/"), label: t(lang, "tabHome") }, { href: href(lang, "/medicine"), label: t(lang, "wantMedicine") }, { href: href(lang, "/medicine/deals"), label: t(lang, "hotDealsTitle") }]} />
  );
}
