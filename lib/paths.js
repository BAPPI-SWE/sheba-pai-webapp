/** "/bn/about" or "/about" → { lang: "bn", path: "/about" }; "/en/about" → { lang: "en", path: "/about" }. */
export function splitPath(pathname = "/") {
  const p = pathname || "/";
  if (p === "/en" || p.startsWith("/en/")) return { lang: "en", path: p.slice(3) || "/" };
  if (p === "/bn" || p.startsWith("/bn/")) return { lang: "bn", path: p.slice(3) || "/" };
  return { lang: "bn", path: p };
}
/** Is `path` this nav item (exact for "/", prefix for others)? */
export function isActive(path, item) {
  if (item === "/") return path === "/";
  return path === item || path.startsWith(item + "/") || (item === "/doctors" && path.startsWith("/doctor/"));
}
