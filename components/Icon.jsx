import ICONS from "@/lib/ion/all.json";

/**
 * The app's icons (Ionicons — the same set the mobile app uses), drawn as
 * inline SVG on the server. Use in server components. Client components
 * use <CIcon> from "@/components/CIcon".
 */
export default function Icon({ name, size = 20, color, className, style, label }) {
  const inner = ICONS[name] || ICONS["ellipse-outline"];
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} fill="currentColor" className={className}
      style={{ color, flex: "none", ...style }} aria-hidden={label ? undefined : true} role={label ? "img" : undefined}
      aria-label={label} dangerouslySetInnerHTML={{ __html: inner }} />
  );
}
