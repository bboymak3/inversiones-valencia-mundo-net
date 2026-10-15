import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Cloud,
  DollarSign,
  HandCoins,
  Lock,
  MessageCircle,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { buildWhatsAppLink } from "@/data/catalog";

const NEXUS_ONE_URL = "https://sistema.mundonet.app";

const FEATURES = [
  { icon: DollarSign, text: "Vende en $ y Bs con la tasa BCV del día" },
  { icon: Bell, text: "Controla el stock y recibe alertas" },
  { icon: HandCoins, text: "Fía con control: créditos, abonos y vencidos" },
  { icon: Wallet, text: "Cuadra la caja al cierre de cada día" },
  { icon: BarChart3, text: "Mira cuánto vendes y cuánto ganas" },
  { icon: Users, text: "Tus cajeros con usuario y permisos" },
];

const CHIPS = [
  { icon: Cloud, text: "En la nube, sin instalar" },
  { icon: DollarSign, text: "Dólares y bolívares" },
  { icon: Lock, text: "Datos separados por negocio" },
];

// Banner del sistema Nexus One de Mundo Net (antes de los productos)
export function NexusOne() {
  const waLink = buildWhatsAppLink(
    "Hola *Inversiones Valencia Mundo Net*, quiero mi punto de venta *Nexus One*. ¿Me dan información?"
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900 p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              NEXUS ONE · SISTEMA MUNDO NET
            </div>
            <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
              Vende, controla tu inventario y administra tu negocio{" "}
              <span className="text-emerald-300">desde un solo lugar</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm text-gray-300 lg:text-base">
              Nexus One te da tu propio punto de venta con precios en dólares y
              bolívares, crédito a clientes, cierre de caja y reportes. Sin
              instalar nada.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {CHIPS.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {text}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ios-press inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-400"
              >
                <MessageCircle className="h-4 w-4" fill="currentColor" />
                Quiero mi punto de venta
              </a>
              <a
                href={NEXUS_ONE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ios-press inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Entrar a mi negocio
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Para el propietario del negocio
            </p>
            <h3 className="mt-1 font-display text-xl font-bold">
              Todo lo que pasa en tu tienda, a la vista y en orden.
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-gray-200">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs text-gray-400">
              Un punto de venta completo, pensado para comercios en Venezuela ·{" "}
              <a href={NEXUS_ONE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                sistema.mundonet.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
