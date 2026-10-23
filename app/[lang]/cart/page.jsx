import Screen from "@/components/Screen";
import EmptyState from "@/components/EmptyState";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/cart", title: t(lang, "cartTitle"), description: t(lang, "emptyCartSub"), noindex: true });
}

// The medicine cart arrives with the medicine phase; until then it is the app's empty cart.
export default async function Cart({ params }) {
  const { lang } = await params;
  return (
    <Screen title={t(lang, "cartTitle")}>
      <EmptyState icon="cart-outline" title={t(lang, "emptyCart")} sub={t(lang, "emptyCartSub")}
        action={t(lang, "wantMedicine")} actionHref={href(lang, "/medicine")} />
    </Screen>
  );
}
