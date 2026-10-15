"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  KeyRound,
  Store,
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

const OWNER_FEATURES = [
  { icon: DollarSign, text: "Vende en $ y Bs con la tasa BCV del día" },
  { icon: Bell, text: "Controla el stock y recibe alertas" },
  { icon: HandCoins, text: "Fía con control: créditos, abonos y vencidos" },
  { icon: Wallet, text: "Cuadra la caja al cierre de cada día" },
  { icon: BarChart3, text: "Mira cuánto vendes y cuánto ganas" },
  { icon: Users, text: "Tus cajeros con usuario y permisos" },
];

const ADMIN_FEATURES = [
  { icon: Store, text: "Entra al negocio que administras con tu usuario" },
  { icon: Users, text: "Crea cajeros y asigna sus permisos" },
  { icon: Bell, text: "Mantén productos, precios y stock al día" },
  { icon: Wallet, text: "Revisa ventas, caja y cierres del día" },
  { icon: HandCoins, text: "Lleva créditos y abonos de los clientes" },
  { icon: KeyRound, text: "Acceso seguro desde cualquier dispositivo" },
];

const PROFILES = {
  owner: {
    label: "Soy propietario de un negocio",
    title: "Para el propietario del negocio",
    subtitle: "Todo lo que pasa en tu tienda, a la vista y en orden.",
    features: OWNER_FEATURES,
  },
  admin: {
    label: "Soy administrador",
    title: "Para el administrador",
    subtitle: "Gestiona el día a día del negocio con orden y control.",
    features: ADMIN_FEATURES,
  },
} as const;

type Profile = keyof typeof PROFILES;

const CHIPS = [
  { icon: Cloud, text: "En la nube, sin instalar" },
  { icon: DollarSign, text: "Dólares y bolívares" },
  { icon: Lock, text: "Datos separados por negocio" },
];

// Banner del sistema Nexus One de Mundo Net (antes de los productos)
export function NexusOne() {
  const [profile, setProfile] = useState<Profile>("owner");
  const active = PROFILES[profile];
  const waLink = buildWhatsAppLink(
    "Hola *Inversiones Valencia Mundo Net*, quiero mi punto de venta *Nexus One*. ¿Me dan información?"
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              NEXUS ONE · SISTEMA MUNDO NET
            </div>
            <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
              Vende, controla tu inventario y administra tu negocio{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">desde un solo lugar</span>
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
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100"
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
                className="ios-press inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-violet-400"
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

          <div>
            <div
              role="tablist"
              aria-label="Elige tu perfil"
              className="grid grid-cols-2 gap-1 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10"
            >
              {(Object.keys(PROFILES) as Profile[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={profile === key}
                  onClick={() => setProfile(key)}
                  className={`ios-press rounded-xl px-3 py-2.5 text-xs font-bold transition-colors sm:text-sm ${
                    profile === key
                      ? "bg-violet-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {PROFILES[key].label}
                </button>
              ))}
            </div>

            <div role="tabpanel" className="mt-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
              <h3 className="font-display text-xl font-bold">{active.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{active.subtitle}</p>
              <ul className="mt-5 space-y-3">
                {active.features.map(({ text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-gray-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs text-gray-400">
                Un punto de venta completo, pensado para comercios en Venezuela ·{" "}
                <a href={NEXUS_ONE_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">
                  sistema.mundonet.app
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
