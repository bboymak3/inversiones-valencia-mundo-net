"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Phone, Store, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/data/catalog";
import { CurrencyToggle } from "@/components/sections/currency-toggle";
import { useCurrency } from "@/lib/currency-store";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/servicios", label: "Servicios" },
  { href: "/dudas", label: "Dudas" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showWaButton, setShowWaButton] = useState(false);
  const totalItems = useCart((s) => s.totalItems());
  const toggleCart = useCart((s) => s.toggle);
  const rate = useCurrency((s) => s.rate);
  const rateSource = useCurrency((s) => s.rateSource);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      // Mostrar botón WA cuando el menú hamburguesa está abierto O después de scroll
      setShowWaButton(y > 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola *Inversiones Valencia Mundo Net*, quisiera información sobre instalación de cámaras de seguridad. ¡Gracias!"
  )}`;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-emerald-100"
            : "bg-white border-b border-emerald-50"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/logo.svg"
                alt="Inversiones Valencia Mundo Net - Instalación de cámaras de seguridad"
                className="h-9 lg:h-12 w-auto"
                width={180}
                height={48}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.href)
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Botón Tienda destacado */}
              <Button
                asChild
                className="hidden sm:inline-flex gradient-ivmn text-white hover:opacity-95 shadow-ivmn"
                size="sm"
              >
                <Link href="/tienda">
                  <Store className="h-4 w-4 mr-1.5" />
                  Tienda
                </Link>
              </Button>

              {/* Currency toggle */}
              <div className="hidden sm:flex items-center gap-2">
                <CurrencyToggle compact />
              </div>

              {/* Tasa BCV indicator */}
              <div className="hidden xl:flex flex-col items-end leading-tight text-right pl-2 border-l border-emerald-100">
                <span className="text-[10px] text-gray-400 uppercase">Tasa BCV</span>
                <span className="text-xs font-bold text-emerald-700">
                  Bs {rate.toFixed(2)}
                  {rateSource === "manual" && (
                    <span className="text-amber-500 ml-1" title="Tasa manual">⚙</span>
                  )}
                </span>
              </div>

              <a
                href={`tel:${WHATSAPP_DISPLAY.replace(/\s/g, "")}`}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                aria-label="Llamar por teléfono"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">{WHATSAPP_DISPLAY}</span>
              </a>

              <Button
                onClick={toggleCart}
                variant="outline"
                size="icon"
                className="relative border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                aria-label="Ver carrito"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </Button>

              <Button
                onClick={() => setMobileOpen(!mobileOpen)}
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-700"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-emerald-50 bg-white animate-fade-up">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-base font-medium rounded-md transition-colors ${
                    isActive(link.href)
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Tienda + Currency toggle para mobile */}
              <div className="flex items-center justify-between gap-3 pt-2 mt-2 border-t border-emerald-50">
                <Button
                  asChild
                  className="gradient-ivmn text-white flex-1"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/tienda">
                    <Store className="h-4 w-4 mr-1.5" />
                    Ver Tienda
                  </Link>
                </Button>
                <CurrencyToggle />
              </div>

              <a
                href={`tel:${WHATSAPP_DISPLAY.replace(/\s/g, "")}`}
                className="flex items-center gap-2 px-3 py-2.5 text-base font-semibold text-emerald-700"
              >
                <Phone className="h-4 w-4" />
                {WHATSAPP_DISPLAY}
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Botón flotante WhatsApp con icono de cámara - debajo del menú hamburguesa */}
      {/* Aparece después de hacer scroll, NO tapa el menú */}
      {showWaButton && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Cotizar instalación de cámaras de seguridad por WhatsApp"
          className="fixed top-20 lg:top-24 right-4 z-40 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-full shadow-ivmn-lg transition-all animate-fade-up"
          style={{ marginTop: "0.5rem" }}
        >
          <Camera className="h-5 w-5" />
          <span className="text-sm font-bold hidden sm:inline">Cotizar Cámaras</span>
        </a>
      )}
    </>
  );
}
