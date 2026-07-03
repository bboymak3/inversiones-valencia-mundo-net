"use client";

import Link from "next/link";
import { ChevronDown, Camera, Wifi, Home, Shield, Truck, Wrench, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER } from "@/data/catalog";

const FAQ_ITEMS = [
  {
    question: "¿Hacen instalación de cámaras de seguridad a nivel nacional?",
    answer:
      "Sí, en Inversiones Valencia Mundo Net realizamos instalación de cámaras de seguridad CCTV a nivel nacional en toda Venezuela. Viajamos a tu ubicación para garantizar un servicio profesional con garantía escrita. Cotiza por WhatsApp +58 416-9726126.",
  },
  {
    question: "¿Qué tipos de cámaras de seguridad instalan?",
    answer:
      "Instalamos todo tipo de cámaras de seguridad: cámaras IP WiFi, cámaras CCTV analógicas, cámaras dome, cámaras bala para exterior, cámaras PTZ con zoom, cámaras espía, mini cámaras de vigilancia, cámaras de videovigilancia con acceso remoto desde el celular, y sistemas completos con DVR/NVR.",
  },
  {
    question: "¿Las cámaras de seguridad se pueden ver desde el celular?",
    answer:
      "Sí, todas nuestras cámaras de seguridad WiFi y IP incluyen configuración de acceso remoto desde tu celular. Podrás ver tus cámaras de vigilancia en tiempo real desde cualquier lugar del mundo, 24/7, recibiendo notificaciones de movimiento en tu teléfono.",
  },
  {
    question: "¿Hacen envíos a toda Venezuela?",
    answer:
      "Sí, hacemos envíos a toda Venezuela vía Zoom, Tealca y MRW. Despachamos el mismo día de la compra. También realizamos instalaciones de cámaras de seguridad a domicilio en todo el país, viajando a tu ubicación para garantizar un servicio profesional.",
  },
  {
    question: "¿Cuánto cuesta la instalación de cámaras de seguridad?",
    answer:
      "El costo de instalación de cámaras de seguridad depende de la cantidad de cámaras, el tipo de cableado, la distancia y la complejidad de la instalación. Ofrecemos cotizaciones gratuitas por WhatsApp. Contamos con kits de cámaras CCTV completos desde $195 que incluyen DVR, disco duro, cámaras y cables.",
  },
  {
    question: "¿Qué marcas de cámaras de seguridad venden?",
    answer:
      "Trabajamos con las mejores marcas de cámaras de seguridad: TP-Link Tapo, Hikvision, Dahua, Ezviz, Xiaomi, V380, Yoosee, entre otras. También vendemos cámaras WiFi inalámbricas, cámaras con panel solar, cámaras con batería recargable y sistemas de videovigilancia completos.",
  },
  {
    question: "¿Ofrecen garantía en la instalación de cámaras?",
    answer:
      "Sí, todas nuestras instalaciones de cámaras de seguridad incluyen garantía escrita. Si algo no funciona como debe, lo solucionamos sin excusas. También ofrecemos mantenimiento de sistemas CCTV existentes y soporte técnico post-venta.",
  },
  {
    question: "¿Puedo comprar cámaras de seguridad y accesorios por WhatsApp?",
    answer:
      "Sí, puedes cotizar todos nuestros productos por WhatsApp al +58 416-9726126. Atención inmediata en horario comercial. También vendemos accesorios para computadoras, celulares, redes y conectividad con envíos a toda Venezuela.",
  },
];

