import site from "@/site.config";

const PRIVATE = ["/account", "/cart", "/activity", "/login", "/checkout", "/order-placed", "/orders/"];

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE.flatMap((p) => [p, `/en${p}`]) }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
