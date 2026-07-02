"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/catalog";

export function WhatsAppFloating() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola *Inversiones Valencia Mundo Net*, quisiera información sobre sus productos y servicios de cámaras de seguridad. ¡Gracias!"
  )}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span className="hidden sm:inline-block bg-white shadow-lg rounded-full px-4 py-2 text-sm font-semibold text-gray-800 border border-emerald-100">
        Cotiza por WhatsApp
      </span>
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl animate-wa-pulse hover:scale-110 transition-transform">
        <MessageCircle className="h-7 w-7" fill="currentColor" />
      </span>
    </a>
  );
}
