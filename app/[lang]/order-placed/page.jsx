import { Suspense } from "react";
import OrderPlaced from "@/components/order/OrderPlaced";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/order-placed", title: t(lang, "orderPlacedTitle"), description: t(lang, "orderPlacedMsg"), noindex: true });
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <Suspense fallback={null}><OrderPlaced lang={lang} /></Suspense>;
}
