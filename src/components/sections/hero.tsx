"use client";

import Link from "next/link";
import { ShieldCheck, Camera, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/data/catalog";

export function Hero() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola *Inversiones Valencia Mundo Net*, quisiera una cotización para instalar cámaras de seguridad. ¡Gracias!"
  )}`;

  return (
    <section id="inicio" className="relative overflow-hidden gradient-ivmn-soft">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Especialistas en videovigilancia en Valencia, Venezuela
            </div>

            <h1 className="font-display text-3xl font-extrabold leading-[1.1] text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl">
              Cámaras de Seguridad y{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Tecnología
              </span>{" "}
              para proteger lo que más valoras
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-gray-600 lg:text-lg">
              En <strong className="text-gray-900">Inversiones Valencia Mundo Net</strong>{" "}
              vendemos e instalamos sistemas de cámaras de seguridad CCTV de alta
              calidad, accesorios para computadoras y celulares. Cotiza por
              WhatsApp y recibe asesoría profesional sin compromiso.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gradient-ivmn px-6 text-white shadow-ivmn-lg hover:opacity-95">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Cotizar Instalación
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="border-emerald-300 px-6 text-emerald-800 hover:bg-emerald-50">
                <Link href="#catalogo" className="flex items-center gap-2">
                  Ver Catálogo
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-emerald-100 pt-6">
              <div>
                <div className="text-2xl font-bold text-emerald-700 lg:text-3xl">+500</div>
                <div className="text-xs text-gray-500 lg:text-sm">Instalaciones realizadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700 lg:text-3xl">24/7</div>
                <div className="text-xs text-gray-500 lg:text-sm">Monitoreo remoto</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700 lg:text-3xl">Garantía</div>
                <div className="text-xs text-gray-500 lg:text-sm">En todos los servicios</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white/10 shadow-2xl ring-1 ring-emerald-200/50">
              <img
                src="/brand/banner-mundonet.jpg"
                alt="Banner de instalación de cámaras de seguridad de Inversiones Valencia Mundo Net"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Phone className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Cotización inmediata por WhatsApp</div>
                    <div className="truncate text-sm font-bold text-gray-900">{WHATSAPP_DISPLAY}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
