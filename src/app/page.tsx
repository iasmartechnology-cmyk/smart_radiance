import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Results from "@/components/sections/Results";
import Contact from "@/components/sections/Contact";
import { site } from "@/lib/site";

/**
 * The homepage targets the broad brand + category intent ("agencia de diseño
 * web y SEO"); the four service pages take the specific commercial intents so
 * they don't compete with this one.
 */
const title = "Diseño web y posicionamiento SEO | Smart Radiance";
const description =
  "Agencia de diseño web y posicionamiento SEO. Creamos páginas web para empresas, optimizamos su rendimiento y mejoramos tu visibilidad en Google.";

export const metadata: Metadata = {
  // `absolute` bypasses the layout's "%s · Smart Radiance" template, which
  // would otherwise duplicate the brand name in this title.
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <Process />
      <Results />
      <Contact />
    </>
  );
}
