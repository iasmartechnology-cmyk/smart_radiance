import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Methodology } from "@/components/sections/Methodology";
import { CTASection } from "@/components/sections/CTASection";
import { SITE } from "@/constants/site";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: SITE.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Servicios",
      item: `${SITE.url}#servicios`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Metodología",
      item: `${SITE.url}#metodologia`,
    },
  ],
};

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Methodology />
      <CTASection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
