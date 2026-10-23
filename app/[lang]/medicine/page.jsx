import SoonPage from "@/components/SoonPage";
import { dict } from "@/lib/dict";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

// Placeholder until this section's phase is delivered.
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/medicine", title: t(lang, "wantMedicine"), description: dict(lang).svc.medicine.d });
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <SoonPage lang={lang} title={t(lang, "wantMedicine")} img="medicine" tone="accent" body={dict(lang).svc.medicine.d} />;
}
