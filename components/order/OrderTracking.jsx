"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CIcon from "@/components/CIcon";
import site from "@/site.config";
import { apiFetch, getPublicSettings, whatsAppUrl } from "@/lib/client/api";
import { useSession } from "@/lib/client/session";
import { makeT } from "@/lib/client/text";
import { fmtDateTime, fmtSmart, orderNumber } from "@/lib/datetime";

const STEPS_LOCAL = ["pending", "rider_assigned", "picked_up", "out_for_delivery", "delivered"];
const STEPS_CENTRAL = ["pending", "confirmed", "out_for_delivery", "delivered"];
const LABEL = {
  pending: "orderStatusPending", confirmed: "orderStatusConfirmed", rider_assigned: "orderStatusRiderAssigned",
  picked_up: "orderStatusPickedUp", out_for_delivery: "orderStatusOutForDelivery", delivered: "orderStatusDelivered", cancelled: "orderStatusCancelled",
};
// tc-keys: orderStatusPending orderStatusConfirmed orderStatusRiderAssigned orderStatusPickedUp orderStatusOutForDelivery orderStatusDelivered orderStatusCancelled

/**
 * OrderTrackingScreen. The app gets live socket updates; the website checks
 * again every 30 seconds while the page is open (and when you come back to the tab).
 */
