import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import HeadingReveal from "@/components/animations/HeadingReveal";
import Reveal from "@/components/animations/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import ServiceJsonLd from "@/components/seo/ServiceJsonLd";
import { servicePages, getServiceBySlug } from "@/lib/services";
import { site } from "@/lib/site";

/** Exactly four static pages; anything else 404s instead of rendering. */
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const url = `/${service.slug}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: site.locale,
      url,
      siteName: site.name,
      title: `${service.metaTitle} · ${site.name}`,
      description: service.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.metaTitle} · ${site.name}`,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const others = servicePages.filter((s) => s.slug !== service.slug);

  return (
    <>
      <ServiceJsonLd service={service} />

      {/* Intro */}
      <section className="relative z-10 shell pt-32 pb-16 md:pt-40">
        <nav aria-label="Miga de pan" className="text-caption text-slate">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-ivory">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ash">{service.title}</li>
          </ol>
        </nav>

        <HeadingReveal
          as="h1"
          lines={[service.h1]}
          className="text-heading-lg mt-6 max-w-[20ch] text-ivory"
        />

        <Reveal as="div">
          <p className="text-body-lg mt-6 max-w-[58ch] text-ash">
            {service.intro}
          </p>
        </Reveal>
      </section>

      {/* Body */}
      <section className="relative z-10 shell pb-8">
        <div className="max-w-[68ch]">
          {service.sections.map((block) => (
            <Reveal as="div" key={block.h2} className="mb-14">
              <h2 className="text-heading text-ivory">{block.h2}</h2>
              {block.paragraphs.map((p, i) => (
                <p key={i} className="text-body mt-5 text-ash">
                  {p}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Deliverables */}
      <section className="relative z-10 shell py-12">
        <h2 className="text-heading text-ivory">Qué incluye</h2>
        <Reveal as="ul" stagger className="mt-10 grid gap-5 sm:grid-cols-2">
          {service.deliverables.map((d) => (
            <li key={d.title}>
              <article className="card h-full transition-colors duration-500 hover:bg-obsidian">
                <h3 className="text-heading-sm text-ivory">{d.title}</h3>
                <p className="text-body mt-3 text-ash">{d.body}</p>
              </article>
            </li>
          ))}
        </Reveal>
      </section>

      {/* FAQ — visible on the page, which is what the FAQPage markup describes */}
      <section className="relative z-10 shell py-12">
        <h2 className="text-heading text-ivory">Preguntas frecuentes</h2>
        <Reveal as="div" stagger className="mt-10 max-w-[70ch]">
          {service.faqs.map((f) => (
            <div key={f.q} className="border-b border-obsidian py-7">
              <h3 className="text-subheading text-ivory">{f.q}</h3>
              <p className="text-body mt-3 text-ash">{f.a}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Internal linking to the sibling services */}
      <section className="relative z-10 shell py-12">
        <h2 className="text-heading-sm text-ivory">Otros servicios</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/${o.slug}`}
                className="text-body inline-flex rounded-[var(--radius-nav)] border border-obsidian px-5 py-2.5 text-ash transition-colors hover:border-ivory/40 hover:text-ivory"
              >
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="relative z-10 shell py-16 md:py-24">
        <div className="card md:p-12">
          <h2 className="text-heading-lg max-w-[18ch] text-ivory">
            ¿Hablamos de tu proyecto?
          </h2>
          <p className="text-body-lg mt-5 max-w-[46ch] text-ash">
            Cuéntanos qué necesitas. Respondemos rápido y sin compromiso, con
            una propuesta clara.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              href={site.gmailCompose}
              variant="pill"
              external
              ariaLabel={`Escribir un correo a ${site.email} desde Gmail`}
            >
              Escríbenos
            </MagneticButton>
            <MagneticButton href={`tel:${site.phone}`} variant="ghost">
              {site.phoneDisplay}
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}
