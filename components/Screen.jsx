import Link from "next/link";
import Icon from "@/components/Icon";

/**
 * An inner screen, like a pushed screen in the app: a header with a back
 * arrow and the title. On desktop the same header becomes the page title
 * (with breadcrumbs above it).
 *   crumbs: [{ href, label }] — desktop only, also used for Google breadcrumbs
 */
export default function Screen({ title, back, backLabel, tint = "primary", crumbs, children, after, titleAs: T = "h1", deskTitle = true, sub, right }) {
  return (
    <>
      {crumbs?.length > 0 && (
        <nav className="crumbs desk-only" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.href}>{i > 0 && "› "}<Link href={c.href}>{c.label}</Link></span>
          ))}
        </nav>
      )}
      <div className={`stackbar ${back ? "" : "no-back"} ${tint === "helper" ? "tint-helper" : ""} ${deskTitle ? "" : "mob-only"}`}>
        {back && (
          <Link href={back} className="back" aria-label={backLabel}>
            <Icon name="arrow-back" size={24} />
          </Link>
        )}
        <T className="stack-title">{title}{sub && <span className="stack-sub">{sub}</span>}</T>
        {right}
      </div>
      {after}
      <div className="body">{children}</div>
    </>
  );
}
