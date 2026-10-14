import site from "@/site.config";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/en/account", "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
