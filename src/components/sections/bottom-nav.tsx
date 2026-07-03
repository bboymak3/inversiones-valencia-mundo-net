"use client";

import { Store, MessageCircle, Home } from "lucide-react";
import { useCurrency } from "@/lib/currency-store";
import { WHATSAPP_NUMBER } from "@/data/catalog";

// Nav bar inferior fija con Tienda + WhatsApp
// Visible en mobile y tablet (en desktop se oculta)
export function BottomNav() {
  const currency = useCurrency((s) => s.currency);
  const setCurrency = useCurrency((s) => s.setCurrency);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola *Inversiones Valencia Mundo Net*, quisiera información sobre sus productos y servicios. ¡Gracias!"
  )}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToCatalog = () => {
    // Ir a la página de tienda
    window.location.href = "/tienda";
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-emerald-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Navegación inferior"
    >
      <div className="grid grid-cols-3 h-16 max-w-md mx-auto">
        {/* Inicio */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:text-emerald-700 active:bg-emerald-50 transition-colors"
          aria-label="Ir al inicio"
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Inicio</span>
        </button>

        {/* Tienda */}
        <button
          onClick={scrollToCatalog}
          className="flex flex-col items-center justify-center gap-0.5 gradient-ivmn text-white relative -mt-3 mx-auto w-14 h-14 rounded-full shadow-ivmn-lg active:scale-95 transition-transform"
          aria-label="Ver tienda y catálogo"
        >
          <Store className="h-6 w-6" />
          <span className="text-[10px] font-bold absolute -bottom-5 left-1/2 -translate-x-1/2 text-emerald-700 whitespace-nowrap">
            Tienda
          </span>
        </button>

        {/* WhatsApp */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:text-[#25D366] active:bg-emerald-50 transition-colors"
          aria-label="Escríbenos por WhatsApp"
        >
          <MessageCircle className="h-5 w-5" fill="currentColor" />
          <span className="text-[10px] font-semibold">WhatsApp</span>
        </a>
      </div>
      {/* Safe area iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
