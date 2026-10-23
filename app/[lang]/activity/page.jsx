import Screen from "@/components/Screen";
import EmptyState from "@/components/EmptyState";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/activity", title: t(lang, "tabActivity"), description: t(lang, "activityGuestSub"), noindex: true });
}

// Orders and bookings appear here once signing in on the website is ready (account phase).
export default async function Activity({ params }) {
  const { lang } = await params;
  return (
    <Screen title={t(lang, "tabActivity")}>
      <EmptyState icon="receipt-outline" title={t(lang, "activityGuestTitle")} sub={t(lang, "activityGuestSub")}
        action={t(lang, "tabProfile")} actionHref={href(lang, "/account")} />
    </Screen>
  );
}
