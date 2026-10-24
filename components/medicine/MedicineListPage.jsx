import Screen from "@/components/Screen";
import EmptyState from "@/components/EmptyState";
import { MedicineTile } from "./MedicineCards";
import MedicineLoadMore from "./MedicineLoadMore";
import CartBar, { HeaderCart } from "./CartBar";
import { getJSON } from "@/lib/api";
import { href } from "@/lib/i18n";
import { t } from "@/lib/appText";

/** PharmacyListScreen: a 2-column grid (more on desktop) with the item count and a cart shortcut. */
export default async function MedicineListPage({ lang, title, query, crumbs, intro }) {
  const data = await getJSON(`/api/medicines?${new URLSearchParams({ ...query, page: "1", limit: "20" })}`, { fallback: { medicines: [], total: 0, hasMore: false } });
  const list = data.medicines || [];
  return (
    <Screen title={title} sub={data.total > 0 ? `${data.total} ${t(lang, "productsCount")}` : undefined}
      back={href(lang, "/medicine")} backLabel={t(lang, "wantMedicine")} crumbs={crumbs}
      right={<HeaderCart lang={lang} label={t(lang, "cartTitle")} />}>
      {intro}
      {list.length === 0 ? (
        <EmptyState icon="file-tray-outline" tone="muted" title={t(lang, "noMedicinesFound")} />
      ) : (
        <>
          <div className="mtiles">{list.map((m) => <MedicineTile key={m._id} medicine={m} lang={lang} />)}</div>
          {data.hasMore && <MedicineLoadMore query={query} lang={lang} />}
        </>
      )}
      <CartBar lang={lang} />
    </Screen>
  );
}
