"use client";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import { useCart } from "@/lib/client/cart";
import { makeT } from "@/lib/client/text";

/** "🛒 3 · ৳162 · Cart ›" — floats over store screens whenever the cart has something (CartBar.js). */
export default function CartBar({ lang }) {
  const tc = makeT(lang);
  const { itemCount, subtotal } = useCart();
  if (!itemCount) return null;
  return (
    <>
      <div aria-hidden className="mob-only" style={{ height: 80 }} />
      <Link href={lang === "en" ? "/en/cart" : "/cart"} className="cartbar press">
        <span className="cartbar-left">
          <span className="cartbar-icon"><CIcon name="cart" size={18} /><i>{itemCount}</i></span>৳{subtotal}
        </span>
        <span className="cartbar-right">{tc("cartTitle")}<CIcon name="chevron-forward" size={16} /></span>
      </Link>
    </>
  );
}

/** Cart icon with a count, for the right side of a screen header (PharmacyList). */
export function HeaderCart({ lang, label }) {
  const { itemCount } = useCart();
  return (
    <Link href={lang === "en" ? "/en/cart" : "/cart"} className="stack-right" aria-label={label}>
      <CIcon name="cart-outline" size={22} />
      {itemCount > 0 && <span className="tab-badge">{itemCount}</span>}
    </Link>
  );
}
