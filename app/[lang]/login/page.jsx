import { Suspense } from "react";
import LoginFlow from "@/components/auth/LoginFlow";
import Screen from "@/components/Screen";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({ lang, path: "/login", title: t(lang, "authLoginTitle"), description: t(lang, "authPhoneSub"), noindex: true });
}

export default async function Login({ params }) {
  const { lang } = await params;
  return (
    <Screen title={t(lang, "authLoginTitle")} back={href(lang, "/")} backLabel={t(lang, "tabHome")} deskTitle={false} titleAs="p">
      <Suspense fallback={null}><LoginFlow lang={lang} /></Suspense>
    </Screen>
  );
}
