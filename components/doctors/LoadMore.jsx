"use client";
import { useState } from "react";
import DoctorCard from "./DoctorCard";

/** "Show more" — fetches the next 20 doctors straight from the backend. */
export default function LoadMore({ api, query, startPage = 1, lang, L, label, loadingLabel }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(startPage);
  const [more, setMore] = useState(true);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function next() {
    setBusy(true); setFailed(false);
    try {
      const qs = new URLSearchParams({ ...query, page: String(page + 1), limit: "20" });
      const res = await fetch(`${api}/api/doctors?${qs}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems((p) => [...p, ...data.doctors]);
      setPage(page + 1);
      setMore(data.hasMore);
    } catch { setFailed(true); } finally { setBusy(false); }
  }

  return (
    <>
      {items.length > 0 && (
        <div className="dcards" style={{ marginTop: 16 }}>
          {items.map((d) => <DoctorCard key={d._id} doctor={d} lang={lang} L={L} />)}
        </div>
      )}
      {more && (
        <button type="button" className="btn btn-outline btn-block" style={{ marginTop: 16, color: "var(--helper)", borderColor: "var(--helper-soft)" }} onClick={next} disabled={busy}>
          {busy ? loadingLabel : failed ? `${label} ↻` : label}
        </button>
      )}
    </>
  );
}
