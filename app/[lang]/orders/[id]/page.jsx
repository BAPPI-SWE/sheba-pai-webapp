import Screen from "@/components/Screen";
import OrderTracking from "@/components/order/OrderTracking";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  return pageMeta({ lang, path: `/orders/${id}`, title: t(lang, "orderTracking"), description: t(lang, "orderTracking"), noindex: true });
}

export default async function Page({ params }) {
  const { lang, id } = await params;
  return (
    <Screen title={t(lang, "orderTracking")} back={href(lang, "/activity")} backLabel={t(lang, "tabActivity")}>
      <div className="narrow"><OrderTracking lang={lang} id={id} /></div>
    </Screen>
  );
}
