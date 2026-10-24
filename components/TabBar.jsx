"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CIcon from "@/components/CIcon";
import { splitPath } from "@/lib/paths";
import { useCart } from "@/lib/client/cart";

const TABS = [
  ["/", "home", "homeLabel"],
  ["/cart", "cart", "cartLabel"],
  ["/activity", "receipt", "activityLabel"],
];

/**
 * The app's bottom tab bar (Home · Cart · My activity). Like the app, it
 * shows only on those three screens — inner screens have a back arrow.
 */
export default function TabBar({ lang, L }) {
  const { path } = splitPath(usePathname());
  const { itemCount } = useCart();
  if (!TABS.some(([p]) => p === path)) return null;
  const to = (p) => (lang === "en" ? (p === "/" ? "/en" : `/en${p}`) : p);
  return (
    <>
      <div aria-hidden style={{ height: "calc(var(--tabbar-h) + env(safe-area-inset-bottom))" }} className="tab-spacer" />
      <nav className="tabbar" aria-label={L.tabsLabel}>
        <ul>
          {TABS.map(([p, icon, key]) => {
            const on = path === p;
            return (
              <li key={p}>
                <Link href={to(p)} className="tab" aria-current={on ? "page" : undefined}>
                  <span className="tab-icon"><CIcon name={on ? icon : `${icon}-outline`} size={23} />{p === "/cart" && itemCount > 0 && <span className="tab-badge">{itemCount > 99 ? "99+" : itemCount}</span>}</span>
                  {L[key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
