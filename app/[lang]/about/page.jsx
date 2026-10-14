import ProsePage from "@/components/ProsePage";
import { legal } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const d = legal(lang, "about");
  return pageMeta({ lang, path: "/about", title: d.title, description: d.description });
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <ProsePage lang={lang} doc={legal(lang, "about")} showUpdated={false} />;
}
