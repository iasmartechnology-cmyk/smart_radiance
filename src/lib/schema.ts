import { COMPANY, SITE, SITE_URL } from "@/lib/constants";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    description: SITE.description,
    email: COMPANY.email,
    telephone: `+34${COMPANY.phone}`,
    image: `${SITE_URL}/icon.svg`,
    priceRange: "€€",
    areaServed: {
      "@type": "Country",
      name: "España",
    },
    knowsAbout: [
      "Desarrollo web",
      "Posicionamiento SEO",
      "Optimización de páginas web",
    ],
  };
}
