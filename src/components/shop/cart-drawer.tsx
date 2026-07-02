"use client";

import { useEffect } from "react";
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";
import { buildCartWhatsAppLink } from "@/data/catalog";

export function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, subtotal } = useCart();

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const waLink = buildCartWhatsAppLink(items);
  const total = subtotal();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-white">
        <SheetHeader className="px-5 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
              Tu Cotización
              <Badge className="gradient-ivmn text-white ml-1">
                {items.length} ítem{items.length !== 1 ? "s" : ""}
              </Badge>
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500"
              onClick={() => setOpen(false)}
              aria-label="Cerrar carrito"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <ShoppingCart className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Tu cotización está vacía
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-xs">
              Explora nuestro catálogo y agrega los productos que necesites.
              Luego envías tu cotización completa por WhatsApp.
            </p>
            <Button
              onClick={() => setOpen(false)}
              className="gradient-ivmn text-white"
            >
              Ver catálogo
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 border border-emerald-100 rounded-xl bg-white hover:bg-emerald-50/30 transition-colors"
                >
                  {/* Mini image */}
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${item.product.imageColor}22 0%, ${item.product.imageColor}55 100%)`,
                    }}
                  >
                    {item.product.imageEmoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="text-[10px] text-gray-500 mb-2">
                      SKU: {item.product.sku}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-emerald-200 text-emerald-700 hover:bg-emerald-50 p-0"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-emerald-200 text-emerald-700 hover:bg-emerald-50 p-0"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-emerald-700">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          ${item.product.price.toFixed(2)} c/u
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="px-5 py-4 border-t border-emerald-100 bg-gradient-to-r from-white to-emerald-50/50">
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Productos:</span>
                  <span className="font-semibold text-gray-900">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} unid.
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Total estimado:
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    ${total.toFixed(2)}{" "}
                    <span className="text-sm font-medium text-gray-500">USD</span>
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  💡 El total es referencial. La cotización final se confirma
                  por WhatsApp incluyendo disponibilidad y costo de envío a
                  tu ubicación.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white h-12 text-base shadow-lg"
                >
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" fill="currentColor" />
                    Enviar Cotización por WhatsApp
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setOpen(false)}
                >
                  Seguir explorando
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
