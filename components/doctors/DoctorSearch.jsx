"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import DoctorCard from "./DoctorCard";
import { href } from "@/lib/i18n";
import { specialtyName } from "@/lib/doctors";

/**
 * DoctorHome's search box: understands symptoms ("migraine" → Neurology)
 * and doctor names. While searching, results replace the specialty list
 * (the `children`), just like the app.
 */
export default function DoctorSearch({ api, lang, L, children }) {
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
        const r = await fetch(`${api}/api/doctors/search?q=${encodeURIComponent(term)}`, { signal: ctl.signal });
        setRes(r.ok ? await r.json() : { specialties: [], doctors: [] });
      } catch (e) { if (e.name !== "AbortError") setRes({ specialties: [], doctors: [] }); }
      finally { setBusy(false); }
    }, 350);
    return () => { clearTimeout(h); ctl.abort(); };
  }, [term, api]);

  const searching = term.length >= 2;
  return (
    <>
      <div className="searchbar" role="search">
        <CIcon name="search" size={20} color="var(--text-muted)" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.docSearchPlaceholder} aria-label={L.docSearchPlaceholder} enterKeyHint="search" />
        {busy ? <span className="spinner" aria-hidden /> : q && (
          <button type="button" className="icon-btn" onClick={() => setQ("")} aria-label={L.close}><CIcon name="close-circle" size={19} /></button>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        {!searching ? children : !res ? (
          [1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 90, marginBottom: 16 }} />)
        ) : res.specialties.length === 0 && res.doctors.length === 0 ? (
          <div className="empty">
            <span className="icircle tone-muted" style={{ width: 72, height: 72 }}><CIcon name="search-outline" size={32} /></span>
            <h2>{L.docNoResults}</h2>
            <p>{L.docNoResultsSub}</p>
          </div>
        ) : (
          <div aria-live="polite">
            {res.specialties.length > 0 && (
              <>
                <h2 className="section-title">{L.docMatchingSpecialties}</h2>
                <div className="chips">
                  {res.specialties.map((s) => (
                    <Link key={s._id} href={href(lang, `/doctors/${s.slug}`)} className="chip press">
                      {specialtyName(s, lang)}<CIcon name="chevron-forward" size={14} />
                    </Link>
                  ))}
                </div>
              </>
            )}
            {res.doctors.length > 0 && (
              <>
                <h2 className="section-title" style={{ marginTop: 24 }}>{L.docMatchingDoctors}</h2>
                <div className="dcards">
                  {res.doctors.map((d) => <DoctorCard key={d._id} doctor={d} lang={lang} L={L} showSpecialty />)}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
