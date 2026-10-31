"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import Sheet from "@/components/doctors/Sheet";
import Field from "@/components/ui/Field";
import { apiFetch, normalizePhone } from "@/lib/client/api";
import { useSession } from "@/lib/client/session";
import { makeT } from "@/lib/client/text";
import { REQUEST_EVT, useCareContact } from "@/lib/client/care";
import { careIcon, formatTaka, offerName } from "@/lib/care";

const CONTACT_KEY = "careContact"; // remembered for guests, so the next request is one tap
// tc-keys: offerUnit_day offerUnit_month offerUnit_shift12 offerUnit_visit

/**
 * One-tap booking (CareQuickRequest): a family taps a service, a package or a
 * caregiver, gives a name and a phone number — that is all. The Sheba Pai team
 * calls back, agrees the details and assigns a caregiver. No login needed.
 * Mounted once for all caregiver pages; any button opens it with openCareRequest().
 */
export default function RequestHost({ lang }) {
  const tc = makeT(lang);
  const session = useSession();
  const { phone } = useCareContact();
  const [target, setTarget] = useState(null);
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [fail, setFail] = useState("");
  const [done, setDone] = useState(null);
  const pre = lang === "en" ? "/en" : "";

  useEffect(() => {
    const open = (e) => { setTarget(e.detail || {}); setSubmitted(false); setDone(null); setFail(""); };
    window.addEventListener(REQUEST_EVT, open);
    return () => window.removeEventListener(REQUEST_EVT, open);
  }, []);

  // Fill in what we already know: the account, or what the guest typed last time.
  useEffect(() => {
    if (!target) return;
    try {
      const saved = JSON.parse(localStorage.getItem(CONTACT_KEY) || "null");
      if (saved) { setName((v) => v || saved.name || ""); setTel((v) => v || saved.phone || ""); }
    } catch {}
    if (session.loggedIn) {
      apiFetch("/api/me").then((r) => { if (r.ok) { setName((v) => v || r.data.name || ""); setTel((v) => v || r.data.phone || ""); } }).catch(() => {});
    }
  }, [target, session.loggedIn]);

  const errors = {};
  if (name.trim().length < 2) errors.name = tc("fcErrName");
  if (!normalizePhone(tel)) errors.phone = tc("fcErrPhone");
  const show = (k) => (submitted ? errors[k] : undefined);

  async function send() {
    setSubmitted(true); setFail("");
    if (Object.keys(errors).length) return;
    setSending(true);
    let district;
    try { const l = JSON.parse(localStorage.getItem("careLocation") || localStorage.getItem("doctorLocation") || "null"); district = l?.district || undefined; } catch {}
    const r = await apiFetch("/api/care/quick-request", {
      method: "POST",
      body: { contactName: name.trim(), contactPhone: normalizePhone(tel), offerId: target?.offer?._id, caregiverCode: target?.caregiver?.code, district },
    }).catch(() => null);
    setSending(false);
    if (!r) { setFail(tc("connectionFailed")); return; }
    if (!r.ok) { setFail(r.data?.error || tc("failed")); return; }
    try { localStorage.setItem(CONTACT_KEY, JSON.stringify({ name: name.trim(), phone: normalizePhone(tel) })); } catch {}
    setDone(r.data);
  }

  const close = () => setTarget(null);
  const offer = target?.offer, caregiver = target?.caregiver;
  const title = offer ? offerName(offer, lang) : caregiver ? caregiver.name : tc("qrGeneralTitle");
  const sub = offer
    ? (offer.price != null ? `${formatTaka(offer.price)} ${offer.priceUnit ? tc(`offerUnit_${offer.priceUnit}`) : ""}` : tc("carePriceOnCall"))
    : caregiver ? `${tc("careIdLabel")}: ${caregiver.code}` : tc("qrGeneralSub");

  return (
    <Sheet open={!!target} onClose={close} label={title}>
      {done ? (
        <div className="cg-done">
          <span className="cg-done-ico"><CIcon name="checkmark" size={34} /></span>
          <h2>{tc("careSentTitle")}</h2>
          <p>{tc("qrDoneSub")}</p>
          <div className="cg-code"><small>{tc("careBookingCode")}</small><b>{done.code}</b></div>
          <a href={`tel:${phone}`} className="btn-app" style={{ marginTop: 20 }}><CIcon name="call" size={19} />{tc("qrCallNow")}</a>
          {session.loggedIn
            ? <Link href={`${pre}/caregiver/requests/${done._id}`} className="cg-link" onClick={close}>{tc("qrSeeStatus")}</Link>
            : <button type="button" className="cg-link" onClick={close}>{tc("ok")}</button>}
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); send(); }} noValidate>
          <div className="cg-sheet-head">
            <img src={careIcon(offer ? offer.iconKey : "general")} alt="" width={52} height={52} />
            <div style={{ minWidth: 0 }}><h2>{title}</h2><p>{sub}</p></div>
          </div>
          <p className="cg-sheet-intro">{tc("qrIntro")}</p>
          {fail && <p className="form-fail" role="alert">{fail}</p>}
          <Field label={tc("qrYourName")} value={name} onChange={setName} placeholder={tc("fullNameHint")} error={show("name")} autoComplete="name" />
          <Field label={tc("contactPhoneLabel")} value={tel} onChange={setTel} placeholder="01XXXXXXXXX" type="tel" inputMode="tel" autoComplete="tel" error={show("phone")} onEnter={send} />
          <button type="submit" className="btn-app" disabled={sending}>{sending ? <span className="spinner" /> : <><CIcon name="paper-plane-outline" size={19} />{tc("careSendRequest")}</>}</button>
          <p className="cg-reassure"><CIcon name="shield-checkmark" size={15} color="var(--success)" />{tc("qrReassure")}</p>
          <a href={`tel:${phone}`} className="cg-orcall"><CIcon name="call-outline" size={16} />{tc("qrOrCall")}</a>
        </form>
      )}
    </Sheet>
  );
}
