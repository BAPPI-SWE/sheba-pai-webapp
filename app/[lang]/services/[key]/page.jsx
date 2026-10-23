import { notFound } from "next/navigation";
import SoonPage from "@/components/SoonPage";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

const SERVICES = {
  test: { title: "wantSample", sub: "wantSampleSub", img: "test", tone: "warning" },
  equipment: { title: "wantEquipment", sub: "wantEquipmentSub", img: "equipment", tone: "success" },
  ambulance: { title: "wantAmbulance", sub: "wantAmbulanceSub", icon: "car", tone: "danger" },
};
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(SERVICES).map((key) => ({ key })); }

export async function generateMetadata({ params }) {
  const { lang, key } = await params;
  const s = SERVICES[key];
  return s ? pageMeta({ lang, path: `/services/${key}`, title: t(lang, s.title), description: t(lang, s.sub) }) : {};
}

export default async function Page({ params }) {
  const { lang, key } = await params;
  const s = SERVICES[key];
  if (!s) notFound();
  return <SoonPage lang={lang} title={t(lang, s.title)} img={s.img} icon={s.icon} tone={s.tone} body={t(lang, s.sub)} />;
}
