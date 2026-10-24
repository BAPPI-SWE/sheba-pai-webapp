"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * The medicine cart — a copy of the app's CartContext. Kept on this device
 * (same storage key as the app) and only sent to the server at checkout.
 */
const KEY = "medicine_cart_v1";
const Ctx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch {}
    setReady(true);
    const onStorage = (e) => { if (e.key === KEY) { try { setItems(JSON.parse(e.newValue || "[]")); } catch {} } };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} } }, [items, ready]);

  const addItem = useCallback((incoming, quantity = 1) => {
    // Same normalisation as the app: the cart always prices from `price`,
    // so a sale item carries its sale price there.
    const medicine = incoming.onSale && incoming.effectivePrice != null && incoming.originalPrice == null
      ? { ...incoming, originalPrice: incoming.price, price: incoming.effectivePrice }
      : incoming;
    setItems((prev) => {
      const ex = prev.find((i) => i.medicine._id === medicine._id);
      if (ex) return prev.map((i) => (i.medicine._id === medicine._id ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { medicine, quantity }];
    });
  }, []);
  const updateQuantity = useCallback((id, quantity) => {
    setItems((prev) => (quantity <= 0 ? prev.filter((i) => i.medicine._id !== id) : prev.map((i) => (i.medicine._id === id ? { ...i, quantity } : i))));
  }, []);
  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i.medicine._id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = Math.round(items.reduce((s, i) => s + i.medicine.price * i.quantity, 0) * 100) / 100;
    const needsPrescription = items.some((i) => i.medicine.prescriptionRequired);
    return { items, ready, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal, needsPrescription };
  }, [items, ready, addItem, updateQuantity, removeItem, clearCart]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}

/** What goes into the cart for one medicine (same fields as the app's snapshot). */
export function cartSnapshot(m) {
  return {
    _id: m._id, slug: m.slug, brandName: m.brandName, brandNameBangla: m.brandNameBangla, strength: m.strength,
    price: m.price, effectivePrice: m.effectivePrice, onSale: m.onSale, mrp: m.mrp, discountPercent: m.discountPercent,
    stock: m.stock, prescriptionRequired: m.prescriptionRequired, sellUnit: m.sellUnit, image: m.images?.[0] || null,
  };
}
