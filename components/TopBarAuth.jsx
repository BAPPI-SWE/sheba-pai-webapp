"use client";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import { useSession } from "@/lib/client/session";

/** Home top bar, right side: "Log in" pill for guests, profile circle when signed in (as in the app). */
export default function TopBarAuth({ lang, L }) {
  const s = useSession();
  const pre = lang === "en" ? "/en" : "";
  if (s.ready && !s.loggedIn) {
    return <Link href={`${pre}/login`} className="lang-pill press"><CIcon name="log-in-outline" size={16} />{L.login}</Link>;
  }
  return <Link href={`${pre}/account`} className="round-btn avatar press" aria-label={L.profile}><CIcon name="person" size={18} /></Link>;
}
