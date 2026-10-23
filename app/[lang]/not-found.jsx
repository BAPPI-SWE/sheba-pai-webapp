import Link from "next/link";
import Icon from "@/components/Icon";
import { dict } from "@/lib/dict";

// Next does not pass params here; Bangla is the main language, English underneath.
export default function NotFound() {
  const t = dict("bn"), e = dict("en");
  return (
    <div className="body">
      <div className="empty">
        <span className="icircle tone-muted" style={{ width: 72, height: 72 }}><Icon name="search-outline" size={32} /></span>
        <h2>{t.notFoundTitle}</h2>
        <p>{t.notFoundBody}<br /><span lang="en">{e.notFoundBody}</span></p>
        <Link href="/" className="btn btn-primary">{t.backHome}</Link>
        <Link href="/en" lang="en" style={{ marginTop: 14, color: "var(--primary)", fontWeight: 700 }}>{e.backHome}</Link>
      </div>
    </div>
  );
}
