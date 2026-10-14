import Link from "next/link";
import Image from "next/image";
import { dict } from "@/lib/dict";

// Next does not pass params to not-found; Bangla is the site's main language.
export default function NotFound() {
  const t = dict("bn"), e = dict("en");
  return (
    <div className="wrap soon-page">
      <Image src="/img/support.webp" alt="" width={220} height={220} />
      <h1>{t.notFoundTitle}</h1>
      <p>{t.notFoundBody}<br /><span lang="en">{e.notFoundBody}</span></p>
      <div className="actions">
        <Link href="/" className="btn btn-primary">{t.backHome}</Link>
        <Link href="/en" className="btn btn-ghost" lang="en">{e.backHome}</Link>
      </div>
    </div>
  );
}
