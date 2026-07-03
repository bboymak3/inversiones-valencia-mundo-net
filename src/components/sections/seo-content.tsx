"use client";

import Link from "next/link";
import { ChevronDown, Camera, Wifi, Home, Shield, Truck, Wrench, Phone, MessageCircle } from "lucide-react";
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
    question: "¿Puedo comprar cámaras de seguridad y accederios por WhatsApp?",
    answer:
      "Sí, puedes cotizar todos nuestros productos por WhatsApp al +58 416-9726126. Atención inmediata en horario comercial. También vendemos accesorios para computadoras, celulares, redes y conectividad con envíos a toda Venezuela.",
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
              de seguridad CCTV en Barinas, estado Barinas, y realizamos instalaciones a nivel
              nacional en toda Venezuela. También vendemos cámaras de vigilancia, sistemas de
              videovigilancia, accesorios para computadoras y celulares con envíos a todo el país.
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

      {/* Sección de texto SEO */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-gray-900 mb-6 text-center">
            ¿Por qué instalar cámaras de seguridad?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
            <p>
              La <strong>instalación de cámaras de seguridad</strong> es la mejor inversión para
              proteger tu hogar, comercio o empresa. En Inversiones Valencia Mundo Net ofrecemos
              <strong> cámaras de seguridad WiFi</strong>, <strong>cámaras de vigilancia exterior</strong>,
              <strong> cámaras de seguridad inalámbricas</strong> y <strong>sistemas de videovigilancia</strong> completos
              con acceso remoto desde tu celular.
            </p>
            <p>
              Nuestras <strong>cámaras de seguridad para casa</strong> te permiten monitorear tu hogar
              desde cualquier lugar del mundo, 24 horas al día, 7 días a la semana. Con
              <strong> cámaras de seguridad conectadas al celular</strong>, recibirás notificaciones
              instantáneas cuando se detecte movimiento, pudiendo visualizar en tiempo real lo que
              sucede en tu propiedad.
            </p>
            <p>
              Realizamos <strong>instalación de cámaras de seguridad a nivel nacional</strong> en toda
              Venezuela. Viajamos a tu ubicación para garantizar un servicio profesional con garantía
              escrita. También ofrecemos <strong>envíos a toda Venezuela</strong> de cámaras de seguridad,
              kits CCTV, DVR, NVR, discos duros para videovigilancia y todos los accesorios que necesites.
            </p>
            <p>
              Contamos con <strong>cámaras de seguridad WiFi</strong> de las mejores marcas como TP-Link Tapo,
              Hikvision, Dahua, Ezviz, Xiaomi, V380 y Yoosee. Tenemos <strong>cámaras espía</strong>,
              <strong> mini cámaras de vigilancia</strong>, <strong>cámaras con panel solar</strong>,
              <strong> cámaras con batería recargable</strong>, <strong>cámaras 360</strong> y
              <strong> cámaras de videovigilancia</strong> para todo tipo de necesidades.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Button asChild size="lg" className="gradient-ivmn text-white shadow-ivmn-lg">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" fill="currentColor" />
                Cotizar Instalación de Cámaras
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-white">
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

          <div className="mt-10 text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h3 className="font-bold text-gray-900 mb-2">¿Tienes más preguntas?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Escríbenos por WhatsApp y te asesoramos sin compromiso
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
