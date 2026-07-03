"use client";

import { ShieldCheck, Clock, Wrench, CreditCard, Truck, HeadphonesIcon } from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Garantía escrita",
    description:
      "Todos nuestros productos y servicios cuentan con garantía escrita. Si algo no funciona como debe, lo solucionamos sin excusas.",
  },
  {
    icon: Wrench,
    title: "Instalación profesional",
    description:
      "Técnicos certificados con años de experiencia en videovigilancia y redes. Cableado limpio, configuración completa y capacitación al cliente.",
  },
  {
    icon: Clock,
    title: "Respuesta rápida",
    description:
      "Cotizamos por WhatsApp en minutos. Visitas técnicas el mismo día en Valencia y Carabobo. Soporte post-venta cuando lo necesites.",
  },
  {
    icon: CreditCard,
    title: "Precios justos",
    description:
      "Trabajamos directamente con importadores para ofrecerte precios competitivos. Pago en dólares, bolívares y métodos electrónicos.",
  },
  {
    icon: Truck,
    title: "Envíos a todo el país",
    description:
      "Despachamos a toda Venezuela vía Zoom, Tealca y MRW. Coordinación de envíos el mismo día de la compra.",
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte post-venta",
    description:
      "No te dejamos solo después de la compra. Acompañamiento técnico, mantenimiento y upgrades cuando quieras expandir tu sistema.",
  },
];

export function WhyUs() {
  return (
    <section id="marcas" className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            ¿Por qué elegirnos?
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Más de 500 clientes confían en nosotros
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            En <strong>Inversiones Valencia Mundo Net</strong> entendemos que la
            seguridad no es un lujo, es una necesidad. Por eso combinamos
            productos de calidad, técnicos profesionales y atención personalizada
            para que tu inversión en tecnología realmente proteja lo que más
            valoras.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div
                key={idx}
                className="group flex gap-4 p-5 rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/30 animate-fade-up"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:gradient-ivmn group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
