"use client";

import { MessageCircle, Camera, Truck, ShieldCheck } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/catalog";

export function PromoBanner() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola *Inversiones Valencia Mundo Net*, vi su promoción en la web y quisiera más información sobre los kits de cámaras con instalación incluida. ¡Gracias!"
  )}`;

  return (
    <section className="relative overflow-hidden gradient-ivmn text-white py-12 lg:py-16">
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 30%, white 1.5px, transparent 1.5px)",
          backgroundSize: "40px 40px, 60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold mb-3">
              <Camera className="h-3.5 w-3.5" />
              PROMOCIÓN ESPECIAL · KITS DE SEGURIDAD
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight">
              Protege tu hogar o negocio con un Kit CCTV completo desde{" "}
              <span className="bg-white text-emerald-700 px-2 py-0.5 rounded-lg">$195</span>
            </h2>
            <p className="text-sm lg:text-base text-emerald-50 mb-5 max-w-2xl">
              Kits de 4 cámaras 1080p + DVR + disco duro 1TB + cables incluidos.
              Instalación profesional disponible. Cotiza hoy y recibe asesoría
              técnica sin compromiso.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-5 py-3 rounded-xl shadow-lg transition-colors text-sm"
              >
                <MessageCircle className="h-4 w-4" fill="currentColor" />
                Cotizar Ahora
              </a>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Garantía incluida</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4" />
                <span>Envío a toda Venezuela</span>
              </div>
            </div>
          </div>

          {/* Right CTA card */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hidden lg:block">
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-1">24/7</div>
              <div className="text-sm text-emerald-50 mb-4">
                Monitoreo remoto desde tu celular
              </div>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                  Visualización en vivo
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                  Notificaciones de movimiento
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                  Grabación continua 30 días
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                  Sin costos mensuales
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
