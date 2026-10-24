"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CIcon from "@/components/CIcon";
import { useCart } from "@/lib/client/cart";
import { useSession } from "@/lib/client/session";
import { makeT } from "@/lib/client/text";
import { medName } from "@/lib/medicine";

/** CartScreen: lines with − / +, remove, prescription notice, total and checkout. */
export default function CartView({ lang }) {
  const tc = makeT(lang);
  const router = useRouter();
  const session = useSession();
  const { items, ready, updateQuantity, removeItem, subtotal, needsPrescription, itemCount } = useCart();
  const pre = lang === "en" ? "/en" : "";

  if (!ready) return <div className="skel" style={{ height: 160 }} />;
  if (!items.length) {
    return (
      <div className="empty">
        <span className="icircle tone-muted" style={{ width: 72, height: 72 }}><CIcon name="cart-outline" size={32} /></span>
        <h2>{tc("emptyCart")}</h2><p>{tc("emptyCartSub")}</p>
        <Link href={`${pre}/medicine`} className="btn-app" style={{ width: "auto", marginTop: 24, minWidth: 200 }}>{tc("continueShopping")}</Link>
      </div>
    );
  }
  const go = () => router.push(session.loggedIn ? `${pre}/checkout` : `${pre}/login?next=${encodeURIComponent(`${pre}/checkout`)}`);

  return (
    <div className="cart-wrap">
      <div>
        {items.map(({ medicine: m, quantity }) => (
          <div key={m._id}>
            <div className="cart-row">
              <span className="cart-icon">{m.image ? <img src={m.image} alt="" /> : <CIcon name="medkit-outline" size={20} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {m.slug ? <Link href={`${pre}/medicine/${m.slug}`} className="cart-name">{medName(m, lang)}</Link> : <span className="cart-name">{medName(m, lang)}</span>}
                <span className="cart-meta">{m.strength} · ৳{m.price}</span>
                {m.prescriptionRequired && <span className="cart-rx">🩺 {tc("prescriptionNeeded")}</span>}
                {m.stock != null && quantity > m.stock && <span className="cart-out">{tc("outOfStockMsg")}</span>}
              </div>
              <span className="cart-qty">
                <button type="button" onClick={() => updateQuantity(m._id, quantity - 1)} aria-label="−"><CIcon name="remove" size={16} /></button>
                <b>{quantity}</b>
                <button type="button" onClick={() => updateQuantity(m._id, quantity + 1)} aria-label="+"><CIcon name="add" size={16} /></button>
              </span>
            </div>
            <button type="button" className="cart-remove" onClick={() => removeItem(m._id)}>{tc("removeFromCart")}</button>
          </div>
        ))}
        {needsPrescription && <p className="rx-notice"><CIcon name="information-circle" size={16} />{tc("prescriptionUploadHint")}</p>}
      </div>
      <div className="cart-foot">
        <div className="cart-total"><span>{tc("subtotalLabel")} ({itemCount} {tc("itemsInCart")})</span><b>৳{subtotal}</b></div>
        <button type="button" className="btn-app" onClick={go}><CIcon name="arrow-forward" size={19} />{tc("proceedToCheckout")} · ৳{subtotal}</button>
        {session.ready && !session.loggedIn && <p className="small-note" style={{ marginTop: 8 }}>{tc("checkoutLoginHint")}</p>}
      </div>
    </div>
  );
}
