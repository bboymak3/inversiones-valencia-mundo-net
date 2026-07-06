"use client";

import Link from "next/link";
import { MessageCircle, ChevronRight, Camera, Truck, Wrench, Shield } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WHATSAPP_NUMBER } from "@/data/catalog";

const FAQ_ITEMS = [
  {
    question: "¿Hacen instalación de cámaras de seguridad a nivel nacional en Venezuela?",
    answer:
      "Sí, en Inversiones Valencia Mundo Net realizamos la instalación de cámaras de seguridad CCTV a nivel nacional en toda Venezuela. Estamos ubicados en Barinas, estado Barinas, pero viajamos a cualquier estado del país para garantizar un servicio profesional con garantía escrita. Cotiza por WhatsApp +58 416-9726126 y coordina tu instalación.",
  },
  {
    question: "¿Qué tipos de cámaras de seguridad WiFi instalan y venden?",
    answer:
      "Vendemos e instalamos todo tipo de cámaras de seguridad WiFi: cámaras IP inalámbricas, cámaras WiFi exteriores, cámaras WiFi con panel solar, cámaras WiFi con batería recargable, cámaras 360 panorámicas, cámaras espía y mini cámaras de vigilancia. Todas con acceso remoto desde tu celular 24/7. Trabajamos con marcas como TP-Link Tapo, Hikvision, Ezviz, Xiaomi, V380 y Yoosee.",
  },
  {
    question: "¿Las cámaras de vigilancia se pueden ver desde el celular?",
    answer:
      "Sí, todas nuestras cámaras de vigilancia incluyen configuración de acceso remoto desde el celular. Podrás ver tus cámaras de seguridad en tiempo real desde cualquier lugar del mundo, 24 horas al día, 7 días a la semana. Recibirás notificaciones instantáneas cuando se detecte movimiento en tu propiedad. Compatible con iOS y Android.",
  },
  {
    question: "¿Cuál es la diferencia entre cámaras de videovigilancia y cámaras de seguridad?",
    answer:
      "Las cámaras de videovigilancia son sistemas completos que incluyen grabación continua (DVR/NVR + disco duro), mientras que las cámaras de seguridad pueden ser individuales (WiFi, IP) con almacenamiento en la nube o micro SD. Ambas opciones te permiten monitorear tu propiedad. Nosotros ofrecemos ambos sistemas: cámaras individuales WiFi y sistemas completos de videovigilancia con grabación 24/7.",
  },
  {
    question: "¿Qué cámaras de seguridad recomiendan para casa?",
    answer:
      "Para casa recomendamos cámaras de seguridad WiFi inalámbricas, ya que son fáciles de instalar y no requieren cableado. Las mejores opciones son: cámaras WiFi exteriores con visión nocturna para el perímetro, cámaras WiFi interiores con detección de movimiento para el interior, y cámaras con panel solar si no tienes acceso a corriente. Todas se ven desde el celular y tienen notificaciones push.",
  },
  {
    question: "¿Venden cámaras inalámbricas con batería recargable?",
    answer:
      "Sí, vendemos cámaras de seguridad inalámbricas con batería recargable de larga duración. Estas cámaras funcionan sin cableado de corriente, ideal para portones, fincas, casas de campo y lugares sin acceso eléctrico. Algunas incluyen panel solar para carga continua. Tienen detección de movimiento PIR, grabación y alertas en tiempo real. Autonomía de hasta 6 meses en modo standby.",
  },
  {
    question: "¿Las cámaras exteriores resisten la lluvia y el sol?",
    answer:
      "Sí, todas nuestras cámaras de seguridad exteriores tienen certificación IP65 o IP66, lo que significa que son resistentes al polvo, lluvia y condiciones climáticas extremas. Soportan temperaturas desde -30°C hasta 60°C. Las cámaras exteriores incluyen visión nocturna IR de largo alcance (hasta 30 metros) y están diseñadas para funcionar 24/7 en exteriores sin problemas.",
  },
  {
    question: "¿Cómo configuran las cámaras conectadas al celular?",
    answer:
      "Nuestro servicio de instalación incluye la configuración completa del acceso remoto desde tu celular. Descargamos la app correspondiente (TP-Link Tapo, Hik-Connect, EZViz, Mi Home, V380 Pro, Yoosee), configuramos la conexión WiFi, creamos tu cuenta, activamos las notificaciones de movimiento y te capacitamos para usar todas las funciones. Podrás ver tus cámaras desde cualquier lugar con internet.",
  },
  {
    question: "¿Hacen envíos a toda Venezuela? ¿Cuánto tarda?",
    answer:
      "Sí, hacemos envíos a toda Venezuela vía Zoom, Tealca y MRW. Despachamos el mismo día de la compra confirmada. Los tiempos de entrega son: 1-2 días hábiles para ciudades principales, 2-4 días hábiles para zonas remotas. También realizamos instalaciones de cámaras de seguridad a nivel nacional, viajando a tu ubicación para garantizar un servicio profesional con garantía escrita.",
  },
  {
    question: "¿Qué marcas de cámaras de seguridad trabajan?",
    answer:
      "Trabajamos con las mejores marcas de cámaras de seguridad del mercado: TP-Link Tapo (cámaras WiFi económicas y confiables), Hikvision (líder mundial en videovigilancia), Dahua (sistemas CCTV profesionales), Ezviz (cámaras WiFi con buena relación calidad-precio), Xiaomi (cámaras inteligentes 360), V380 (cámaras WiFi económicas), Yoosee (cámaras inalámbricas), y Jortan. Todas con garantía y soporte técnico.",
  },
];

export default function DudasPage() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola *Inversiones Valencia Mundo Net*, tengo una duda sobre cámaras de seguridad. ¡Gracias!"
  )}`;

  return (
    <>
      {/* Hero */}
      <section className="gradient-ivmn-soft py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-3">
            PREGUNTAS FRECUENTES
          </Badge>
          <h1 className="font-display text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Dudas, Preguntas y Respuestas
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre instalación de cámaras de seguridad,
            cámaras WiFi, videovigilancia, cámaras para casa, envíos a toda Venezuela
            y nuestros servicios a nivel nacional.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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

          {/* CTA */}
          <div className="mt-10 text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h2 className="font-bold text-gray-900 mb-2 text-lg">
              ¿Tienes más dudas?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Escríbenos por WhatsApp y te asesoramos sin compromiso. Atención inmediata
              en horario comercial.
            </p>
            <Button asChild className="gradient-ivmn text-white">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" fill="currentColor" />
                Consultar por WhatsApp
              </a>
            </Button>
          </div>

          {/* Quick links */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link
              href="/servicios"
              className="p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn transition-all bg-white text-center"
            >
              <Wrench className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-gray-900 text-sm">Nuestros Servicios</div>
              <div className="text-xs text-gray-500 mt-1">Instalación, mantenimiento, redes</div>
            </Link>
            <Link
              href="/tienda"
              className="p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn transition-all bg-white text-center"
            >
              <Camera className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-gray-900 text-sm">Ver Tienda</div>
              <div className="text-xs text-gray-500 mt-1">580 productos disponibles</div>
            </Link>
            <Link
              href="/contacto"
              className="p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn transition-all bg-white text-center"
            >
              <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-gray-900 text-sm">Contacto</div>
              <div className="text-xs text-gray-500 mt-1">Cotiza tu instalación</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
