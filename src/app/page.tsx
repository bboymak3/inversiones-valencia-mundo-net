"use client";

import Link from "next/link";
import { Camera, ArrowRight, ShieldCheck, Truck, Wrench, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/data/catalog";

// Categorías destacadas para la home (enfoque en cámaras)
const CAMERA_CATEGORIES = [
  {
    title: "Cámaras de Seguridad",
    description: "Cámaras IP, WiFi, dome y bala para videovigilancia profesional. Acceso remoto desde tu celular 24/7.",
    href: "/catalogo/camaras",
    icon: Camera,
    featured: true,
    image: "📷",
    color: "#4CAF50",
  },
  {
    title: "Cámaras Web",
    description: "Cámaras web para videollamadas, streaming y reuniones online. Calidad HD y Full HD.",
    href: "/catalogo/webcams",
    icon: ShieldCheck,
    featured: true,
    image: "📹",
    color: "#2E7D32",
  },
  {
    title: "Redes y Conectividad",
    description: "Routers, switches, cables UTP y todo para tu infraestructura de red.",
    href: "/catalogo/redes",
    icon: ShieldCheck,
    featured: false,
    image: "📡",
    color: "#388E3C",
  },
  {
    title: "Audífonos y Accesorios",
    description: "Audífonos, mouse, teclados y más accesorios para PC y celular.",
    href: "/tienda",
    icon: ShieldCheck,
    featured: false,
    image: "🎧",
    color: "#5CB85C",
  },
];

const SERVICES = [
  {
    title: "Instalación de Cámaras de Seguridad",
    description: "Servicio profesional de instalación de cámaras CCTV, IP y WiFi para hogar, comercio e industria. Viajamos a toda Venezuela.",
    icon: Camera,
  },
  {
    title: "Mantenimiento de Sistemas CCTV",
    description: "Mantenimiento preventivo y correctivo para sistemas de videovigilancia existentes. Diagnóstico, limpieza y reconfiguración.",
    icon: Wrench,
  },
  {
    title: "Redes y Conectividad",
    description: "Instalación y configuración de redes WiFi y cableadas para hogar y oficina. Cableado UTP certificado.",
    icon: Truck,
  },
  {
    title: "Soporte Técnico de PC",
    description: "Mantenimiento, reparación y upgrades de computadoras. Diagnóstico gratuito y recuperación de datos.",
    icon: Wrench,
  },
];

export default function Home() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola *Inversiones Valencia Mundo Net*, quisiera información sobre instalación de cámaras de seguridad a nivel nacional. ¡Gracias!"
  )}`;

  return (
    <>
      {/* Hero Section - H1 principal */}
      <section className="relative overflow-hidden gradient-ivmn-soft py-16 lg:py-24">
        <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm mb-6">
              <ShieldCheck className="h-3.5 w-3.5" />
              Instalaciones a nivel nacional · Envíos a toda Venezuela
            </div>

            {/* H1 - Palabra clave principal */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-gray-900 mb-6">
              Instalación de{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                Cámaras de Seguridad
              </span>{" "}
              a Nivel Nacional
            </h1>

            <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              En <strong className="text-gray-900">Inversiones Valencia Mundo Net</strong> somos
              especialistas en instalación de cámaras de seguridad CCTV en Barinas, estado Barinas,
              y realizamos instalaciones a nivel nacional en toda Venezuela. También vendemos
              accesorios para computadoras y celulares con envíos a todo el país.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Button
                asChild
                size="lg"
                className="gradient-ivmn text-white hover:opacity-95 shadow-ivmn-lg px-6"
              >
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" fill="currentColor" />
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
                <Link href="/tienda">
                  Ver Tienda
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-emerald-100 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-700">Nacional</div>
                <div className="text-xs lg:text-sm text-gray-500">Instalaciones en toda Venezuela</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-700">24/7</div>
                <div className="text-xs lg:text-sm text-gray-500">Monitoreo remoto</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-700">Garantía</div>
                <div className="text-xs lg:text-sm text-gray-500">En todos los servicios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías de Cámaras - Lo principal de la home */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-3">
              CATEGORÍAS DESTACADAS
            </Badge>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Cámaras de Seguridad y Sistemas CCTV
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
              Explora nuestras categorías principales de cámaras de seguridad. Para ver el catálogo
              completo con accesorios para PC, celulares y redes, visita nuestra tienda.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAMERA_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={idx}
                  className="group overflow-hidden border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn-lg transition-all duration-300 bg-white animate-fade-up"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <Link href={cat.href}>
                    <div
                      className="aspect-[4/3] flex items-center justify-center text-6xl relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${cat.color}22 0%, ${cat.color}55 100%)`,
                      }}
                    >
                      <span className="relative z-10 drop-shadow-md group-hover:scale-110 transition-transform">
                        {cat.image}
                      </span>
                      {cat.featured && (
                        <Badge className="absolute top-2 right-2 gradient-ivmn text-white text-[10px]">
                          DESTACADO
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg gradient-ivmn text-white flex items-center justify-center">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight">
                          {cat.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {cat.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 group-hover:gap-2 transition-all">
                        Ver productos
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>

          {/* CTA a tienda completa */}
          <div className="mt-10 text-center">
            <Button asChild size="lg" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              <Link href="/tienda">
                Ver tienda completa (accesorios PC, celulares, redes)
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Servicios - H2 */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-3">
              NUESTROS SERVICIOS
            </Badge>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Servicios de Instalación y Soporte Técnico
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
              Realizamos instalaciones de cámaras de seguridad a nivel nacional en toda Venezuela.
              Viajamos a tu ubicación para garantizar un servicio profesional con garantía escrita.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Card
                  key={idx}
                  className="group overflow-hidden border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn-lg transition-all duration-300 bg-white animate-fade-up"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-ivmn text-white flex items-center justify-center mb-4 shadow-ivmn">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" className="gradient-ivmn text-white hover:opacity-95 shadow-ivmn-lg">
              <Link href="/servicios">
                Ver todos los servicios
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-20 gradient-ivmn text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl lg:text-3xl font-extrabold mb-4">
            ¿Listo para proteger lo que más valoras?
          </h2>
          <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">
            Cotiza tu instalación de cámaras de seguridad por WhatsApp. Atención inmediata,
            asesoría profesional sin compromiso, envíos a toda Venezuela.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold"
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" fill="currentColor" />
                Cotizar por WhatsApp
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <a href={`tel:${WHATSAPP_DISPLAY.replace(/\s/g, "")}`}>
                <Phone className="h-4 w-4" />
                {WHATSAPP_DISPLAY}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
