import Screen from "@/components/Screen";
import Checkout from "@/components/order/Checkout";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/checkout", title: t(lang, "checkoutTitle"), description: t(lang, "checkoutTitle"), noindex: true });
}

export default async function CheckoutPage({ params }) {
  const { lang } = await params;
  return <Screen title={t(lang, "checkoutTitle")} back={href(lang, "/cart")} backLabel={t(lang, "cartTitle")}><Checkout lang={lang} /></Screen>;
}