// Definiciones SEO de las 10 palabras clave principales (~300 chars cada una)
const KEYWORD_DEFINITIONS = [
  {
    keyword: "Instalación de Cámaras de Seguridad",
    definition:
      "La instalación de cámaras de seguridad es el servicio profesional de montaje y configuración de sistemas de videovigilancia CCTV en hogares, comercios e industrias. Incluye cableado estructurado, configuración de DVR/NVR, acceso remoto desde celular y capacitación. En Inversiones Valencia Mundo Net realizamos instalaciones a nivel nacional en toda Venezuela con garantía escrita.",
  },
  {
    keyword: "Cámaras de Seguridad WiFi",
    definition:
      "Las cámaras de seguridad WiFi son dispositivos de videovigilancia que se conectan a internet de forma inalámbrica, permitiendo monitorear tu propiedad desde el celular en tiempo real. No requieren cableado de video, solo conexión eléctrica. Ideales para casa, comercio y oficina. Ofrecen visión nocturna, detección de movimiento, notificaciones push y grabación en la nube o micro SD.",
  },
  {
    keyword: "Cámaras de Vigilancia",
    definition:
      "Las cámaras de vigilancia son equipos de seguridad diseñados para monitorear y grabar lo que ocurre en un lugar específico. Pueden ser analógicas (CCTV) o IP (WiFi). Se usan en hogares, comercios, industrias y espacios públicos. Las cámaras de vigilancia modernas incluyen visión nocturna, acceso remoto desde celular, detección de movimiento y grabación continua 24/7 para máxima seguridad.",
  },
  {
    keyword: "Cámaras de Videovigilancia",
    definition:
      "Las cámaras de videovigilancia son sistemas completos de seguridad que combinan cámaras, grabadores (DVR/NVR), discos duros y software de monitoreo. A diferencia de las cámaras individuales, los sistemas de videovigilancia graban continuamente y permiten revisar grabaciones de días anteriores. Son ideales para comercios, industrias y residencias que requieren seguridad profesional 24/7.",
  },
  {
    keyword: "Cámaras para Casa",
    definition:
      "Las cámaras para casa son dispositivos de seguridad diseñados específicamente para uso residencial. Incluyen cámaras WiFi interiores, cámaras exteriores resistentes al clima, cámaras con visión nocturna, cámaras con detección de movimiento y cámaras conectadas al celular. Permiten monitorear tu hogar desde cualquier lugar, recibir alertas y mantener a tu familia protegida las 24 horas.",
  },
  {
    keyword: "Cámaras Inalámbricas",
    definition:
      "Las cámaras inalámbricas son cámaras de seguridad que funcionan sin cableado de video ni de corriente. Utilizan baterías recargables de larga duración (hasta 6 meses) y se conectan vía WiFi. Son ideales para lugares sin acceso eléctrico: portones, fincas, casas de campo. Algunas incluyen panel solar para carga continua. Tienen detección de movimiento PIR y grabación con alertas.",
  },
  {
    keyword: "Cámaras Exteriores",
    definition:
      "Las cámaras exteriores son cámaras de seguridad diseñadas para funcionar en exteriores, resistentes a lluvia, polvo y sol (certificación IP65/IP66). Incluyen visión nocturna IR de largo alcance (hasta 30 metros), soportan temperaturas extremas (-30°C a 60°C) y ofrecen grabación 24/7. Son ideales para perímetros, patios, entradas, estacionamientos y áreas externas de tu propiedad.",
  },
  {
    keyword: "Cámaras Conectadas al Celular",
    definition:
      "Las cámaras conectadas al celular son cámaras de seguridad que se visualizan y controlan desde tu smartphone mediante una aplicación. Permiten ver en tiempo real, recibir notificaciones de movimiento, hablar a través de la cámara (audio bidireccional), grabar y compartir videos. Compatible con iOS y Android. Solo necesitas conexión a internet para monitorear tu propiedad desde cualquier lugar.",
  },
  {
    keyword: "Instalación a Nivel Nacional",
    definition:
      "La instalación a nivel nacional es nuestro servicio de instalación de cámaras de seguridad CCTV en toda Venezuela. Aunque estamos ubicados en Barinas, estado Barinas, viajamos a cualquier estado del país para realizar instalaciones profesionales con garantía escrita. Incluye visita técnica, cableado, configuración, acceso remoto y capacitación. Cotiza por WhatsApp +58 416-9726126.",
  },
  {
    keyword: "Envíos a Toda Venezuela",
    definition:
      "Los envíos a toda Venezuela son nuestro servicio de despacho nacional de cámaras de seguridad, accesorios para PC, celulares y redes. Despachamos el mismo día vía Zoom, Tealca y MRW. Tiempos de entrega: 1-2 días hábiles para ciudades principales, 2-4 días para zonas remotas. Coordinación inmediata al confirmar tu compra. Cotiza por WhatsApp +58 416-9726126.",
  },
];

const SERVICES_INFO = [
  {
    icon: Camera,
    title: "Instalación de Cámaras de Seguridad",
    description:
      "Instalación profesional de cámaras de seguridad CCTV, IP y WiFi para hogar, comercio e industria. Sistemas de videovigilancia con acceso remoto desde tu celular 24/7. Instalaciones a nivel nacional en toda Venezuela.",
  },
  {
    icon: Wifi,
    title: "Cámaras WiFi Inalámbricas",
    description:
      "Cámaras de seguridad WiFi inalámbricas con conexión a internet. Visualiza tus cámaras de vigilancia desde el celular en tiempo real. Cámaras exteriores WiFi, cámaras con panel solar, cámaras con batería recargable.",
  },
  {
    icon: Shield,
    title: "Sistemas de Videovigilancia",
    description:
      "Sistemas completos de videovigilancia con DVR, NVR, discos duros para CCTV y cámaras de seguridad. Kits de cámaras CCTV listos para instalar con grabación 24/7 y acceso remoto.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento de CCTV",
    description:
      "Mantenimiento preventivo y correctivo de sistemas de cámaras de seguridad existentes. Diagnóstico, limpieza, reconfiguración y reemplazo de componentes de videovigilancia.",
  },
  {
    icon: Home,
    title: "Cámaras para Casa",
    description:
      "Cámaras de seguridad para casa: interiores, exteriores, WiFi, inalámbricas, con visión nocturna y detección de movimiento. Protege tu hogar con las mejores cámaras de vigilancia.",
  },
  {
    icon: Truck,
    title: "Envíos a Toda Venezuela",
    description:
      "Realizamos envíos a toda Venezuela vía Zoom, Tealca y MRW. También viajamos para realizar instalaciones de cámaras de seguridad a nivel nacional. Coordinación el mismo día de la compra.",
  },
];

