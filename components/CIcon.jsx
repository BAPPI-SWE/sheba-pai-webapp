"use client";
import ICONS from "@/lib/ion/client.json";

/** Small icon set for client components (keeps the browser bundle tiny). */
export default function CIcon({ name, size = 20, color, style }) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} fill="currentColor" aria-hidden
      style={{ color, flex: "none", ...style }} dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }} />
  );
}
