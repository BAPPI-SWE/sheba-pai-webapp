import Screen from "@/components/Screen";
import CartView from "@/components/order/CartView";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/cart", title: t(lang, "cartTitle"), description: t(lang, "emptyCartSub"), noindex: true });
}

export default async function Cart({ params }) {
  const { lang } = await params;
  return <Screen title={t(lang, "cartTitle")}><CartView lang={lang} /></Screen>;
}
