"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Phone, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { WHATSAPP_DISPLAY } from "@/data/catalog";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#marcas", label: "Por qué elegirnos" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCart((s) => s.totalItems());
  const toggleCart = useCart((s) => s.toggle);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-emerald-100"
          : "bg-white border-b border-emerald-50"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.svg"
              alt="Inversiones Valencia Mundo Net"
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
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
                className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
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
  );
}
