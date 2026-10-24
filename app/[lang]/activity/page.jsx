import Screen from "@/components/Screen";
import ActivityList from "@/components/order/ActivityList";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/activity", title: t(lang, "tabActivity"), description: t(lang, "activityGuestSub"), noindex: true });
}

export default async function Activity({ params }) {
  const { lang } = await params;
  return <Screen title={t(lang, "tabActivity")}><div className="narrow"><ActivityList lang={lang} /></div></Screen>;
}
