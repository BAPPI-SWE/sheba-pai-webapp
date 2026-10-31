import { Suspense } from "react";
import Screen from "@/components/Screen";
import BookingView from "@/components/care/BookingView";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";
import { CARE_WEB } from "@/lib/careText";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  return pageMeta({ lang, path: `/caregiver/requests/${id}`, title: CARE_WEB[lang].requestsTitle, description: CARE_WEB[lang].description, noindex: true });
}

/** CareBookingDetailScreen — private (needs login), so it is kept out of Google. */
export default async function Request({ params }) {
  const { lang, id } = await params;
  return (
    <Screen title={CARE_WEB[lang].requestsTitle} back={href(lang, "/activity")} backLabel={t(lang, "tabActivity")}>
      <div className="narrow-wide"><Suspense fallback={<div className="skel" style={{ height: 320 }} />}><BookingView lang={lang} id={id} /></Suspense></div>
    </Screen>
  );
}
