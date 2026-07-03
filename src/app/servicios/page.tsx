"use client";

import Link from "next/link";
import { Camera, Wrench, Wifi, Monitor, ArrowRight, MessageCircle, ShieldCheck, Clock, CreditCard, Truck, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WHATSAPP_NUMBER, buildWhatsAppLink } from "@/data/catalog";

const SERVICES = [
  {
    id: "srv-instalacion-camaras",
    title: "Instalación de Cámaras de Seguridad",
    slug: "instalacion-camaras-seguridad",
    shortDescription:
      "Servicio profesional de instalación de cámaras CCTV, IP y WiFi para hogar, comercio e industria. A nivel nacional.",
    longDescription:
      "Realizamos instalaciones llave en mano de sistemas de videovigilancia en toda Venezuela. Incluye asesoría técnica, cableado estructurado, configuración de DVR/NVR, acceso remoto desde tu celular y capacitación. Trabajamos con marcas de alta calidad y ofrecemos garantía escrita sobre la instalación. Viajamos a cualquier estado del país.",
    icon: Camera,
    features: [
      "Visita técnica de evaluación sin compromiso",
      "Cableado estructurado con canaletas PVC",
      "Configuración de acceso remoto 24/7",
      "Garantía escrita sobre la instalación",
      "Soporte técnico post-venta",
      "Viajamos a toda Venezuela",
    ],
  },
  {
    id: "srv-mantenimiento-cctv",
    title: "Mantenimiento de Sistemas CCTV",
    slug: "mantenimiento-cctv",
    shortDescription:
      "Mantenimiento preventivo y correctivo para sistemas de videovigilancia existentes.",
    longDescription:
      "Diagnóstico, limpieza, reconfiguración y reemplazo de componentes dañados en tus sistemas de cámaras. Aseguramos que tu sistema siga grabando con la máxima calidad y que el acceso remoto funcione sin interrupciones. Servicio disponible a nivel nacional.",
    icon: Wrench,
    features: [
      "Diagnóstico completo del sistema",
      "Limpieza de lentes y domos",
      "Actualización de firmware",
      "Reemplazo de componentes dañados",
      "Optimización de almacenamiento",
    ],
  },
  {
    id: "srv-redes-conectividad",
    title: "Redes y Conectividad",
    slug: "redes-conectividad",
    shortDescription:
      "Instalación y configuración de redes WiFi y cableadas para hogar y oficina.",
    longDescription:
      "Diseñamos e instalamos redes de datos confiables. Desde un router WiFi para tu casa hasta una red completa para tu negocio con switches, access points y cableado UTP certificado. Servicio profesional a nivel nacional.",
    icon: Wifi,
    features: [
      "Cableado UTP certificado Cat5e/Cat6",
      "Configuración de routers y access points",
      "Optimización de cobertura WiFi",
      "Switches administrables",
      "Soporte remoto y presencial",
    ],
  },
  {
    id: "srv-soporte-pc",
    title: "Soporte Técnico de PC",
    slug: "soporte-tecnico-pc",
    shortDescription:
      "Mantenimiento, reparación y upgrades de computadoras de escritorio y laptops.",
    longDescription:
      "Diagnóstico y reparación de PCs y laptops, instalación de software, limpieza de virus, upgrades de memoria RAM y discos SSD, recuperación de datos y más. Servicio rápido y confiable.",
    icon: Monitor,
    features: [
      "Diagnóstico gratuito",
      "Limpieza de virus y malware",
      "Upgrade de RAM y SSD",
      "Instalación de software",
      "Recuperación de datos",
    ],
  },
];

const VALUES = [
  { icon: ShieldCheck, title: "Garantía escrita", description: "Todos nuestros productos y servicios cuentan con garantía escrita." },
  { icon: Wrench, title: "Instalación profesional", description: "Técnicos certificados con años de experiencia. Viajamos a toda Venezuela." },
  { icon: Clock, title: "Respuesta rápida", description: "Cotizamos por WhatsApp en minutos. Soporte post-venta cuando lo necesites." },
  { icon: CreditCard, title: "Precios justos", description: "Trabajamos directamente con importadores. Pago en dólares, bolívares y métodos electrónicos." },
  { icon: Truck, title: "Envíos a toda Venezuela", description: "Despachamos a todo el país vía Zoom, Tealca y MRW. Coordinación el mismo día." },
  { icon: HeadphonesIcon, title: "Soporte post-venta", description: "Acompañamiento técnico, mantenimiento y upgrades cuando quieras expandir tu sistema." },
];

export default function ServiciosPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-ivmn-soft py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-3">
            NUESTROS SERVICIOS
          </Badge>
          <h1 className="font-display text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Servicios de Instalación de Cámaras de Seguridad
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Instalación de cámaras de seguridad CCTV a nivel nacional en Venezuela.
            Servicios profesionales con garantía escrita. También ofrecemos mantenimiento,
            redes y soporte técnico de PC.
          </p>
        </div>
      </section>

      {/* Servicios principales */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              const waLink = buildWhatsAppLink(
                `Hola *Inversiones Valencia Mundo Net*, estoy interesado en el servicio: *${service.title}*. ¿Me pueden dar más información y una cotización? ¡Gracias!`
              );
              return (
                <div
                  key={service.id}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${
                    idx % 2 === 1 ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  <div className={`lg:[direction:ltr] ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl gradient-ivmn text-white flex items-center justify-center shadow-ivmn">
                        <Icon className="h-7 w-7" />
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Servicio {idx + 1}</Badge>
                    </div>
                    <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.longDescription}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="gradient-ivmn text-white">
                      <a href={waLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" fill="currentColor" />
                        Solicitar cotización
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                  <div className={`lg:[direction:ltr] ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="aspect-[4/3] rounded-3xl gradient-ivmn-soft border border-emerald-100 flex items-center justify-center shadow-ivmn-lg">
                      <Icon className="h-32 w-32 text-emerald-600/40" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-800 mb-3">¿POR QUÉ ELEGIRNOS?</Badge>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Más de 500 clientes confían en nosotros
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              En Inversiones Valencia Mundo Net entendemos que la seguridad no es un lujo, es una necesidad.
              Combinamos productos de calidad, técnicos profesionales y atención personalizada.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className="border-emerald-100 hover:shadow-ivmn transition-all">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-ivmn text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-2xl lg:text-3xl font-extrabold mb-4">
            ¿Necesitas instalar cámaras de seguridad?
          </h2>
          <p className="text-emerald-50 mb-8">
            Cotiza por WhatsApp. Atención inmediata, asesoría profesional sin compromiso,
            instalaciones a nivel nacional.
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hola *Inversiones Valencia Mundo Net*, quisiera cotizar un servicio. ¡Gracias!"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" fill="currentColor" />
              Cotizar por WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
