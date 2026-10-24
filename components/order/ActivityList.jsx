"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import { apiFetch } from "@/lib/client/api";
import { useSession } from "@/lib/client/session";
import { makeT } from "@/lib/client/text";
import { fmtSmart, orderNumber } from "@/lib/datetime";

const ORDER = {
  pending: ["orderStatusPending", "warning"], confirmed: ["orderStatusConfirmed", "primary"], rider_assigned: ["orderStatusRiderAssigned", "primary"],
  picked_up: ["orderStatusPickedUp", "primary"], out_for_delivery: ["orderStatusOutForDelivery", "primary"], delivered: ["orderStatusDelivered", "success"], cancelled: ["orderStatusCancelled", "danger"],
};
const CARE = { new: ["careStNew", "warning"], contacted: ["careStContacted", "primary"], confirmed: ["careStConfirmed", "primary"], ongoing: ["careStOngoing", "success"], completed: ["careStCompleted", "success"], cancelled: ["careStCancelled", "danger"] };
const ORDER_ACTIVE = ["pending", "confirmed", "rider_assigned", "picked_up", "out_for_delivery"];
const CARE_OPEN = ["new", "contacted", "confirmed", "ongoing"];
// tc-keys: careStNew careStContacted careStConfirmed careStOngoing careStCompleted careStCancelled filterAll filterCaregiver filterMedicine

/** ActivityScreen: medicine orders and caregiver requests on one timeline. */
export default function ActivityList({ lang }) {
  const tc = makeT(lang);
  const s = useSession();
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState(null);
  const [care, setCare] = useState([]);
  const pre = lang === "en" ? "/en" : "";

  useEffect(() => {
    if (!s.loggedIn) return;
    Promise.all([apiFetch("/api/orders").catch(() => null), apiFetch("/api/care/bookings/mine").catch(() => null)]).then(([o, c]) => {
      setOrders(o?.ok ? o.data || [] : []);
      if (c?.ok) setCare(c.data || []);
    });
  }, [s.loggedIn]);

  if (!s.ready) return <div className="skel" style={{ height: 200 }} />;
  if (!s.loggedIn) {
    return (
      <div className="empty">
        <span className="icircle tone-primary" style={{ width: 72, height: 72 }}><CIcon name="log-in-outline" size={32} /></span>
        <h2>{tc("activityGuestTitle")}</h2><p>{tc("activityGuestSub")}</p>
        <Link href={`${pre}/login?next=${encodeURIComponent(`${pre}/activity`)}`} className="btn-app" style={{ width: "auto", minWidth: 180, marginTop: 24 }}>{tc("login")}</Link>
      </div>
    );
  }
  if (!orders) return [1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 88, marginBottom: 16 }} />);

  const all = [
    ...care.map((c) => ({
      id: c._id, kind: "caregiver", href: null,
      title: (lang === "bn" ? c.offerNameBangla || c.categoryNameBangla : c.offerName || c.categoryName) || c.requestedCaregiverName || tc("careGeneralRequest"),
      sub: c.caregiver?.name || `${tc("careBookingCode")}: ${c.code}`, st: CARE[c.status] || CARE.new, active: CARE_OPEN.includes(c.status),
      amount: c.agreedPrice ?? c.offerPrice, at: c.createdAt,
    })),
    ...orders.map((o) => ({
      id: o._id, kind: "medicine", href: `${pre}/orders/${o._id}`,
      title: o.items?.map((i) => i.brandName).join(", ") || tc("wantMedicine"),
      sub: `${orderNumber(o)} · ${o.items?.length || 0} ${tc("itemsLabel")}`, st: ORDER[o.status] || ORDER.pending, active: ORDER_ACTIVE.includes(o.status),
      amount: o.total, at: o.createdAt,
    })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));
  const shown = filter === "all" ? all : all.filter((x) => x.kind === filter);
  const active = shown.filter((x) => x.active), past = shown.filter((x) => !x.active);

  const Card = ({ x }) => {
    const inner = (
      <>
        <span className={`icircle ${x.kind === "caregiver" ? "tone-primary" : "tone-accent"}`} style={{ width: 42, height: 42 }}>
          <CIcon name={x.kind === "caregiver" ? "heart" : "medkit"} size={19} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="act-title">{x.title}</span>
          <span className="act-sub">{x.sub}</span>
          <span className={`pill-badge tone-${x.st[1]}`} style={{ marginTop: 6 }}>{tc(x.st[0])}</span>
          <span className="act-date">{fmtSmart(x.at, lang)}</span>
        </span>
        {x.amount != null && <b className="act-amt">৳{x.amount}</b>}
      </>
    );
    return x.href ? <Link href={x.href} className={`act-card press ${x.active ? "on" : ""}`}>{inner}</Link> : <div className={`act-card ${x.active ? "on" : ""}`}>{inner}</div>;
  };

  return (
    <>
      <div className="filter-row" role="tablist">
        {[["all", "filterAll"], ["caregiver", "filterCaregiver"], ["medicine", "filterMedicine"]].map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={filter === k} className={`fp ${filter === k ? "on" : ""}`} onClick={() => setFilter(k)}>{tc(l)}</button>
        ))}
      </div>
      {shown.length === 0 && (
        <div className="empty">
          <span className="icircle tone-muted" style={{ width: 72, height: 72 }}><CIcon name="time-outline" size={32} /></span>
          <h2>{tc("noActivityYet")}</h2><p>{tc("noActivitySub")}</p>
          <Link href={pre || "/"} className="btn-app" style={{ width: "auto", minWidth: 180, marginTop: 24 }}>{tc("goHomeBtn")}</Link>
        </div>
      )}
      {active.length > 0 && <><h2 className="section-title">{tc("activeNow")}</h2>{active.map((x) => <Card key={x.id} x={x} />)}</>}
      {past.length > 0 && <><h2 className="section-title" style={{ marginTop: active.length ? 32 : 0 }}>{tc("pastActivity")}</h2>{past.map((x) => <Card key={x.id} x={x} />)}</>}
    </>
  );
}
