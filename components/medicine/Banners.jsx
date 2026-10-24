"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/** Promotional banner slider — swipe, and it moves on by itself every 4 s (PharmacyHome). */
export default function Banners({ banners, lang }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const pre = lang === "en" ? "/en" : "";
  const link = (b) => b.linkType === "category" && b.linkValue ? `${pre}/medicine/category/${b.linkValue}`
    : b.linkType === "medicine" && b.linkValue ? `${pre}/medicine/${b.linkValue}`
    : b.linkType === "deals" ? `${pre}/medicine/deals` : null;

  useEffect(() => {
    if (banners.length <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      const el = ref.current; if (!el) return;
      const w = el.firstElementChild?.getBoundingClientRect().width || el.clientWidth;
      const n = (Math.round(el.scrollLeft / (w + 16)) + 1) % banners.length;
      el.scrollTo({ left: n * (w + 16), behavior: "smooth" });
    }, 4000);
    return () => clearInterval(t);
  }, [banners.length]);

  function onScroll() {
    const el = ref.current; if (!el) return;
    const w = el.firstElementChild?.getBoundingClientRect().width || el.clientWidth;
    setIdx(Math.round(el.scrollLeft / (w + 16)));
  }

  return (
    <div>
      <div className="banners" ref={ref} onScroll={onScroll}>
        {banners.map((b, i) => {
          const to = link(b);
          const img = <img src={b.imageUrl} alt={(lang === "en" ? b.title : b.titleBangla || b.title) || ""} loading={i ? "lazy" : "eager"} />;
          return to ? <Link key={b._id} href={to} className="banner">{img}</Link> : <div key={b._id} className="banner">{img}</div>;
        })}
      </div>
      {banners.length > 1 && <div className="dots mob-only" aria-hidden>{banners.map((b, i) => <span key={b._id} className={i === idx ? "on" : ""} />)}</div>}
    </div>
  );
}
