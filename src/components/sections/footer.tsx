"use client";

import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin, Clock, Camera, Monitor, Smartphone, Wifi, Headphones, MousePointer } from "lucide-react";
import {
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  CATEGORIES,
} from "@/data/catalog";

const FOOTER_CATEGORIES = [
  { name: "Cámaras de Seguridad", href: "/catalogo/camaras", icon: Camera },
  { name: "Cámaras Web", href: "/catalogo/webcams", icon: Camera },
  { name: "Audífonos", href: "/catalogo/audifonos", icon: Headphones },
  { name: "Mouse", href: "/catalogo/mouse", icon: MousePointer },
  { name: "Monitores", href: "/catalogo/monitores", icon: Monitor },
  { name: "Redes y Conectividad", href: "/catalogo/redes", icon: Wifi },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-3 inline-block mb-4">
              <img
                src="/logo.svg"
                alt="Inversiones Valencia Mundo Net"
                className="h-12 w-auto"
                width={180}
                height={48}
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              Especialistas en venta e instalación de cámaras de seguridad,
              accesorios para computadoras y celulares en Valencia, Venezuela.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" />
              Escríbenos
            </a>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categorías
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_CATEGORIES.map((cat, i) => (
                <li key={i}>
                  <Link
                    href={cat.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                  >
                    <cat.icon className="h-3.5 w-3.5 text-emerald-500" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services / Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/servicios" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                  Instalación de cámaras
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                  Mantenimiento CCTV
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                  Redes y conectividad
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                  Soporte técnico de PC
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                  Ver catálogo completo
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                  Solicitar cotización
                </Link>
              </li>
              <li>
                <Link href="/dudas" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <a
                  href="mailto:ventas@inversionesvalencia.net"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors break-all"
                >
                  ventas@inversionesvalencia.net
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Barinas, Estado Barinas<br />Venezuela · Instalaciones a nivel nacional
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Lun a Sáb: 8:00 AM - 6:00 PM<br />
                  <span className="text-emerald-400">WhatsApp 24/7</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-gray-500">
          <p>
            © {year} <span className="text-gray-300 font-semibold">Inversiones Valencia Mundo Net</span>. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Hecho con tecnología Cloudflare Pages + D1 + R2
          </p>
        </div>
      </div>
    </footer>
  );
}
