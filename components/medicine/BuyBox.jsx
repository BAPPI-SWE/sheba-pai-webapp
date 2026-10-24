"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CIcon from "@/components/CIcon";
import site from "@/site.config";
import { useCart, cartSnapshot } from "@/lib/client/cart";
import { getSession } from "@/lib/client/session";
import { getPublicSettings, whatsAppUrl } from "@/lib/client/api";
import { makeT } from "@/lib/client/text";
import { medName, shownPrice, inStock } from "@/lib/medicine";

/** The price card from MedicineDetailScreen: price, quantity, add / buy now, WhatsApp, call. */
export default function BuyBox({ medicine: m, lang }) {
  const tc = makeT(lang);
  const router = useRouter();
  const { items, addItem, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [settings, setSettings] = useState({});
  useEffect(() => { getPublicSettings().then(setSettings); }, []);

  const price = shownPrice(m);
  const ok = inStock(m);
  const maxQty = Math.max(1, Math.min(m.stock || 1, 99));
  const inCart = items.find((i) => i.medicine._id === m._id)?.quantity || 0;
  const snap = () => ({ ...cartSnapshot(m), price, originalPrice: m.price });
  const pre = lang === "en" ? "/en" : "";

  function add() { addItem(snap(), qty); setAdded(true); setTimeout(() => setAdded(false), 1600); }
  function buyNow() {
    const ex = items.find((i) => i.medicine._id === m._id);
    if (ex) updateQuantity(m._id, Math.max(ex.quantity, qty)); else addItem(snap(), qty);
    router.push(getSession().token ? `${pre}/checkout` : `${pre}/login?next=${encodeURIComponent(`${pre}/checkout`)}`);
  }
  const wa = whatsAppUrl(settings.supportWhatsAppNumber || site.whatsapp,
    tc("medWhatsAppMsg", { name: medName(m, lang), strength: m.strength || "", qty, total: Math.round(price * qty * 100) / 100 }));
  const call = settings.emergencyContactNumber || site.phone;

  return (
    <section className="price-card">
      <div className="price-row">
        <b className="big-price">৳{price}</b>
        {m.onSale && <><s>৳{m.price}</s><span className="pill-badge tone-success">{m.discountPercent}% {lang === "en" ? "OFF" : "কম"}</span></>}
        <span className="per-unit">/ {m.sellUnit}</span>
      </div>
      {m.mrp > m.price && <p className="mrp-note">{tc("mrpLabel")}: ৳{m.mrp}</p>}
      {m.prescriptionRequired && <p className="rx-note"><CIcon name="document-text-outline" size={15} />{tc("prescriptionNeeded")}</p>}
      <p className={ok ? "stock in" : "stock out"}>{ok ? `✓ ${lang === "en" ? "In stock" : "স্টকে আছে"}` : tc("outOfStockShort")}</p>

      <div className="qty-row">
        <span>{tc("qtyLabel")}</span>
        <span className="qty-stepper">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="−"><CIcon name="remove" size={18} /></button>
          <b aria-live="polite">{qty}</b>
          <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="+"><CIcon name="add" size={18} /></button>
        </span>
      </div>
      {inCart > 0 && <p className="in-cart">{tc("inYourCart")}: {inCart}</p>}

      <div className="act-row">
        <button type="button" className="act" style={{ background: ok ? "var(--primary)" : "var(--border-strong)" }} onClick={add} disabled={!ok}>
          <CIcon name={added ? "checkmark-circle" : "cart-outline"} size={17} />{added ? tc("addedToCart") : tc("addToCart")}
        </button>
        <button type="button" className="act" style={{ background: ok ? "var(--text)" : "var(--border-strong)" }} onClick={buyNow} disabled={!ok}>
          <CIcon name="flash" size={17} />{tc("buyNow")}
        </button>
      </div>
      <div className="act-row">
        <a className="act" style={{ background: "var(--success)" }} href={wa || "#"} target="_blank" rel="noopener"><CIcon name="logo-whatsapp" size={17} />{tc("orderOnWhatsApp")}</a>
        <a className="act" style={{ background: "var(--helper)" }} href={`tel:${call}`}><CIcon name="call" size={17} />{tc("callForOrder")}</a>
      </div>
    </section>
  );
}
