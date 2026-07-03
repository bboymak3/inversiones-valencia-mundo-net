"use client";

import { Camera, Wrench, Wifi, Monitor, ArrowRight } from "lucide-react";
import { SERVICES, buildWhatsAppLink } from "@/data/catalog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ICONS: Record<string, React.ElementType> = {
  camera: Camera,
  wrench: Wrench,
  wifi: Wifi,
  monitor: Monitor,
};

export function Services() {
  return (
    <section id="servicios" className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            Nuestros Servicios
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Soluciones integrales en seguridad y tecnología
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            En <strong>Inversiones Valencia Mundo Net</strong> no solo vendemos
            equipos: instalamos, configuramos y damos soporte técnico
            profesional. Cada servicio incluye garantía escrita y asesoría
            personalizada para que protections lo que más valoras con la mejor
            tecnología.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, idx) => {
            const Icon = ICONS[service.icon] || Camera;
            const waLink = buildWhatsAppLink(
              `Hola *Inversiones Valencia Mundo Net*, estoy interesado en el servicio: *${service.title}*. ¿Me pueden dar más información y una cotización? ¡Gracias!`
            );
            return (
              <Card
                key={service.id}
                className="group relative overflow-hidden border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn-lg transition-all duration-300 bg-white animate-fade-up"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-50 opacity-50 group-hover:scale-150 transition-transform duration-500" />

                <CardHeader className="relative pb-3">
                  <div className="w-12 h-12 rounded-xl gradient-ivmn text-white flex items-center justify-center mb-3 shadow-ivmn">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  <CardDescription className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {service.shortDescription}
                  </CardDescription>

                  <ul className="space-y-1.5 mb-4">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 group-hover:gap-2.5 transition-all"
                  >
                    Solicitar cotización
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
