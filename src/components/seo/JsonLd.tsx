import { site } from "@/lib/site";
import { servicePages } from "@/lib/services";

/**
 * Site-wide structured data (schema.org), rendered as real HTML so search
 * engines get it without executing the WebGL scene.
 *
 * Two linked entities share one @graph:
 *  - the agency itself (ProfessionalService), given a stable @id so the
 *    per-page Service markup can point back at the same organisation
 *  - the website, which is what Google uses for sitelinks/site name
 *
 * `sameAs` is deliberately absent: it is meant for third-party profiles that
 * corroborate the entity, and pointing it at our own URL says nothing.
 */
export const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: site.name,
        description: site.description,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        image: `${site.url}/opengraph-image`,
        logo: `${site.url}/icon`,
        priceRange: "€€",
        address: { "@type": "PostalAddress", addressCountry: "ES" },
        areaServed: { "@type": "Country", name: "España" },
        knowsLanguage: ["es"],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: site.email,
          telephone: site.phone,
          areaServed: "ES",
          availableLanguage: "Spanish",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios de diseño web y posicionamiento SEO",
          itemListElement: servicePages.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.body,
              url: `${site.url}/${s.slug}`,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: site.url,
        name: site.name,
        description: site.description,
        publisher: { "@id": ORG_ID },
        inLanguage: "es-ES",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON is fully controlled/static — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
