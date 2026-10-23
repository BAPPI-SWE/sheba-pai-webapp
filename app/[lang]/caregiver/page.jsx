import SoonPage from "@/components/SoonPage";
import { dict } from "@/lib/dict";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

// Placeholder until this section's phase is delivered.
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/caregiver", title: t(lang, "wantCaregiver"), description: dict(lang).svc.caregiver.d });
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <SoonPage lang={lang} title={t(lang, "wantCaregiver")} img="caregiver" tone="primary" body={dict(lang).svc.caregiver.d} />;
}
