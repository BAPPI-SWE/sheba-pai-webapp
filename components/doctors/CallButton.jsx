"use client";
import { useState } from "react";
import CIcon from "@/components/CIcon";
import Sheet from "./Sheet";

/**
 * The app's call behaviour: one number dials straight away, several open
 * "Which number to call?" with every number listed.
 */
export default function CallButton({ phones = [], title, sub, label, L, className = "call-btn", iconSize = 16 }) {
  const [open, setOpen] = useState(false);
  if (!phones.length) return null;
  const content = <><CIcon name="call" size={iconSize} />{label}</>;
  if (phones.length === 1) return <a href={`tel:${phones[0]}`} className={className}>{content}</a>;
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">{content}</button>
      <Sheet open={open} onClose={() => setOpen(false)} label={L.docChooseNumber}>
        <h2>{L.docChooseNumber}</h2>
        <p className="sheet-sub">{title}{sub ? ` · ${sub}` : ""}</p>
        <div className="sheet-scroll">
          {phones.map((p) => (
            <a key={p} href={`tel:${p}`} className="phone-row" onClick={() => setOpen(false)}>
              <span className="icircle tone-helper" style={{ width: 38, height: 38 }}><CIcon name="call" size={17} /></span>
              <span>{p}</span>
              <CIcon name="chevron-forward" size={18} color="var(--border-strong)" />
            </a>
          ))}
        </div>
      </Sheet>
    </>
  );
}
