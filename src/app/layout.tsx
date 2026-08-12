import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import SceneBackground from "@/components/3d/SceneBackground";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";

// Display face (Söhne Breit substitute) — variable, so the system's signature
// intermediate weight 480 is available exactly rather than rounded to 500.
const displayFace = Archivo({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

// Body / UI face (arcadia substitute) — variable for weights 400/480.
const bodyFace = Inter({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "diseño web",
    "desarrollo web",
    "agencia web",
    "posicionamiento SEO",
    "optimización web",
    "Core Web Vitals",
    "presencia digital",
    "Next.js",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#171721",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.lang}
      className={`${displayFace.variable} ${bodyFace.variable} antialiased`}
    >
      <body>
        <a
          href="#main"
          className="text-body-sm sr-only rounded-[var(--radius-pill)] bg-cobalt px-5 py-2.5 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Saltar al contenido
        </a>
        <SmoothScrollProvider>
          <SceneBackground />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScrollProvider>
        <JsonLd />
      </body>
    </html>
  );
}
