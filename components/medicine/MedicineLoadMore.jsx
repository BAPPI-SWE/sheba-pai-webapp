"use client";
import { useState } from "react";
import { MedicineTile } from "./MedicineCards";
import site from "@/site.config";
import { makeT } from "@/lib/client/text";

/** Next 20 medicines for a listing, fetched in the browser. */
export default function MedicineLoadMore({ query, lang }) {
  const tc = makeT(lang);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [busy, setBusy] = useState(false);
  async function next() {
    setBusy(true);
    try {
      const r = await fetch(`${site.apiUrl}/api/medicines?${new URLSearchParams({ ...query, page: String(page + 1), limit: "20" })}`);
      const d = await r.json();
      setItems((p) => [...p, ...d.medicines]); setPage(page + 1); setMore(d.hasMore);
    } catch {} finally { setBusy(false); }
  }
  return (
    <>
      {items.length > 0 && <div className="mtiles" style={{ marginTop: 16 }}>{items.map((m) => <MedicineTile key={m._id} medicine={m} lang={lang} />)}</div>}
      {more && <button type="button" className="btn-app secondary" style={{ marginTop: 16 }} onClick={next} disabled={busy}>{busy ? tc("webLoading") : tc("webSeeMore")}</button>}
    </>
  );
}
