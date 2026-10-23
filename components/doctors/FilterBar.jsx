"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import CIcon from "@/components/CIcon";
import Sheet from "./Sheet";
import { GEO, ALL_DISTRICTS, districtBySlug } from "@/lib/doctors";

const KEY = "doctorLocation"; // same idea as the app: remembered across specialties

function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } }
function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }

/**
 * Division → district filter (DoctorListScreen's filter bar). Each choice is
 * a real address (/doctors/cardiology/dhaka) so Google can index it too.
 */
export default function FilterBar({ lang, L, base, division, district }) {
  const router = useRouter();
  const [picker, setPicker] = useState(null);
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const bn = lang === "bn";

  const go = (dv, d) => {
    save({ division: dv || "", district: d || "" });
    const seg = d || (dv ? `${dv}-division` : "");
    setPicker(null);
    start(() => router.push(seg ? `${base}/${seg}` : base, { scroll: false }));
  };

  // Like the app, reopen the last area the visitor chose.
  useEffect(() => {
    if (division || district) { save({ division: division || "", district: district || "" }); return; }
    const s = load();
    if (s && (s.district || s.division)) router.replace(s.district ? `${base}/${s.district}` : `${base}/${s.division}-division`, { scroll: false });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (!picker) setQ(""); }, [picker]);

  const dv = GEO.find((x) => x.slug === division);
  const dt = districtBySlug(district);
  const districts = dv ? dv.districts : ALL_DISTRICTS;
  const needle = q.trim().toLowerCase();
  const shown = needle ? districts.filter((d) => d.bn.includes(q.trim()) || d.name.toLowerCase().includes(needle) || d.divisionBn.includes(q.trim())) : districts;

  return (
    <>
      <div className="filterbar" style={{ opacity: pending ? 0.6 : 1 }}>
        <button type="button" className={`fpill ${dv ? "on" : ""}`} onClick={() => setPicker("division")} aria-haspopup="dialog">
          <CIcon name="map-outline" size={15} /><span>{dv ? (bn ? dv.bn : dv.name) : L.docAllDivisions}</span><CIcon name="chevron-down" size={14} style={{}} />
        </button>
        <button type="button" className={`fpill ${dt ? "on" : ""}`} onClick={() => setPicker("district")} aria-haspopup="dialog">
          <CIcon name="location-outline" size={15} /><span>{dt ? (bn ? dt.bn : dt.name) : L.docAllDistricts}</span><CIcon name="chevron-down" size={14} />
        </button>
        {(dv || dt) && (
          <button type="button" className="fclear" onClick={() => go("", "")} aria-label={L.docAllDistricts}><CIcon name="close" size={16} /></button>
        )}
      </div>

      <Sheet open={picker === "division"} onClose={() => setPicker(null)} label={L.docChooseDivision}>
        <h2>{L.docChooseDivision}</h2>
        <div className="sheet-scroll" style={{ marginTop: 8 }}>
          <Opt on={!dv} label={L.docAllDivisions} onClick={() => go("", "")} />
          {GEO.map((x) => (
            <Opt key={x.slug} on={dv?.slug === x.slug} label={bn ? x.bn : x.name} sub={bn ? x.name : x.bn}
              onClick={() => go(x.slug, dt && dt.divisionSlug === x.slug ? dt.slug : "")} />
          ))}
        </div>
      </Sheet>

      <Sheet open={picker === "district"} onClose={() => setPicker(null)} label={L.docChooseDistrict}>
        <h2>{L.docChooseDistrict}</h2>
        <label className="sheet-search">
          <CIcon name="search" size={17} color="var(--text-muted)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.docSearchDistrict} aria-label={L.docSearchDistrict} />
        </label>
        <div className="sheet-scroll">
          {!needle && <Opt on={!dt} label={L.docAllDistricts} onClick={() => go(dv?.slug || "", "")} />}
          {shown.map((d) => (
            <Opt key={d.slug} on={dt?.slug === d.slug} label={bn ? d.bn : d.name} sub={bn ? d.divisionBn : d.division}
              onClick={() => go(d.divisionSlug, d.slug)} />
          ))}
        </div>
      </Sheet>
    </>
  );
}

function Opt({ on, label, sub, onClick }) {
  return (
    <button type="button" className={`opt-row ${on ? "on" : ""}`} onClick={onClick} aria-pressed={on}>
      <span style={{ flex: 1 }}><strong>{label}</strong>{sub && <small>{sub}</small>}</span>
      {on && <CIcon name="checkmark-circle" size={20} color="var(--helper)" />}
    </button>
  );
}
