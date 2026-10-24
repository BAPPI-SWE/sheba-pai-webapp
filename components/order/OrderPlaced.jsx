"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CIcon from "@/components/CIcon";
import { makeT } from "@/lib/client/text";
import { fmtDateTime, orderNumber } from "@/lib/datetime";

/** OrderConfirmedScreen. */
export default function OrderPlaced({ lang }) {
  const tc = makeT(lang);
  const p = useSearchParams();
  const id = p.get("id"), no = p.get("no"), at = p.get("at");
  const pre = lang === "en" ? "/en" : "";
  return (
    <div className="done-screen">
      <span className="icircle tone-success" style={{ width: 96, height: 96 }}><CIcon name="checkmark-circle" size={48} /></span>
      <h1>{tc("orderPlacedTitle")}</h1>
      <p>{tc("orderPlacedMsg")}</p>
      {id && <p className="done-id">{tc("orderIdLabel")}: {orderNumber({ _id: id, orderNo: no })}{at ? `  ·  ${fmtDateTime(at, lang)}` : ""}</p>}
      <Link href={`${pre}/medicine`} className="btn-app" style={{ maxWidth: 260, marginTop: 32 }}>{tc("continueShopping")}</Link>
      {id && <Link href={`${pre}/orders/${id}`} className="text-link" style={{ marginTop: 12 }}>{tc("viewOrders")}</Link>}
    </div>
  );
}
