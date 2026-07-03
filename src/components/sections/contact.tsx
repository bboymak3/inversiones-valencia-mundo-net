"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  buildWhatsAppLink,
} from "@/data/catalog";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Por favor completa tu nombre y mensaje.");
      return;
    }
    const msg = `Hola *Inversiones Valencia Mundo Net*, soy *${form.name}*.

📞 Teléfono: ${form.phone || "No especificado"}
✉️ Email: ${form.email || "No especificado"}

Mensaje:
${form.message}`;
    window.open(buildWhatsAppLink(msg), "_blank");
    toast.success("Abriendo WhatsApp con tu mensaje...");
  };

  return (
    <section
      id="contacto"
      className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50/30 to-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            Contáctanos
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Estamos listos para ayudarte
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Escríbenos por WhatsApp para respuesta inmediata, o déjanos un
            mensaje y te contactaremos. Cotizaciones sin compromiso, asesoría
            técnica profesional y la mejor atención en Valencia, Venezuela.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact info (left) */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-5 w-5" fill="currentColor" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  WhatsApp (recomendado)
                </div>
                <div className="text-base font-bold text-gray-900">
                  {WHATSAPP_DISPLAY}
                </div>
                <div className="text-xs text-gray-500">
                  Respuesta inmediata en horario comercial
                </div>
              </div>
            </a>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-emerald-100">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Teléfono
                </div>
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="text-base font-bold text-gray-900 hover:text-emerald-700"
                >
                  {WHATSAPP_DISPLAY}
                </a>
                <div className="text-xs text-gray-500">Llamadas y mensajes</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-emerald-100">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Email
                </div>
                <a
                  href="mailto:ventas@inversionesvalencia.net"
                  className="text-base font-bold text-gray-900 hover:text-emerald-700 break-all"
                >
                  ventas@inversionesvalencia.net
                </a>
                <div className="text-xs text-gray-500">
                  Respondemos en menos de 24h
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-emerald-100">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Ubicación
                </div>
                <div className="text-base font-bold text-gray-900">
                  Barinas, Estado Barinas
                </div>
                <div className="text-xs text-gray-500">
                  Venezuela · Instalaciones a nivel nacional · Envíos a todo el país
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-emerald-100">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Horario
                </div>
                <div className="text-base font-bold text-gray-900">
                  Lun a Sáb: 8:00 AM - 6:00 PM
                </div>
                <div className="text-xs text-gray-500">
                  WhatsApp disponible 24/7 para urgencias
                </div>
              </div>
            </div>
          </div>

          {/* Form (right) */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white border-2 border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-ivmn"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Envíanos un mensaje
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Completa el formulario y te contactaremos por WhatsApp con la
                información que necesites.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-1.5">
                    Nombre *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre completo"
                    required
                    className="border-emerald-200 focus-visible:ring-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-1.5">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+58 4XX-XXXXXXX"
                    className="border-emerald-200 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="border-emerald-200 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="message" className="text-sm font-semibold text-gray-700 mb-1.5">
                  Mensaje *
                </Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Cuéntanos qué necesitas: tipo de cámara, cantidad, dirección aproximada para instalación, etc."
                  rows={5}
                  required
                  className="border-emerald-200 focus-visible:ring-emerald-500 resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-ivmn text-white hover:opacity-95 shadow-ivmn-lg h-12 text-base"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar por WhatsApp
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Al enviar este formulario, se abrirá WhatsApp con tu mensaje
                pre-llenado. No almacenamos tus datos.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
