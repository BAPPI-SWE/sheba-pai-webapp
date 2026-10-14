import site from "@/site.config";
import { href } from "@/lib/i18n";

/**
 * Metadata for one page in one language: title, description, canonical URL,
 * the other-language version (hreflang), and the share preview (Open Graph).
 * `path` is the page's path WITHOUT the language prefix, e.g. "/about".
 */
export function pageMeta({ lang, path = "/", title, description, image = "/img/og-default.png", noindex = false }) {
  const url = `${site.url}${href(lang, path)}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "bn-BD": `${site.url}${href("bn", path)}`,
        en: `${site.url}${href("en", path)}`,
        "x-default": `${site.url}${href("bn", path)}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name[lang],
      title,
      description,
      locale: lang === "bn" ? "bn_BD" : "en_US",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/** Business details for Google (schema.org). Shown on every page. */
export function organizationLd(lang) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": `${site.url}/#org`,
    name: site.name[lang],
    alternateName: site.name[lang === "bn" ? "en" : "bn"],
    url: site.url,
    logo: `${site.url}/img/logo.png`,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "Country", name: "Bangladesh" },
    sameAs: [site.playStoreUrl],
  };
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
