import Link from "next/link";
import Icon from "@/components/Icon";

/** The app's EmptyState: tinted icon circle, title, line of help, optional button. */
export default function EmptyState({ icon = "file-tray-outline", tone = "primary", title, sub, action, actionHref, children }) {
  return (
    <div className="empty">
      <span className={`icircle tone-${tone}`} style={{ width: 72, height: 72 }}><Icon name={icon} size={32} /></span>
      {title && <h2>{title}</h2>}
      {sub && <p>{sub}</p>}
      {action && actionHref && <Link href={actionHref} className="btn btn-primary">{action}</Link>}
      {children}
    </div>
  );
}
