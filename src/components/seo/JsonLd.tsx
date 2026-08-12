import { site } from "@/lib/site";
import { services } from "@/lib/content";

/**
 * Structured data (schema.org) describing the agency and its services.
 * Rendered as real HTML so search engines get it without executing the scene.
 */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    image: `${site.url}/opengraph-image`,
    priceRange: "€€",
    areaServed: "ES",
    address: { "@type": "PostalAddress", addressCountry: "ES" },
    sameAs: [site.url],
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.body,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // JSON is fully controlled/static — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
