import { ArrowUpRight, LayoutDashboard, Sparkles } from "lucide-react";

const NEXUS_ONE_URL = "https://sistema.mundonet.app";

// Banner del sistema Nexus One de Mundo Net (antes de los productos)
export function NexusOne() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900 p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative grid items-center gap-6 lg:grid-cols-3 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              NUEVO · SISTEMA MUNDO NET
            </div>
            <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
              Nexus One: el sistema que{" "}
              <span className="text-emerald-300">Mundo Net</span> ofrece para tu negocio
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-gray-300 lg:text-base">
              Nexus One es la plataforma de gestión de Mundo Net para organizar y
              controlar tu negocio desde un solo lugar, en la web y desde tu
              celular. Fácil de usar, en la nube y con el respaldo y soporte de
              nuestro equipo en Barinas.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <a
              href={NEXUS_ONE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ios-press inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-400"
            >
              <LayoutDashboard className="h-4 w-4" />
              Conocer Nexus One
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <span className="text-xs text-gray-400">sistema.mundonet.app</span>
          </div>
        </div>
      </div>
    </section>
  );
}
