import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Camera, CheckCircle2, MapPin, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BARINAS_CAPITALES } from "@/data/barinas-capitales";
import { buildWhatsAppLink } from "@/data/catalog";

export async function generateStaticParams() {
  return BARINAS_CAPITALES.map((capital) => ({ slug: capital.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const capital = BARINAS_CAPITALES.find((item) => item.slug === slug);

  if (!capital) {
    return {
      title: "Municipio de Barinas",
    };
  }

  return {
    title: capital.title,
    description: capital.description,
    alternates: {
      canonical: `https://inversiones-valencia-mundo-net.pages.dev/barinas/${capital.slug}`,
    },
  };
}

export default async function BarinasCapitalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const capital = BARINAS_CAPITALES.find((item) => item.slug === slug);

  if (!capital) {
    notFound();
  }

  const whatsappLink = buildWhatsAppLink(capital.whatsappMessage);

  return (
    <main className="bg-gradient-to-b from-emerald-50 via-white to-white pb-20">
      <section className="gradient-ivmn-soft py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 shadow-sm backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            {capital.municipio}
          </div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Instalación de cámaras de seguridad en {capital.capital}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-600 lg:text-lg">
            {capital.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="gradient-ivmn text-white">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" fill="currentColor" />
                Cotizar en {capital.capital}
              </a>
            </Button>
            <Button asChild variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-50">
              <Link href="/barinas">Ver todas las capitales</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Camera className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">Instalación profesional</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Instalamos cámaras IP, WiFi, analógicas y sistemas CCTV con configuración correcta y cobertura inteligente en {capital.capital}.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">Seguridad confiable</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Protección para hogares, comercios, fincas, condominios y empresas con equipos de calidad y garantía en la instalación.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">Cobertura regional</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Atendemos a todo el estado Barinas y desplazamos personal técnico para instalaciones en {capital.capital} y sus alrededores.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-lg shadow-emerald-100/50">
          <h2 className="font-display text-2xl font-bold text-gray-900 lg:text-3xl">
            ¿Por qué elegirnos en {capital.capital}?
          </h2>
          <ul className="mt-6 space-y-4 text-gray-700">
            {[
              "Asesoría personalizada según el tipo de propiedad o negocio.",
              "Instalación de cámaras CCTV, IP y WiFi con configuración remota.",
              "Mantenimiento y soporte técnico posterior a la instalación.",
              "Atención rápida por WhatsApp y cotización sin compromiso.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm sm:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className="gradient-ivmn text-white">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Solicitar cotización ahora
              </a>
            </Button>
            <Button asChild variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-50">
              <Link href="/servicios">
                Ver servicios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
