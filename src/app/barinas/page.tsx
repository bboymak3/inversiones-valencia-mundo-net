import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BARINAS_CAPITALES } from "@/data/barinas-capitales";

export default function BarinasLandingPage() {
  return (
    <main className="bg-gradient-to-b from-emerald-50 via-white to-white pb-20">
      <section className="gradient-ivmn-soft py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 shadow-sm backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Estado Barinas
            </div>
            <h1 className="font-display text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Instalación de cámaras de seguridad en cada capital del estado Barinas
            </h1>
            <p className="mt-4 text-base text-gray-600 lg:text-lg">
              Protección para hogares, negocios, fincas y comunidades en todas las capitales municipales del estado Barinas. Atención profesional y cotización rápida por WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {BARINAS_CAPITALES.map((capital) => (
            <Link
              key={capital.slug}
              href={`/barinas/${capital.slug}`}
              className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                <MapPin className="h-3.5 w-3.5" />
                {capital.municipio}
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                {capital.capital}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {capital.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-700">Ver landing</span>
                <ArrowRight className="h-4 w-4 text-emerald-700 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg shadow-emerald-100/50">
          <h2 className="font-display text-2xl font-bold text-gray-900 lg:text-3xl">
            ¿Necesitas instalar cámaras en tu municipio?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Cotiza hoy mismo por WhatsApp y recibe asesoría para proteger tu hogar, negocio o propiedad en Barinas.
          </p>
          <Button asChild className="gradient-ivmn mt-5 text-white">
            <Link href="https://wa.me/584220550136?text=Hola%20Inversiones%20Valencia%20Mundo%20Net%2C%20quiero%20instalar%20c%C3%A1maras%20de%20seguridad%20en%20mi%20municipio%20de%20Barinas.%20Necesito%20informaci%C3%B3n." target="_blank" rel="noopener noreferrer">
              Solicitar cotización
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
