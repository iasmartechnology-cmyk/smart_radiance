import { site } from "@/lib/site";
import { ORG_ID } from "./JsonLd";
import type { ServicePage } from "@/lib/services";

/**
 * Per-page structured data for a service landing page:
 *
 *  - Service, linked to the agency entity via @id rather than repeating it
 *  - BreadcrumbList, which Google renders in place of the raw URL in results
 *  - FAQPage, built from the questions actually shown on the page (marking up
 *    hidden content violates Google's guidelines, so these are real, visible
 *    Q&As)
 */
export default function ServiceJsonLd({ service }: { service: ServicePage }) {
  const url = `${site.url}/${service.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}/#service`,
        name: service.title,
        description: service.metaDescription,
        url,
        serviceType: service.h1,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "España" },
        inLanguage: "es-ES",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: service.title,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        mainEntity: service.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