export default function OrderTracking({ lang, id }) {
  const tc = makeT(lang);
  const router = useRouter();
  const session = useSession();
  const [order, setOrder] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | missing | error
  const [settings, setSettings] = useState({});
  const [cancelling, setCancelling] = useState(false);
  const pre = lang === "en" ? "/en" : "";

  const load = useCallback(async () => {
    const r = await apiFetch(`/api/orders/${id}`).catch(() => null);
    if (!r) { setState((s) => (s === "ok" ? s : "error")); return; }
    if (r.ok) { setOrder(r.data); setState("ok"); } else setState(r.status === 404 || r.status === 403 ? "missing" : "error");
  }, [id]);

  useEffect(() => {
    if (!session.ready) return;
    if (!session.loggedIn) { router.replace(`${pre}/login?next=${encodeURIComponent(`${pre}/orders/${id}`)}`); return; }
    load();
    getPublicSettings().then(setSettings);
    const t = setInterval(() => { if (document.visibilityState === "visible") load(); }, 30000);
    const onVis = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", onVis); };
  }, [session.ready, session.loggedIn, load]); // eslint-disable-line

  async function cancel() {
    if (!window.confirm(`${tc("cancelOrderTitle")}\n${tc("cancelOrderConfirm")}`)) return;
    setCancelling(true);
    const r = await apiFetch(`/api/orders/${id}/cancel`, { method: "PATCH", body: {} }).catch(() => null);
    setCancelling(false);
    if (r?.ok) load(); else window.alert(r?.data?.error || tc("connectionFailed"));
  }

  if (state === "loading" || !session.ready) return <div className="skel" style={{ height: 320 }} />;
  if (state !== "ok") {
    return (
      <div className="empty">
        <span className="icircle tone-muted" style={{ width: 72, height: 72 }}><CIcon name={state === "missing" ? "search-outline" : "cloud-offline-outline"} size={32} /></span>
        <h2>{state === "missing" ? tc("noOrdersYet") : tc("couldNotLoad")}</h2>
        <button type="button" className="btn-app" style={{ width: "auto", minWidth: 180, marginTop: 20 }} onClick={() => { setState("loading"); load(); }}>{tc("webRefresh")}</button>
      </div>
    );
  }

  const o = order;
  const steps = o.fulfillmentType === "local" ? STEPS_LOCAL : STEPS_CENTRAL;
  const cur = o.status === "cancelled" ? -1 : steps.indexOf(o.status);
  const phone = settings.emergencyContactNumber || settings.careContactNumber || site.phone;
  const wa = whatsAppUrl(settings.supportWhatsAppNumber || settings.careWhatsAppNumber || site.whatsapp, tc("orderWaMsg", { no: orderNumber(o) }));
  const tone = o.status === "delivered" ? "success" : o.status === "cancelled" ? "danger" : "primary";

  return (
    <div className="track">
      <div className={`track-hero tone-${tone}`}>
        <span className={`icircle tone-${tone}`} style={{ width: 80, height: 80, background: "#fff" }}>
          <CIcon name={o.status === "delivered" ? "checkmark-done-circle" : o.status === "cancelled" ? "close-circle" : "cube"} size={36} />
        </span>
      </div>
      <div className="track-panel">
        <p className="track-no">{orderNumber(o)}</p>
        <h2 className="track-status">{tc(LABEL[o.status] || "orderStatusPending")}</h2>
        <p className="track-time"><CIcon name="time-outline" size={15} />{tc("orderPlacedAt")} {fmtDateTime(o.createdAt, lang)}</p>
        {o.status === "cancelled" && o.cancelReason && <p className="track-cancel">{tc("orderCancelReason")}: {o.cancelReason}</p>}
        {o.status !== "cancelled" && (
          <div className="progress" aria-hidden>{steps.map((s, i) => <span key={s} className={i <= cur ? "on" : ""} />)}</div>
        )}

        {o.fulfillmentType === "local" && o.matchedShop && <div className="info-line"><CIcon name="storefront-outline" size={18} color="var(--primary)" />{o.matchedShop.name}</div>}
        {o.fulfillmentType === "local" && o.assignedRider && <div className="info-line"><CIcon name="bicycle-outline" size={18} color="var(--accent)" />{o.assignedRider.name} · {o.assignedRider.phone}</div>}

        <h3 className="section-title sp">{tc("itemsInCart")}</h3>
        {o.items.map((it, i) => <div key={i} className="sum-row item"><span>{it.brandName} {it.strength} × {it.quantity}</span><b>৳{it.lineTotal}</b></div>)}
        <hr className="hr" />
        <div className="sum-row"><span>{tc("subtotalLabel")}</span><b>৳{o.subtotal}</b></div>
        <div className="sum-row"><span>{tc("deliveryFeeLabel")}</span><b>৳{o.deliveryFee}</b></div>
        <div className="sum-row total"><span>{tc("totalLabel")}</span><b>৳{o.total}</b></div>

        {(o.addressLine || o.address) && (
          <div className="addr-card">
            <CIcon name="location-outline" size={16} color="var(--text-muted)" />
            <div>
              {o.recipientName && <strong>{o.recipientName} · {o.contactPhone}</strong>}
              <p>{o.addressLine ? [o.addressLine, o.thana, o.district].filter(Boolean).join(", ") : o.address}</p>
            </div>
          </div>
        )}

        {o.statusHistory?.length > 0 && (
          <div className="history">
            <h3 className="section-title" style={{ marginBottom: 6 }}>{tc("orderHistory")}</h3>
            {o.statusHistory.map((h, i) => (
              <div key={i} className="h-row"><span className={i === o.statusHistory.length - 1 ? "dot on" : "dot"} /><span className="h-s">{tc(LABEL[h.status] || "orderStatusPending")}</span><span className="h-t">{fmtSmart(h.at, lang)}</span></div>
            ))}
          </div>
        )}

        <div className="help-row">
          <a href={`tel:${phone}`} className="help-btn"><CIcon name="call" size={17} color="var(--primary)" />{tc("careCallUs")}</a>
          {wa && <a href={wa} className="help-btn" target="_blank" rel="noopener"><CIcon name="logo-whatsapp" size={18} color="#16A34A" />{tc("careWhatsApp")}</a>}
        </div>
        {o.status === "pending" && (
          <button type="button" className="cancel-btn" onClick={cancel} disabled={cancelling}>{cancelling ? "…" : tc("cancel_job")}</button>
        )}
        <p className="small-note">{tc("webUpdatedEvery")}</p>
      </div>
    </div>
  );
}
