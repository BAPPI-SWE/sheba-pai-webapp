"use client";
import CIcon from "@/components/CIcon";
import { useCareContact, openCareRequest } from "@/lib/client/care";

/** Calls and WhatsApp always go to Sheba Pai (numbers come from the admin settings), never to the caregiver. */
export function CallLink({ className, children, label }) {
  const { phone } = useCareContact();
  return <a href={`tel:${phone}`} className={className} aria-label={label}>{children}</a>;
}

export function WaLink({ message, className, children, label }) {
  const { waUrl } = useCareContact();
  return <a href={waUrl(message) || "#"} className={className} target="_blank" rel="noopener" aria-label={label}>{children}</a>;
}

/** Opens the name + phone sheet (QuickRequestHost) for a service, package, caregiver or nothing in particular. */
export function RequestButton({ target, className, children, label }) {
  return <button type="button" className={className} onClick={() => openCareRequest(target)} aria-label={label}>{children}</button>;
}

/** The big glowing "call us for anything else" button (GlowCallButton). */
export function GlowCall({ title, sub, tone = "primary" }) {
  const { phone } = useCareContact();
  return (
    <div className={`cg-glow ${tone}`}>
      <a href={`tel:${phone}`} className="cg-glow-btn press">
        <span className="cg-glow-ico"><i /><span><CIcon name="call" size={21} /></span></span>
        <span className="cg-glow-text"><b>{title}</b>{sub && <small>{sub}</small>}</span>
        <CIcon name="chevron-forward" size={20} />
      </a>
    </div>
  );
}
