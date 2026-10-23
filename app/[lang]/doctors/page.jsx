import Link from "next/link";
import Icon from "@/components/Icon";
import Screen from "@/components/Screen";
import EmptyState from "@/components/EmptyState";
import DoctorSearch from "@/components/doctors/DoctorSearch";
import site from "@/site.config";
import { getJSON } from "@/lib/api";
import { href, digits } from "@/lib/i18n";
import { dict } from "@/lib/dict";
import { t, pick } from "@/lib/appText";
import { DOCTOR_KEYS, specialtyName } from "@/lib/doctors";
import { pageMeta, JsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta({
    lang, path: "/doctors",
    title: lang === "bn" ? "ডাক্তার খুঁজুন — বিশেষজ্ঞ ডাক্তার, চেম্বার, ফি ও সিরিয়াল নম্বর" : "Find a doctor — specialists, chambers, fees and serial numbers",
    description: lang === "bn"
      ? "বিভাগ ও জেলা অনুযায়ী বাংলাদেশের বিশেষজ্ঞ ডাক্তারের চেম্বারের ঠিকানা, সময়সূচি, ভিজিট ফি আর সিরিয়ালের ফোন নম্বর। রোগের নাম লিখেও খুঁজতে পারেন।"
      : "Specialist doctors across Bangladesh by specialty and district — chamber address, schedule, consultation fee and serial phone numbers. Search by symptom too.",
  });
}

/** DoctorHomeScreen: search box + the list of specialties. */
export default async function DoctorHome({ params }) {
  const { lang } = await params;
  const d = dict(lang);
  const specialties = await getJSON("/api/specialties", { fallback: [] });
  const list = Array.isArray(specialties) ? specialties : [];
  const L = { ...pick(lang, DOCTOR_KEYS), close: d.close };

  const ld = {
    "@context": "https://schema.org", "@type": "ItemList",
    itemListElement: list.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: specialtyName(s, lang), url: `${site.url}${href(lang, `/doctors/${s.slug}`)}` })),
  };

  return (
    <Screen title={t(lang, "wantDoctor")} back={href(lang, "/")} backLabel={d.backHome}
      crumbs={[{ href: href(lang, "/"), label: t(lang, "tabHome") }, { href: href(lang, "/doctors"), label: t(lang, "wantDoctor") }]}>
      <p className="hero-sub" style={{ marginBottom: 16 }}>{t(lang, "docHowSub")}</p>
      <DoctorSearch api={site.apiUrl} lang={lang} L={L}>
        <h2 className="section-title">{t(lang, "docSpecialtiesTitle")}</h2>
        {list.length === 0 ? (
          <EmptyState icon="medkit-outline" tone="muted" title={t(lang, "docNoSpecialties")} />
        ) : (
          <ul className="glist two">
            {list.map((s) => {
              const desc = lang === "bn" ? s.descriptionBangla || s.description : s.description;
              return (
                <li key={s._id}>
                  <Link href={href(lang, `/doctors/${s.slug}`)} className="grow">
                    {s.imageUrl ? (
                      <span className="icircle tone-helper" style={{ width: 44, height: 44 }}><img src={s.imageUrl} alt="" width={36} height={36} loading="lazy" /></span>
                    ) : (
                      <span className={`icircle tone-${s.tone || "helper"}`} style={{ width: 44, height: 44 }}><Icon name={s.icon || "medkit"} size={20} /></span>
                    )}
                    <span className="grow-main">
                      <span className="grow-title">{specialtyName(s, lang)}</span>
                      {!!desc && <span className="grow-sub">{desc}</span>}
                    </span>
                    {s.doctorCount > 0 && <span className="count-pill">{s.doctorCount}</span>}
                    <Icon name="chevron-forward" size={18} className="grow-chev" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </DoctorSearch>
      <JsonLd data={ld} />
    </Screen>
  );
}
