"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CIcon from "@/components/CIcon";
import Sheet from "@/components/doctors/Sheet";
import DistrictSheet from "./DistrictSheet";
import CaregiverCard from "./CaregiverCard";
import { CallLink, RequestButton } from "./Actions";
import { makeT } from "@/lib/client/text";
import { useCareLocation } from "@/lib/client/care";
import { href } from "@/lib/i18n";
import { SHIFT_KEYS, SHIFT_ICONS, careIcon, categoryName } from "@/lib/care";
import { districtByName, placeLabel } from "@/lib/doctors";
import site from "@/site.config";

const NONE = { gender: "", tier: "", shift: "", available: false };
// tc-keys: careShift_day8 careShift_day12 careShift_night12 careShift_live24 careTier_nurse careTierFilterTrained
// cicon-keys: woman man options sunny-outline moon-outline partly-sunny-outline home-outline flash-outline

/**
 * CareListScreen: the caregivers in a district / care type, with the app's
 * filters (gender, level, shift, available now). The district and care type are
 * real addresses (/caregiver/in/dhaka/stroke-care) so Google can list them.
 */
export default function CaregiverFeed({ lang, initial, query, categories = [], catSlug = "", distSlug = "" }) {
  const tc = makeT(lang);
  const router = useRouter();
  const [, setLoc] = useCareLocation();
  const [rows, setRows] = useState(initial.caregivers);
  const [meta, setMeta] = useState({ total: initial.total, hasMore: initial.hasMore, page: 1 });
  const [filters, setFilters] = useState(NONE);
  const [draft, setDraft] = useState(NONE);
  const [sheet, setSheet] = useState(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const first = useRef(true);
  const active = ["gender", "tier", "shift"].filter((k) => filters[k]).length + (filters.available ? 1 : 0);
  const district = query.district || "";
  const bn = lang === "bn";

  async function load(page, f) {
    setBusy(true); setFailed(false);
    try {
      const p = new URLSearchParams({ page: String(page), limit: "20" });
      if (query.category) p.set("category", query.category);
      if (query.district) p.set("district", query.district);
      else if (query.division) p.set("division", query.division);
      for (const k of ["gender", "tier", "shift"]) if (f[k]) p.set(k, f[k]);
      if (f.available) p.set("available", "1");
      const r = await fetch(`${site.apiUrl}/api/care/caregivers?${p}`);
      const d = await r.json();
      if (!r.ok) throw new Error();
      setRows((prev) => (page === 1 ? d.caregivers : [...prev, ...d.caregivers]));
      setMeta({ total: d.total, hasMore: d.hasMore, page });
    } catch { setFailed(true); } finally { setBusy(false); }
  }
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    load(1, filters);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const goDistrict = (d) => {
    setLoc(d ? { division: d.division, district: d.name } : { division: "", district: "" });
    setSheet(null);
    const seg = d ? d.slug : catSlug ? "all" : "";
    router.push(href(lang, `/caregiver/in${seg ? `/${seg}` : ""}${catSlug ? `/${catSlug}` : ""}`));
  };
  const typeHref = (slug) => href(lang, `/caregiver/in${distSlug || slug ? `/${distSlug || "all"}` : ""}${slug ? `/${slug}` : ""}`);
  const areaLabel = district ? placeLabel(district, lang) : tc("careAllBangladesh");
  const narrowed = !!district || !!query.division || active > 0;

  return (
    <>
      <div className="cg-bar">
        <div className="cg-bar-row">
          <button type="button" className={`fpill ${district ? "on" : ""}`} onClick={() => setSheet("district")} aria-haspopup="dialog">
            <CIcon name="location" size={15} /><span>{areaLabel}</span><CIcon name="chevron-down" size={14} />
          </button>
          <button type="button" className={`fpill cg-filterbtn ${active ? "on" : ""}`} onClick={() => { setDraft(filters); setSheet("filters"); }} aria-haspopup="dialog">
            <CIcon name="options" size={16} /><span>{tc("careFilters")}</span>{active > 0 && <em className="cg-count">{active}</em>}
          </button>
        </div>
        {categories.length > 0 && (
          <div className="cg-typescroll">
            <Link href={typeHref("")} className={`cg-chip ${!catSlug ? "on" : ""}`}>{tc("careAllTypes")}</Link>
            {categories.map((c) => (
              <Link key={c._id} href={typeHref(c.slug)} className={`cg-chip ${catSlug === c.slug ? "on" : ""}`}>
                <img src={careIcon(c.iconKey)} alt="" width={20} height={20} />{categoryName(c, lang)}
              </Link>
            ))}
          </div>
        )}
      </div>

      {rows.length > 0 && <p className="count-text">{bn ? `${meta.total} জন কেয়ারগিভার` : `${meta.total} caregiver${meta.total === 1 ? "" : "s"}`}</p>}
      {failed && <p className="form-fail" role="alert">{tc("connectionFailed")}</p>}

      {rows.length === 0 && !busy ? (
        <div className="empty">
          <span className="icircle tone-primary" style={{ width: 72, height: 72 }}><CIcon name="people-outline" size={32} /></span>
          <h2>{narrowed ? tc("careNoMatch") : tc("careNoneYet")}</h2><p>{tc("careNoMatchSub")}</p>
          <RequestButton target={{}} className="btn-app" ><CIcon name="create-outline" size={19} />{tc("careSendRequest")}</RequestButton>
        </div>
      ) : (
        <div className="cg-cards two" style={{ opacity: busy && meta.page === 1 ? 0.5 : 1 }}>
          {rows.map((c) => <CaregiverCard key={c.code} caregiver={c} lang={lang} tx={tc} />)}
        </div>
      )}

      {meta.hasMore && (
        <button type="button" className="btn-app secondary" style={{ marginTop: 16 }} disabled={busy} onClick={() => load(meta.page + 1, filters)}>
          {busy ? tc("webLoading") : tc("webSeeMore")}
        </button>
      )}
      {rows.length > 0 && !meta.hasMore && (
        <div className="cg-panel cg-cant">
          <h3>{tc("careCantFind")}</h3><p>{tc("careCantFindSub")}</p>
          <div className="cg-empty-actions">
            <RequestButton target={{}} className="btn-app" ><CIcon name="create-outline" size={19} />{tc("careSendRequest")}</RequestButton>
            <CallLink className="cg-sqbtn" label={tc("careCallUs")}><CIcon name="call" size={20} /></CallLink>
          </div>
        </div>
      )}

      <DistrictSheet open={sheet === "district"} onClose={() => setSheet(null)} lang={lang} value={district} onSelect={goDistrict} />

      <Sheet open={sheet === "filters"} onClose={() => setSheet(null)} label={tc("careFilters")}>
        <h2>{tc("careFilters")}</h2>
        <p className="cg-flabel">{tc("careCaregiverGender")}</p>
        <Seg value={draft.gender} onChange={(v) => setDraft({ ...draft, gender: v })}
          options={[["", tc("careAny")], ["female", tc("careFemale"), "woman"], ["male", tc("careMale"), "man"]]} />
        <p className="cg-flabel">{tc("careLevel")}</p>
        <Seg value={draft.tier} onChange={(v) => setDraft({ ...draft, tier: v })}
          options={[["", tc("careAny")], ["trained", tc("careTierFilterTrained")], ["nurse", tc("careTier_nurse")]]} />
        <p className="cg-flabel">{tc("careShift")}</p>
        <div className="cg-chipwrap">
          <button type="button" className={`cg-chip ${!draft.shift ? "on" : ""}`} onClick={() => setDraft({ ...draft, shift: "" })}>{tc("careAny")}</button>
          {SHIFT_KEYS.map((k) => (
            <button key={k} type="button" className={`cg-chip ${draft.shift === k ? "on" : ""}`} onClick={() => setDraft({ ...draft, shift: k })}>
              <CIcon name={SHIFT_ICONS[k]} size={15} />{tc(`careShift_${k}`)}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <button type="button" className={`cg-chip ${draft.available ? "on" : ""}`} onClick={() => setDraft({ ...draft, available: !draft.available })}>
            <CIcon name="flash-outline" size={15} />{tc("careAvailableOnly")}
          </button>
        </div>
        <div className="cg-sheet-actions">
          <button type="button" className="cg-reset" onClick={() => setDraft(NONE)}>{tc("careReset")}</button>
          <button type="button" className="btn-app" onClick={() => { setFilters(draft); setSheet(null); }}>{tc("careShowResults")}</button>
        </div>
      </Sheet>
    </>
  );
}

function Seg({ options, value, onChange }) {
  return (
    <div className="cg-seg" role="radiogroup">
      {options.map(([k, label, icon]) => (
        <button key={k} type="button" role="radio" aria-checked={value === k} className={value === k ? "on" : ""} onClick={() => onChange(k)}>
          {icon && <CIcon name={icon} size={15} />}{label}
        </button>
      ))}
    </div>
  );
}
