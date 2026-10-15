import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BARINAS_CAPITALES } from "@/data/barinas-capitales";

// Sitios que atendemos en el estado Barinas, con link a cada landing
export function ZonasBarinas() {
  return (
    <section id="zonas" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <MapPin className="h-3.5 w-3.5" />
            Estamos en Barinas
          </div>
          <h2 className="font-display text-3xl font-extrabold text-gray-900 lg:text-4xl">
            Sitios que atendemos
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Instalamos cámaras de seguridad en todo el estado Barinas. Elige tu
            zona para ver el servicio y cotizar por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BARINAS_CAPITALES.map((zona) => (
            <Link
              key={zona.slug}
              href={`/barinas/${zona.slug}`}
              className="group flex items-center justify-between gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-tight text-gray-900">
                  {zona.capital}
                </span>
                <span className="mt-0.5 block text-xs leading-tight text-gray-500">
                  Mun. {zona.municipio}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/barinas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
          >
            Ver todas las zonas de Barinas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
