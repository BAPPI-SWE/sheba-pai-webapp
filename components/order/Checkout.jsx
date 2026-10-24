"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import Field from "@/components/ui/Field";
import Sheet from "@/components/doctors/Sheet";
import site from "@/site.config";
import { useCart } from "@/lib/client/cart";
import { useSession } from "@/lib/client/session";
import { apiFetch, getPublicSettings, normalizePhone, whatsAppUrl } from "@/lib/client/api";
import { shrinkImage } from "@/lib/client/image";
import { makeT } from "@/lib/client/text";
import { ALL_DISTRICTS } from "@/lib/doctors";

/**
 * FormCheckoutScreen on the web: name, phone, district, thana, address,
 * inside / outside Dhaka (decides the fee), note, prescription photo, cash
 * on delivery. The server checks every rule again — this only catches
 * mistakes early and kindly.
 */
export default function Checkout({ lang }) {
  const tc = makeT(lang);
  const router = useRouter();
  const session = useSession();
  const { items, ready, subtotal, needsPrescription, clearCart } = useCart();
  const pre = lang === "en" ? "/en" : "";

  const [settings, setSettings] = useState(null);
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState(""); const [thana, setThana] = useState("");
  const [address, setAddress] = useState(""); const [zone, setZone] = useState(null); const [note, setNote] = useState("");
  const [rx, setRx] = useState(null); const [rxUrl, setRxUrl] = useState(null);
  const [picker, setPicker] = useState(false); const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState(false); const [placing, setPlacing] = useState(false); const [failure, setFailure] = useState(null);
  const fileRef = useRef(null);
  const placed = useRef(false);

  // Must be signed in, and the cart must have something.
  useEffect(() => {
    if (!session.ready || placed.current) return;
    if (!session.loggedIn) router.replace(`${pre}/login?next=${encodeURIComponent(`${pre}/checkout`)}`);
  }, [session.ready, session.loggedIn]); // eslint-disable-line
  useEffect(() => { if (ready && !items.length && !placed.current) router.replace(`${pre}/cart`); }, [ready, items.length]); // eslint-disable-line

  useEffect(() => { getPublicSettings().then(setSettings); }, []);
  useEffect(() => {
    if (!session.loggedIn) return;
    apiFetch("/api/me").then((r) => { if (r.ok) { setName((p) => p || (r.data.isDeleted ? "" : r.data.name || "")); setPhone((p) => p || r.data.phone || ""); } });
  }, [session.loggedIn]);
  useEffect(() => () => { if (rxUrl) URL.revokeObjectURL(rxUrl); }, [rxUrl]);

  const feeIn = Number(settings?.courierFeeInsideDhaka ?? 0), feeOut = Number(settings?.courierFeeOutsideDhaka ?? 0);
  const insideAllowed = !district || district === "Dhaka";
  const fee = zone === "inside" ? feeIn : zone === "outside" ? feeOut : null;
  const total = Math.round((subtotal + (fee || 0)) * 100) / 100;
  const dName = (d) => (lang === "bn" ? d.bn : d.name);
  const districtObj = ALL_DISTRICTS.find((d) => d.name === district);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    const f = n ? ALL_DISTRICTS.filter((d) => d.name.toLowerCase().includes(n) || d.bn.includes(q.trim())) : ALL_DISTRICTS;
    return [...f].sort((a, b) => (a.name === "Dhaka" ? -1 : b.name === "Dhaka" ? 1 : a.name.localeCompare(b.name)));
  }, [q]);

  const errors = {};
  if (name.trim().length < 2) errors.name = tc("fcErrName");
  if (!normalizePhone(phone)) errors.phone = tc("fcErrPhone");
  if (!district) errors.district = tc("fcErrDistrict");
  if (!thana.trim()) errors.thana = tc("fcErrThana");
  if (address.trim().length < 5) errors.address = tc("fcErrAddress");
  if (!zone) errors.zone = tc("fcErrZone");
  if (needsPrescription && !rx) errors.rx = tc("fcErrRx");
  const show = (k) => (submitted ? errors[k] : undefined);

  function chooseDistrict(d) { setDistrict(d.name); setZone((z) => (d.name === "Dhaka" ? z || "inside" : "outside")); setPicker(false); setQ(""); }
  async function pickFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 15 * 1024 * 1024) { setFailure(tc("webFileTooBig")); return; }
    const small = await shrinkImage(f);
    if (rxUrl) URL.revokeObjectURL(rxUrl);
    setRx(small); setRxUrl(URL.createObjectURL(small));
  }

  async function placeOrder() {
    setSubmitted(true); setFailure(null);
    if (Object.keys(errors).length) {
      document.querySelector(".field.err, .select-box.err, .zone-err, .rx-box.err")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPlacing(true);
    try {
      const fd = new FormData();
      fd.append("items", JSON.stringify(items.map((i) => ({ medicineId: i.medicine._id, quantity: i.quantity }))));
      fd.append("recipientName", name.trim()); fd.append("contactPhone", normalizePhone(phone));
      fd.append("district", district); fd.append("thana", thana.trim()); fd.append("address", address.trim());
      fd.append("deliveryZone", zone); if (note.trim()) fd.append("deliveryNote", note.trim());
      if (rx) fd.append("prescription", rx, rx.name || "prescription.jpg");
      const r = await apiFetch("/api/orders", { method: "POST", form: fd });
      if (!r.ok) { setFailure(r.status === 401 ? tc("activityGuestTitle") : r.data?.error || tc("failed")); return; }
      placed.current = true;
      clearCart();
      router.replace(`${pre}/order-placed?${new URLSearchParams({ id: r.data._id, no: r.data.orderNo || "", at: r.data.createdAt || "" })}`);
    } catch { setFailure(tc("connectionFailed")); } finally { setPlacing(false); }
  }

  if (!session.ready || !ready || !settings) return <div className="skel" style={{ height: 300 }} />;

  if (settings.orderMode === "smart") {
    const wa = whatsAppUrl(settings.supportWhatsAppNumber || site.whatsapp, items.map((i) => `${i.medicine.brandName} ${i.medicine.strength || ""} × ${i.quantity}`).join("\n"));
    return (
      <div className="empty">
        <span className="icircle tone-primary" style={{ width: 72, height: 72 }}><CIcon name="location-outline" size={32} /></span>
        <p style={{ maxWidth: 360 }}>{tc("webSmartUnsupported")}</p>
        <a href={`tel:${settings.emergencyContactNumber || site.phone}`} className="btn-app" style={{ marginTop: 20, maxWidth: 320 }}><CIcon name="call" size={18} />{tc("callForOrder")}</a>
        {wa && <a href={wa} className="btn-app success" style={{ marginTop: 10, maxWidth: 320 }} target="_blank" rel="noopener"><CIcon name="logo-whatsapp" size={18} />{tc("orderOnWhatsApp")}</a>}
      </div>
    );
  }

  return (
    <form className="checkout" onSubmit={(e) => { e.preventDefault(); placeOrder(); }} noValidate>
      <div>
        <h2 className="section-title" style={{ marginBottom: 8 }}>{tc("fcDeliveryDetails")}</h2>
        <Field label={tc("fullName")} value={name} onChange={setName} placeholder={tc("fullNameHint")} autoComplete="name" error={show("name")} />
        <Field label={tc("contactPhoneLabel")} value={phone} onChange={setPhone} placeholder="01XXXXXXXXX" type="tel" inputMode="tel" autoComplete="tel" error={show("phone")} />

        <div className="field">
          <span className="field-label">{tc("fcDistrict")}</span>
          <button type="button" className={`select-box ${show("district") ? "err" : ""}`} onClick={() => setPicker(true)} aria-haspopup="dialog">
            <CIcon name="location-outline" size={18} color="var(--primary)" />
            <span className={district ? "" : "ph"}>{districtObj ? dName(districtObj) : tc("fcChooseDistrict")}</span>
            <CIcon name="chevron-down" size={18} color="var(--text-muted)" />
          </button>
          {show("district") && <p className="field-error">{show("district")}</p>}
        </div>

        <Field label={tc("fcThana")} value={thana} onChange={setThana} placeholder={tc("fcThanaHint")} error={show("thana")} />
        <Field label={tc("fcAddress")} value={address} onChange={setAddress} placeholder={tc("fcAddressHint")} multiline maxLength={250} autoComplete="street-address" error={show("address")} />

        <h2 className="section-title" style={{ marginBottom: 8 }}>{tc("fcDeliveryArea")}</h2>
        <div role="radiogroup" aria-label={tc("fcDeliveryArea")} className={show("zone") ? "zone-err" : ""}>
          <Zone on={zone === "inside"} disabled={!insideAllowed} title={tc("fcInsideDhaka")} fee={feeIn} note={!insideAllowed ? tc("fcInsideDisabledNote") : null} onClick={() => insideAllowed && setZone("inside")} />
          <Zone on={zone === "outside"} title={tc("fcOutsideDhaka")} fee={feeOut} onClick={() => setZone("outside")} />
        </div>
        {show("zone") && <p className="field-error">{show("zone")}</p>}

        <div style={{ marginTop: 24 }}>
          <Field label={tc("fcNote")} value={note} onChange={setNote} placeholder={tc("fcNoteHint")} multiline maxLength={300} />
        </div>

        {needsPrescription && (
          <div style={{ marginBottom: 24 }}>
            <h2 className="section-title" style={{ marginBottom: 4 }}>{tc("prescriptionUpload")}</h2>
            <p className="field-hint" style={{ marginBottom: 8, marginTop: 0 }}>{tc("prescriptionUploadHint")}</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} hidden />
            {rxUrl ? (
              <button type="button" className="rx-thumb" onClick={() => fileRef.current?.click()} aria-label={tc("webChangePhoto")}>
                <img src={rxUrl} alt={tc("prescriptionUpload")} /><span>{tc("webChangePhoto")}</span>
              </button>
            ) : (
              <button type="button" className={`rx-box ${show("rx") ? "err" : ""}`} onClick={() => fileRef.current?.click()}>
                <CIcon name="camera-outline" size={22} />{tc("uploadPrescription")}
              </button>
            )}
            {show("rx") && <p className="field-error">{show("rx")}</p>}
          </div>
        )}

        <h2 className="section-title" style={{ marginBottom: 8 }}>{tc("paymentMethodLabel")}</h2>
        <div className="pay-box"><span className="icircle tone-success" style={{ width: 36, height: 36 }}><CIcon name="cash-outline" size={17} /></span><b>{tc("cashOnDelivery")}</b></div>
      </div>

      <div className="checkout-side">
        <div className="sum-card">
          <h2 className="section-title" style={{ marginBottom: 8 }}>{tc("fcOrderItems")}</h2>
          {items.map((i) => (
            <div key={i.medicine._id} className="sum-row item"><span>{i.medicine.brandName}{i.medicine.strength ? ` ${i.medicine.strength}` : ""} × {i.quantity}</span><b>৳{Math.round(i.medicine.price * i.quantity * 100) / 100}</b></div>
          ))}
          <hr />
          <div className="sum-row"><span>{tc("subtotalLabel")}</span><b>৳{subtotal}</b></div>
          <div className="sum-row"><span>{tc("deliveryFeeLabel")}</span>{fee != null ? <b>৳{fee}</b> : <i>{tc("fcSelectAreaFirst")}</i>}</div>
          <div className="sum-row total"><span>{tc("totalLabel")}</span><b>৳{total}</b></div>
        </div>
        {(failure || (submitted && Object.keys(errors).length > 0)) && <p className="form-fail" role="alert">{failure || tc("fcCheckFields")}</p>}
        <button className="btn-app" disabled={placing} style={{ marginTop: 16 }}><CIcon name="checkmark-circle-outline" size={19} />{placing ? tc("placingOrder") : tc("placeOrder")}</button>
        <p className="small-note">{tc("fcConfirmNote")}</p>
        <p className="consent">{tc("legalConsentPrefix")} <Link href={`${pre}/terms`}>{tc("legalTerms")}</Link> {tc("legalAnd")} <Link href={`${pre}/privacy`}>{tc("legalPrivacy")}</Link>{tc("legalSuffix")}</p>
      </div>

      <Sheet open={picker} onClose={() => setPicker(false)} label={tc("fcChooseDistrict")}>
        <h2>{tc("fcChooseDistrict")}</h2>
        <label className="sheet-search"><CIcon name="search" size={17} color="var(--text-muted)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tc("docSearchDistrict")} aria-label={tc("docSearchDistrict")} autoFocus />
        </label>
        <div className="sheet-scroll">
          {list.map((d) => (
            <button key={d.name} type="button" className={`opt-row ${d.name === district ? "on" : ""}`} onClick={() => chooseDistrict(d)}>
              <span style={{ flex: 1 }}><strong style={d.name === district ? { color: "var(--primary)" } : undefined}>{dName(d)}</strong><small>{lang === "bn" ? d.divisionBn : d.division}</small></span>
              {d.name === district && <CIcon name="checkmark-circle" size={20} color="var(--primary)" />}
            </button>
          ))}
        </div>
      </Sheet>
    </form>
  );
}

function Zone({ on, disabled, title, fee, note, onClick }) {
  return (
    <button type="button" role="radio" aria-checked={on} aria-disabled={disabled || undefined} className={`zone ${on ? "on" : ""} ${disabled ? "dis" : ""}`} onClick={onClick}>
      <CIcon name={on ? "radio-button-on" : "radio-button-off"} size={22} color={on ? "var(--primary)" : "var(--border-strong)"} />
      <span style={{ flex: 1, textAlign: "left" }}><strong>{title}</strong>{note && <small>{note}</small>}</span>
      <b style={on ? { color: "var(--primary)" } : undefined}>৳{fee}</b>
    </button>
  );
}
