"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import CaregiverCard from "./CaregiverCard";
import { CallLink, RequestButton } from "./Actions";
import { useCareLocation } from "@/lib/client/care";
import { makeT } from "@/lib/client/text";
import { districtByName } from "@/lib/doctors";
import { href } from "@/lib/i18n";
import site from "@/site.config";

/**
 * The caregivers on the care home. Starts with the all-Bangladesh list (so the
 * page is complete for Google), then switches to the visitor's remembered district.
 */
export default function FeaturedArea({ lang, initial }) {
  const tc = makeT(lang);
  const [loc] = useCareLocation();
  const [data, setData] = useState(initial);
  const district = loc?.district || "";

  useEffect(() => {
    if (loc === null) return;
    if (!district) { setData(initial); return; }
    let live = true;
    fetch(`${site.apiUrl}/api/care/home?district=${encodeURIComponent(district)}`)
      .then((r) => (r.ok ? r.json() : null)).then((d) => { if (live && d) setData(d); }).catch(() => {});
    return () => { live = false; };
  }, [district, loc === null]); // eslint-disable-line react-hooks/exhaustive-deps

  const d = districtByName(district);
  const seeAll = href(lang, d ? `/caregiver/in/${d.slug}` : "/caregiver/in");
  const list = data?.caregivers || [];
  return (
    <section>
      <div className="cg-sechead">
        <h2 className="section-title" style={{ margin: 0 }}>{district ? tc("careInYourArea") : tc("careOurCaregivers")}</h2>
        {data?.total > 0 && <Link href={seeAll} className="cg-seeall">{tc("careSeeAll")}<CIcon name="chevron-forward" size={14} /></Link>}
      </div>
      {list.length === 0 ? (
        <div className="cg-panel cg-empty">
          <CIcon name="people-circle-outline" size={44} color="var(--primary)" />
          <h3>{tc("careNoneInArea")}</h3>
          <p>{tc("careNoneInAreaSub")}</p>
          <div className="cg-empty-actions">
            <CallLink className="cg-smallbtn"><CIcon name="call" size={16} />{tc("careCallUs")}</CallLink>
            <RequestButton target={{}} className="cg-smallbtn outline"><CIcon name="create-outline" size={16} />{tc("careSendRequest")}</RequestButton>
          </div>
        </div>
      ) : (
        <div className="cg-cards">{list.slice(0, 3).map((c) => <CaregiverCard key={c.code} caregiver={c} lang={lang} tx={tc} />)}</div>
      )}
      {data?.total > 3 && (
        <Link href={seeAll} className="cg-seeall-btn press">{tc("careSeeAllCount").replace("{n}", data.total)}<CIcon name="arrow-forward" size={16} /></Link>
      )}
    </section>
  );
}
