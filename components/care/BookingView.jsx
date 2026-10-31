"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CIcon from "@/components/CIcon";
import { CaregiverAvatar, TierBadge, StatusPill, Stars } from "./bits";
import { apiFetch, getPublicSettings, whatsAppUrl } from "@/lib/client/api";
import { useSession } from "@/lib/client/session";
import { makeT } from "@/lib/client/text";
import { fmtDateTime, fmtSmart, fmtDate } from "@/lib/datetime";
import { CARE_STATUS, careIcon, formatTaka } from "@/lib/care";
import { placeLabel } from "@/lib/doctors";
import site from "@/site.config";

const STEPS = ["new", "contacted", "confirmed", "ongoing", "completed"];
// tc-keys: careStNew careStContacted careStConfirmed careStOngoing careStCompleted careStCancelled careStHint_new careStHint_contacted careStHint_confirmed careStHint_ongoing careStHint_completed careShift_day8 careShift_day12 careShift_night12 careShift_live24 offerUnit_day offerUnit_month offerUnit_shift12 offerUnit_visit careTier_nurse careTier_trained careTier_attendant
// cicon-keys: checkmark time call checkmark-circle heart ribbon close-circle time-outline call-outline checkmark-circle-outline heart-outline ribbon-outline

/** CareBookingDetailScreen: where the request is, the assigned caregiver, price, and the family's actions. */
export default function BookingView({ lang, id }) {
  const tc = makeT(lang);
  const router = useRouter();
  const justCreated = useSearchParams().get("new") === "1";
  const session = useSession();
  const [b, setB] = useState(null);
  const [state, setState] = useState("loading");
  const [settings, setSettings] = useState({});
  const [busy, setBusy] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const pre = lang === "en" ? "/en" : "";

  const load = useCallback(async () => {
    const r = await apiFetch(`/api/care/bookings/${id}`).catch(() => null);
    if (!r) { setState((s) => (s === "ok" ? s : "error")); return; }
    if (r.ok) { setB(r.data); setState("ok"); } else setState(r.status === 404 || r.status === 403 ? "missing" : "error");
  }, [id]);

  useEffect(() => {
    if (!session.ready) return;
    if (!session.loggedIn) { router.replace(`${pre}/login?next=${encodeURIComponent(`${pre}/caregiver/requests/${id}`)}`); return; }
    load(); getPublicSettings().then(setSettings);
    const onVis = () => document.visibilityState === "visible" && load();
    const t = setInterval(onVis, 30000);
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", onVis); };
  }, [session.ready, session.loggedIn, load]); // eslint-disable-line

  async function act(path, body) {
    setBusy(true); setMsg("");
    const r = await apiFetch(`/api/care/bookings/${id}/${path}`, { method: "POST", body }).catch(() => null);
    setBusy(false);
    if (!r) { setMsg(tc("connectionFailed")); return; }
    if (!r.ok) { setMsg(r.data?.error || tc("failed")); return; }
    setB(r.data);
  }
  const cancel = () => { if (window.confirm(`${tc("careCancelTitle")}\n${tc("careCancelMsg")}`)) act("cancel", {}); };

  if (state === "loading" || !session.ready) return <div className="skel" style={{ height: 320 }} />;
  if (state !== "ok") {
    return (
      <div className="empty">
        <span className="icircle tone-muted" style={{ width: 72, height: 72 }}><CIcon name={state === "missing" ? "search-outline" : "cloud-offline-outline"} size={32} /></span>
        <h2>{state === "missing" ? tc("noActivityYet") : tc("couldNotLoad")}</h2>
        <button type="button" className="btn-app" style={{ width: "auto", minWidth: 180, marginTop: 20 }} onClick={() => { setState("loading"); load(); }}>{tc("webRefresh")}</button>
      </div>
    );
  }

  const cancelled = b.status === "cancelled";
  const cur = STEPS.indexOf(b.status);
  const bn = lang === "bn";
  const label = (bn ? b.offerNameBangla || b.categoryNameBangla : b.offerName || b.categoryName)
    || (b.requestedCaregiverName ? `${tc("careYourCaregiver")}: ${b.requestedCaregiverName}` : tc("careGeneralRequest"));
  const phone = settings.careContactNumber || settings.emergencyContactNumber || site.phone;
  const wa = whatsAppUrl(settings.careWhatsAppNumber || settings.supportWhatsAppNumber || site.whatsapp, tc("careWaAboutBooking").replace("{code}", b.code));
  const whenAt = (s) => [...(b.history || [])].reverse().find((h) => h.status === s)?.at || (s === "new" ? b.createdAt : null);
  const cancelAt = whenAt("cancelled");
  const rows = [
    b.startDate && ["calendar-outline", tc("careFormWhen"), [b.planType === "regular" ? tc("carePlanRegular") : tc("carePlanShort"),
      b.durationDays ? (bn ? `${b.durationDays} দিন` : `${b.durationDays} days`) : null, `${tc("careFromDate")} ${fmtDate(b.startDate, lang, { year: false })}`].filter(Boolean).join(" · ")],
    b.startDate && ["time-outline", tc("careShift"), tc(`careShift_${b.shift}`)],
    (b.area || b.district) && ["location-outline", tc("careFormWhere"), [b.area, placeLabel(b.district, lang)].filter(Boolean).join(", ")],
    (b.patientName || b.patientAge) && ["person-outline", tc("careFormPatient"), [b.patientName, b.patientAge != null ? (bn ? `${b.patientAge} বছর` : `${b.patientAge} yrs`) : null].filter(Boolean).join(", ")],
    b.conditionNote && ["medkit-outline", tc("careCondition"), b.conditionNote],
    b.preferredGender && b.preferredGender !== "any" && ["people-outline", tc("carePreferredGender"), b.preferredGender === "female" ? tc("careFemale") : tc("careMale")],
    ["call-outline", tc("careFormContact"), `${b.contactName} · ${b.contactPhone}`],
  ].filter(Boolean);

  return (
    <div className="cg-booking">
      {justCreated && b.status === "new" && (
        <div className="cg-success"><span className="cg-done-ico"><CIcon name="checkmark" size={34} /></span><h2>{tc("careSentTitle")}</h2><p>{tc("careSentSub")}</p></div>
      )}

      <section className="cg-panel">
        <div className="cg-bhead">
          <img src={careIcon(b.category?.iconKey)} alt="" width={48} height={48} />
          <div style={{ minWidth: 0 }}>
            <h1 className="cg-btitle">{label}</h1>
            <p className="cg-bcode">{tc("careBookingCode")}: <b>{b.code}</b></p>
            <p className="cg-bsub">{tc("careRequestedAt")} {fmtDateTime(b.createdAt, lang)}</p>
            <div style={{ marginTop: 6 }}><StatusPill status={b.status} tx={tc} /></div>
          </div>
        </div>
        {cancelled ? (
          <p className="cg-cancelbox"><CIcon name="close-circle" size={18} color="var(--danger)" />
            <span>{b.cancelledBy === "patient" ? tc("careCancelledByYou") : tc("careCancelledByTeam")}{b.cancelReason ? ` — ${b.cancelReason}` : ""}{cancelAt ? ` (${fmtSmart(cancelAt, lang)})` : ""}</span></p>
        ) : (
          <ol className="cg-timeline">
            {STEPS.map((s, i) => {
              const done = i <= cur, now = i === cur, at = whenAt(s);
              return (
                <li key={s} className={`${done ? "done" : ""} ${now ? "now" : ""}`}>
                  <span className="cg-tl-dot">{done && <CIcon name={now ? CARE_STATUS[s].icon.replace("-outline", "") : "checkmark"} size={12} />}</span>
                  <div><p><b>{tc(CARE_STATUS[s].key)}</b>{done && at && <time>{fmtSmart(at, lang)}</time>}</p>{now && <small>{tc(`careStHint_${s}`)}</small>}</div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {b.caregiver && (
        <Link href={`${pre}/caregiver/profile/${b.caregiver.code}`} className="cg-panel cg-assigned press">
          <CaregiverAvatar caregiver={b.caregiver} size={56} />
          <span style={{ flex: 1, minWidth: 0 }}><small>{tc("careYourCaregiver")}</small><b>{b.caregiver.name}</b><TierBadge tier={b.caregiver.tier} tx={tc} /></span>
          <CIcon name="chevron-forward" size={20} color="var(--border-strong)" />
        </Link>
      )}

      {b.agreedPrice == null && b.offerPrice != null && (
        <div className="cg-panel cg-pricerow"><span>{tc("careServicePrice")}</span><b>{formatTaka(b.offerPrice)}<small> {b.offerPriceUnit ? tc(`offerUnit_${b.offerPriceUnit}`) : ""}</small></b></div>
      )}
      {b.agreedPrice != null && (
        <div className="cg-panel cg-pricerow"><span>{tc("careAgreedPrice")}</span><b>{formatTaka(b.agreedPrice)}{b.priceNote && <small> {b.priceNote}</small>}</b></div>
      )}

      <section className="cg-panel">
        <h2 className="cg-ptitle">{tc("careDetails")}</h2>
        {rows.map(([icon, l, v]) => (
          <div key={l} className="cg-drow"><CIcon name={icon} size={17} color="var(--primary)" /><div><small>{l}</small><p>{v}</p></div></div>
        ))}
      </section>

      {b.status === "completed" && b.caregiver && (
        <section className="cg-panel">
          <h2 className="cg-ptitle">{b.review?.stars ? tc("careYourReview") : tc("careReviewTitle")}</h2>
          {b.review?.stars ? (
            <><Stars value={b.review.stars} size={24} />{b.review.comment && <p className="muted" style={{ marginTop: 8 }}>{b.review.comment}</p>}</>
          ) : (
            <>
              <div className="cg-starpick" role="radiogroup" aria-label={tc("careReviewTitle")}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" role="radio" aria-checked={stars === i} onClick={() => setStars(i)} aria-label={`${i}`}>
                    <CIcon name={stars >= i ? "star" : "star-outline"} size={36} color="#F59E0B" />
                  </button>
                ))}
              </div>
              <textarea className="textarea" rows={3} maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={tc("careReviewHint")} />
              <button type="button" className="btn-app" style={{ marginTop: 12 }} disabled={busy}
                onClick={() => (stars ? act("review", { stars, comment: comment.trim() }) : setMsg(tc("careChooseStars")))}>{tc("careSubmitReview")}</button>
            </>
          )}
        </section>
      )}

      {msg && <p className="form-fail" role="alert">{msg}</p>}
      <div className="help-row">
        <a href={`tel:${phone}`} className="help-btn"><CIcon name="call" size={17} color="var(--primary)" />{tc("careCallUs")}</a>
        {wa && <a href={wa} className="help-btn" target="_blank" rel="noopener"><CIcon name="logo-whatsapp" size={18} color="#16A34A" />{tc("careWhatsApp")}</a>}
      </div>
      {["new", "contacted"].includes(b.status) && <button type="button" className="cancel-btn" onClick={cancel} disabled={busy}>{tc("careCancelRequest")}</button>}
      <p className="small-note">{tc("webUpdatedEvery")}</p>
    </div>
  );
}
