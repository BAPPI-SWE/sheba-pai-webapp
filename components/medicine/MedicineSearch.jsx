"use client";
import { useEffect, useState } from "react";
import CIcon from "@/components/CIcon";
import { MedicineRow } from "./MedicineCards";
import site from "@/site.config";
import { makeT } from "@/lib/client/text";

/**
 * PharmacyHome's search box: brand names ("নাপা", "nap…"), generic names and
 * conditions. While searching, results replace the store home (`children`).
 */
export default function MedicineSearch({ lang, children }) {
  const tc = makeT(lang);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const term = q.trim();

  useEffect(() => {
    if (term.length < 2) { setRes(null); return; }
    const ctl = new AbortController();
    const h = setTimeout(async () => {
      setBusy(true);
      try {
        const r = await fetch(`${site.apiUrl}/api/medicines/search?q=${encodeURIComponent(term)}&limit=25`, { signal: ctl.signal });
        setRes(r.ok ? (await r.json()).medicines || [] : []);
      } catch (e) { if (e.name !== "AbortError") setRes([]); }
      finally { setBusy(false); }
    }, 350);
    return () => { clearTimeout(h); ctl.abort(); };
  }, [term]);

  return (
    <>
      <div className="searchbar" role="search">
        <CIcon name="search" size={20} color="var(--text-muted)" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tc("searchMedicine")} aria-label={tc("searchMedicine")} enterKeyHint="search" />
        {busy ? <span className="spinner" style={{ borderTopColor: "var(--primary)", borderColor: "var(--primary-soft)" }} aria-hidden /> : q && (
          <button type="button" className="icon-btn" onClick={() => setQ("")} aria-label="×"><CIcon name="close-circle" size={19} /></button>
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        {term.length < 2 ? children : !res ? (
          [1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 80, marginBottom: 16 }} />)
        ) : res.length === 0 ? (
          <div className="empty">
            <span className="icircle tone-muted" style={{ width: 72, height: 72 }}><CIcon name="search-outline" size={32} /></span>
            <h2>{tc("noMedicinesFound")}</h2>
          </div>
        ) : (
          <div aria-live="polite" style={{ margin: "0 calc(var(--lg) * -1)" }}>
            <p className="results-head">{tc("showingResultsFor")} "{term}"</p>
            <div className="mrows">{res.map((m) => <MedicineRow key={m._id} medicine={m} lang={lang} />)}</div>
          </div>
        )}
      </div>
    </>
  );
}
