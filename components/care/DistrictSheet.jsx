"use client";
import { useEffect, useState } from "react";
import CIcon from "@/components/CIcon";
import Sheet from "@/components/doctors/Sheet";
import { ALL_DISTRICTS } from "@/lib/doctors";
import { makeT } from "@/lib/client/text";

/** "Where is care needed?" — the app's district picker, searchable, all 64 districts. */
export default function DistrictSheet({ open, onClose, lang, value, onSelect }) {
  const tc = makeT(lang);
  const bn = lang === "bn";
  const [q, setQ] = useState("");
  useEffect(() => { if (!open) setQ(""); }, [open]);
  const needle = q.trim().toLowerCase();
  const shown = needle ? ALL_DISTRICTS.filter((d) => d.bn.includes(q.trim()) || d.name.toLowerCase().includes(needle) || d.divisionBn.includes(q.trim())) : ALL_DISTRICTS;
  return (
    <Sheet open={open} onClose={onClose} label={tc("careChooseDistrict")}>
      <h2>{tc("careChooseDistrict")}</h2>
      <label className="sheet-search">
        <CIcon name="search" size={17} color="var(--text-muted)" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tc("docSearchDistrict")} aria-label={tc("docSearchDistrict")} />
      </label>
      <div className="sheet-scroll">
        {!needle && (
          <button type="button" className={`opt-row ${!value ? "on" : ""}`} onClick={() => onSelect(null)}>
            <span style={{ flex: 1 }}><strong>{tc("careAllBangladesh")}</strong></span>
            {!value && <CIcon name="checkmark-circle" size={20} color="var(--primary)" />}
          </button>
        )}
        {shown.map((d) => (
          <button key={d.slug} type="button" className={`opt-row ${value === d.name ? "on" : ""}`} onClick={() => onSelect(d)}>
            <span style={{ flex: 1 }}><strong>{bn ? d.bn : d.name}</strong><small>{bn ? d.divisionBn : d.division}</small></span>
            {value === d.name && <CIcon name="checkmark-circle" size={20} color="var(--primary)" />}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
