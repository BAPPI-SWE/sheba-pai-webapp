"use client";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import { useCart, cartSnapshot } from "@/lib/client/cart";
import { makeT } from "@/lib/client/text";
import { medName, shownPrice, inStock } from "@/lib/medicine";

const url = (lang, m) => (lang === "en" ? `/en/medicine/${m.slug}` : `/medicine/${m.slug}`);

/** "Add" button that turns into a − 2 + stepper once the item is in the cart. */
export function AddControl({ medicine: m, lang, compact }) {
  const tc = makeT(lang);
  const { items, addItem, updateQuantity } = useCart();
  const line = items.find((i) => i.medicine._id === m._id);
  if (!inStock(m)) return <span className={`add-btn off ${compact ? "compact" : ""}`}>{tc("outOfStockShort")}</span>;
  if (line) {
    return (
      <span className={`stepper ${compact ? "compact" : ""}`}>
        <button type="button" onClick={() => updateQuantity(m._id, line.quantity - 1)} aria-label="−"><CIcon name="remove" size={15} /></button>
        <b aria-live="polite">{line.quantity}</b>
        <button type="button" onClick={() => updateQuantity(m._id, line.quantity + 1)} aria-label="+"><CIcon name="add" size={15} /></button>
      </span>
    );
  }
  return <button type="button" className={`add-btn ${compact ? "compact" : ""}`} onClick={() => addItem(cartSnapshot(m), 1)}>{tc("addToCartShort")}</button>;
}

function Thumb({ m, size = 22 }) {
  return m.images?.[0]
    ? <img src={m.images[0]} alt="" loading="lazy" />
    : <CIcon name="medkit-outline" size={size} color="var(--primary)" />;
}

/** Wide row — search results and generic pages (MedicineRow). */
export function MedicineRow({ medicine: m, lang }) {
  return (
    <div className="mrow">
      <Link href={url(lang, m)} className="mrow-main">
        <span className="mthumb">
          <Thumb m={m} />
          {m.onSale && <span className="off-tag">{m.discountPercent}%</span>}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="mname">{medName(m, lang)}</span>
          <span className="mmeta">{m.strength}{m.dosageForm ? ` · ${m.dosageForm}` : ""}</span>
          {m.manufacturer?.name && <span className="mmeta">{m.manufacturer.name}</span>}
          {m.generic?.name && <span className="mmeta light">{m.generic.name}</span>}
        </span>
      </Link>
      <div className="mrow-right">
        {m.prescriptionRequired && <span className="rx">Rx</span>}
        <span className="mprice-col">
          {m.onSale && <s>৳{m.price}</s>}
          <b>৳{shownPrice(m)}</b>
        </span>
        <AddControl medicine={m} lang={lang} />
      </div>
    </div>
  );
}

/** Grid tile — category listings, two per row on phones (MedicineTile). */
export function MedicineTile({ medicine: m, lang }) {
  return (
    <div className="mtile">
      <Link href={url(lang, m)} className="mtile-link">
        <span className="mtile-img">
          <Thumb m={m} size={30} />
          {m.onSale && <span className="off-tag">{m.discountPercent}%</span>}
          {m.prescriptionRequired && <span className="rx abs">Rx</span>}
        </span>
        <span className="mtile-name">{medName(m, lang)}</span>
        <span className="mmeta">{m.strength}</span>
      </Link>
      <div className="mtile-foot">
        <span className="mprice-col left">
          <b>৳{shownPrice(m)}</b>
          {m.onSale && <s>৳{m.price}</s>}
        </span>
        <AddControl medicine={m} lang={lang} compact />
      </div>
    </div>
  );
}
