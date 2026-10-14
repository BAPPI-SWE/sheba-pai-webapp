import { NextResponse } from "next/server";

/**
 * Bangla at the root, English under /en:
 *   /about      → shows app/[lang]=bn/about   (rewrite, URL stays /about)
 *   /en/about   → app/[lang]=en/about
 *   /bn/about   → 308 redirect to /about      (one address per page, good for Google)
 */
export function middleware(req) {
  const { pathname, search } = req.nextUrl;
  if (pathname === "/bn" || pathname.startsWith("/bn/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/bn${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, files with an extension (images, robots.txt, sitemap.xml…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
