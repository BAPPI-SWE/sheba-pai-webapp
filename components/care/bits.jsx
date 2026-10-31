import CIcon from "@/components/CIcon";
import { tierMeta, CARE_STATUS } from "@/lib/care";
import { initials } from "@/lib/doctors";

/** Small pieces shared by every caregiver screen (the app's CareCards.js). `tx` = (key) => words. */

export function CaregiverAvatar({ caregiver: c, size = 60, showDot = false }) {
  const male = c.gender === "male";
  return (
    <span className={`cg-avatar ${male ? "male" : ""}`} style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {c.photoUrl ? <img src={c.photoUrl} alt="" width={size} height={size} loading="lazy" /> : initials(c.name)}
      {showDot && <i className={`cg-dot ${c.available ? "on" : ""}`} style={{ width: size * 0.26, height: size * 0.26 }} />}
    </span>
  );
}

export function Pill({ label, tone = "primary", icon, big }) {
  return (
    <span className={`pill-badge tone-${tone} ${big ? "cg-pill-big" : ""}`}>
      {icon && <CIcon name={icon} size={big ? 14 : 11} />}{label}
    </span>
  );
}

export function TierBadge({ tier, tx, big }) {
  const m = tierMeta(tx, tier);
  return <Pill label={m.label} tone={m.tone} icon={m.icon} big={big} />;
}

// cicon-keys: time-outline call-outline checkmark-circle-outline heart-outline ribbon-outline close-circle-outline medkit school heart
export function StatusPill({ status, tx, big }) {
  const m = CARE_STATUS[status] || CARE_STATUS.new;
  return <Pill label={tx(m.key)} tone={m.tone} icon={m.icon} big={big} />;
}

export function Stars({ value = 0, size = 14 }) {
  return (
    <span className="cg-stars" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => <CIcon key={i} name={value >= i ? "star" : value >= i - 0.5 ? "star-half" : "star-outline"} size={size} color="#F59E0B" />)}
    </span>
  );
}
