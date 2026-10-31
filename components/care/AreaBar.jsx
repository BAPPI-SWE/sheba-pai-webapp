"use client";
import { useState } from "react";
import CIcon from "@/components/CIcon";
import DistrictSheet from "./DistrictSheet";
import { useCareLocation } from "@/lib/client/care";
import { makeT } from "@/lib/client/text";
import { placeLabel } from "@/lib/doctors";

/** "Where is care needed?" pill on the caregiver home — the choice is remembered, like the app. */
export default function AreaBar({ lang }) {
  const tc = makeT(lang);
  const [loc, setLoc] = useCareLocation();
  const [open, setOpen] = useState(false);
  const label = loc?.district ? placeLabel(loc.district, lang) : tc("careAllBangladesh");
  return (
    <>
      <button type="button" className="cg-area press" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="cg-area-ico"><CIcon name="location" size={16} color="var(--primary)" /></span>
        <span className="cg-area-text"><small>{tc("careWhereNeeded")}</small><b>{label}</b></span>
        <CIcon name="chevron-down" size={18} color="var(--text-muted)" />
      </button>
      <DistrictSheet open={open} onClose={() => setOpen(false)} lang={lang} value={loc?.district}
        onSelect={(d) => { setLoc(d ? { division: d.division, district: d.name } : { division: "", district: "" }); setOpen(false); }} />
    </>
  );
}
