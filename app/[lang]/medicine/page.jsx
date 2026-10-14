import SoonPage from "@/components/SoonPage";
import { dict } from "@/lib/dict";
import { pageMeta } from "@/lib/seo";

// Phase 1 placeholder — replaced by the full section in a later phase.
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const s = dict(lang).svc.medicine;
  return pageMeta({ lang, path: "/medicine", title: s.t, description: s.d });
}

export default async function Page({ params }) {
  const { lang } = await params;
  const s = dict(lang).svc.medicine;
  return <SoonPage lang={lang} name={s.t} img="medicine" body={s.d} />;
}
