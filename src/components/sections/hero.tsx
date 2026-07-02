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
    <section
      id="inicio"
      className="relative overflow-hidden gradient-ivmn-soft"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: copy */}
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Especialistas en videovigilancia en Valencia, Venezuela
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-gray-900">
              Cámaras de Seguridad y{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Tecnología
              </span>{" "}
              para proteger lo que más valoras
            </h1>

            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-xl">
              En <strong className="text-gray-900">Inversiones Valencia Mundo Net</strong>{" "}
              vendemos e instalamos sistemas de cámaras de seguridad CCTV de alta
              calidad, accesorios para computadoras y celulares. Cotiza por
              WhatsApp y recibe asesoría profesional sin compromiso.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="gradient-ivmn text-white hover:opacity-95 shadow-ivmn-lg px-6"
              >
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Cotizar Instalación
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 px-6"
              >
                <Link href="#catalogo" className="flex items-center gap-2">
                  Ver Catálogo
                </Link>
              </Button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-100">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-700">
                  +500
                </div>
                <div className="text-xs lg:text-sm text-gray-500">
                  Instalaciones realizadas
                </div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-700">
                  24/7
                </div>
                <div className="text-xs lg:text-sm text-gray-500">
                  Monitoreo remoto
                </div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-700">
                  Garantía
                </div>
                <div className="text-xs lg:text-sm text-gray-500">
                  En todos los servicios
                </div>
              </div>
            </div>
          </div>

          {/* Right: visual */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 shadow-2xl overflow-hidden">
              {/* Camera SVG illustration */}
              <svg
                viewBox="0 0 400 300"
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="lensHero" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B5E20" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <radialGradient id="scanGrad" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#7CFF8B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7CFF8B" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Grid pattern */}
                <g stroke="rgba(255,255,255,0.07)" strokeWidth="1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" />
                  ))}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
                  ))}
                </g>

                {/* Scan radar */}
                <circle cx="200" cy="150" r="120" fill="url(#scanGrad)" opacity="0.6" />
                <circle cx="200" cy="150" r="80" fill="none" stroke="#7CFF8B" strokeWidth="1" strokeDasharray="3 6" opacity="0.5" />
                <circle cx="200" cy="150" r="40" fill="none" stroke="#7CFF8B" strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />

                {/* Security camera (large, central) */}
                <g transform="translate(140, 80)">
                  {/* Mounting bracket */}
                  <rect x="55" y="0" width="10" height="20" fill="#9CA3AF" />
                  <rect x="35" y="18" width="50" height="14" rx="2" fill="#6B7280" />
                  {/* Camera body */}
                  <rect x="20" y="32" width="100" height="60" rx="8" fill="#1F2937" stroke="#374151" strokeWidth="2" />
                  <rect x="20" y="32" width="100" height="60" rx="8" fill="url(#lensHero)" opacity="0.6" />
                  {/* Sun shield */}
                  <rect x="14" y="28" width="112" height="6" rx="2" fill="#111827" />
                  {/* Lens outer */}
                  <circle cx="70" cy="62" r="22" fill="#0A0E12" stroke="#374151" strokeWidth="1.5" />
                  <circle cx="70" cy="62" r="18" fill="url(#lensHero)" />
                  <circle cx="70" cy="62" r="12" fill="#0A0E12" />
                  <circle cx="70" cy="62" r="8" fill="#1B5E20" opacity="0.85" />
                  {/* Lens reflection */}
                  <circle cx="65" cy="57" r="3" fill="#A5D6A7" opacity="0.9" />
                  <circle cx="75" cy="66" r="1.5" fill="#E8F5E9" opacity="0.8" />
                  {/* LED */}
                  <circle cx="105" cy="45" r="2.5" fill="#7CFF8B">
                    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Brand text */}
                  <text x="70" y="84" textAnchor="middle" fill="#9CA3AF" fontSize="6" fontFamily="monospace">CCTV HD</text>
                </g>

                {/* Side mini cameras (silhouettes) */}
                <g transform="translate(20, 220)" opacity="0.4">
                  <rect x="0" y="0" width="40" height="22" rx="3" fill="#1B5E20" />
                  <circle cx="20" cy="11" r="7" fill="#000" />
                  <circle cx="20" cy="11" r="4" fill="#1B5E20" />
                </g>
                <g transform="translate(340, 220) rotate(15)" opacity="0.4">
                  <rect x="0" y="0" width="40" height="22" rx="3" fill="#1B5E20" />
                  <circle cx="20" cy="11" r="7" fill="#000" />
                  <circle cx="20" cy="11" r="4" fill="#1B5E20" />
                </g>

                {/* REC badge */}
                <g transform="translate(20, 20)">
                  <circle cx="6" cy="6" r="5" fill="#EF4444">
                    <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <text x="18" y="10" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">REC</text>
                </g>

                {/* Time stamp */}
                <text x="380" y="285" textAnchor="end" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">CAM 01 · LIVE</text>
              </svg>

              {/* Floating card overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Cotización inmediata por WhatsApp</div>
                    <div className="text-sm font-bold text-gray-900 truncate">{WHATSAPP_DISPLAY}</div>
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