const CAMERA_BRANDS = [
  { name: "TP-Link Tapo", description: "Cámaras WiFi económicas y confiables con app intuitiva" },
  { name: "Hikvision", description: "Líder mundial en videovigilancia profesional CCTV" },
  { name: "Dahua", description: "Sistemas CCTV profesionales de alta calidad" },
  { name: "Ezviz", description: "Cámaras WiFi con excelente relación calidad-precio" },
  { name: "Xiaomi", description: "Cámaras inteligentes 360 con IA y detección de movimiento" },
  { name: "V380", description: "Cámaras WiFi económicas con acceso remoto" },
  { name: "Yoosee", description: "Cámaras inalámbricas con batería recargable" },
  { name: "Jortan", description: "Cámaras de seguridad para hogar y comercio" },
];

export function SeoContent() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola *Inversiones Valencia Mundo Net*, quisiera información sobre instalación de cámaras de seguridad. ¡Gracias!"
  )}`;

  return (
    <>
      {/* Sección informativa SEO */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              Información
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Instalación de Cámaras de Seguridad a Nivel Nacional
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
              En Inversiones Valencia Mundo Net somos especialistas en la instalación de cámaras
              de seguridad CCTV. Estamos ubicados en <strong>Barinas, estado Barinas</strong>, pero
              realizamos <strong>instalaciones a nivel nacional</strong> en toda Venezuela y
              <strong> envíos a todo el país</strong>. También vendemos accesorios para computadoras
              y celulares.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_INFO.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-emerald-100 hover:shadow-ivmn transition-all bg-gradient-to-br from-white to-emerald-50/30"
                >
                  <div className="w-12 h-12 rounded-xl gradient-ivmn text-white flex items-center justify-center mb-4 shadow-ivmn">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{service.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Definiciones SEO - H2 por cada palabra clave */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              Guía de Cámaras de Seguridad
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Todo sobre Cámaras de Seguridad y Videovigilancia
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Conoce todo sobre cámaras de seguridad, instalación, tipos y características.
              Información especializada para proteger lo que más valoras.
            </p>
          </div>

          <div className="space-y-8">
            {KEYWORD_DEFINITIONS.map((item, idx) => (
              <div
                key={idx}
                className="p-6 lg:p-8 rounded-2xl bg-white border border-emerald-100 hover:shadow-ivmn transition-all"
              >
                <h3 className="font-display text-xl lg:text-2xl font-bold text-gray-900 mb-3 text-emerald-700">
                  {item.keyword}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" className="gradient-ivmn text-white shadow-ivmn-lg">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" fill="currentColor" />
                Cotizar Instalación de Cámaras
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Marcas de cámaras de seguridad */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              Marcas que Trabajamos
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Marcas de Cámaras de Seguridad
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              En Inversiones Valencia Mundo Net trabajamos con las mejores marcas de cámaras
              de seguridad del mercado. Todas con garantía, soporte técnico y repuestos disponibles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAMERA_BRANDS.map((brand, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn transition-all bg-gradient-to-br from-white to-emerald-50/20 text-center"
              >
                <div className="w-12 h-12 rounded-full gradient-ivmn text-white flex items-center justify-center mx-auto mb-3 shadow-ivmn">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{brand.name}</h3>
                <p className="text-xs text-gray-500">{brand.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              ¿Buscas una marca específica? Contáctanos y la conseguimos para ti.
            </p>
            <Button asChild variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" fill="currentColor" />
                Consultar marcas disponibles
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              Preguntas Frecuentes
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Preguntas Frecuentes sobre Cámaras de Seguridad
            </h2>
            <p className="text-gray-600">
              Resolvemos las dudas más comunes sobre instalación de cámaras de seguridad,
              videovigilancia y envíos a toda Venezuela.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-emerald-100 rounded-xl px-4 lg:px-6 overflow-hidden bg-white hover:border-emerald-200 transition-colors"
              >
                <AccordionTrigger className="text-left font-bold text-gray-900 hover:text-emerald-700 text-base lg:text-lg py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm lg:text-base leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">
              ¿Tienes más dudas? Visita nuestra página de{" "}
              <Link href="/dudas" className="text-emerald-700 font-semibold hover:underline">
                preguntas y respuestas completas
              </Link>
            </p>
            <Button asChild className="gradient-ivmn text-white">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" fill="currentColor" />
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
