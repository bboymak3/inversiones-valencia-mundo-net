"use client";

import { useState } from "react";
import {
  X,
  ShoppingCart,
  MessageCircle,
  Star,
  Tag,
  Box,
  Shield,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  type Product,
  buildProductWhatsAppLink,
  getCategoryById,
} from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-store";
import { toast } from "sonner";

function ModalPriceDisplay({
  price,
  compareAtPrice,
}: {
  price: number;
  compareAtPrice?: number;
}) {
  const currency = useCurrency((s) => s.currency);
  const rate = useCurrency((s) => s.rate);

  const formatVes = (v: number) => {
    const parts = v.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  };

  const discount = compareAtPrice
    ? Math.round((1 - price / compareAtPrice) * 100)
    : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-4xl font-extrabold text-emerald-700">
          {currency === "USD" ? `$${price.toFixed(2)}` : `Bs ${formatVes(price * rate)}`}
        </span>
        <span className="text-sm font-medium text-gray-400">
          {currency === "USD" ? "USD" : "Bs"}
        </span>
        {compareAtPrice && (
          <span className="text-base text-gray-400 line-through">
            {currency === "USD"
              ? `$${compareAtPrice.toFixed(2)}`
              : `Bs ${formatVes(compareAtPrice * rate)}`}
          </span>
        )}
        {discount > 0 && (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
            -{discount}%
          </Badge>
        )}
      </div>
      <div className="text-sm text-gray-500">
        ≈ {currency === "USD" ? `Bs ${formatVes(price * rate)}` : `$${price.toFixed(2)} USD`}
      </div>
    </div>
  );
}

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addItem = useCart((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const category = getCategoryById(product.categoryId);
  const waLink = buildProductWhatsAppLink(product);
  const imageUrl = `/api/img/${product.sku}`;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} × ${product.name} agregado al carrito`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0">
        <DialogClose className="absolute right-3 top-3 z-30 rounded-full bg-white/90 hover:bg-white shadow-md p-1.5">
          <X className="h-4 w-4" />
        </DialogClose>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Imagen izquierda */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[500px] bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 gradient-ivmn z-20" />
            <div className="absolute top-0 left-0 w-12 h-12 rounded-br-xl gradient-ivmn z-20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">IVMN</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-6"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-30">
              {product.imageEmoji}
            </div>
            {product.compareAtPrice && (
              <Badge className="absolute top-3 left-16 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold z-20">
                OFERTA
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="absolute top-3 right-3 gradient-ivmn text-white text-xs font-bold z-20 flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                DESTACADO
              </Badge>
            )}
          </div>

          {/* Info derecha */}
          <div className="p-6 lg:p-8 flex flex-col">
            <DialogHeader className="p-0 space-y-0 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  {category?.name || "Producto"}
                </Badge>
                <Badge variant="outline" className="text-xs font-mono text-gray-500">
                  SKU: {product.sku}
                </Badge>
              </div>
              <DialogTitle className="text-xl lg:text-2xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} · {product.reviewCount} reseñas
              </span>
            </div>

            {/* Precio */}
            <div className="mb-5 pb-5 border-b border-gray-100">
              <ModalPriceDisplay
                price={product.price}
                compareAtPrice={product.compareAtPrice}
              />
            </div>

            {/* Descripción */}
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Descripción</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.longDescription}
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5 text-sm">
              {product.stock > 0 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">
                    Disponible ({product.stock} en stock)
                  </span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-red-600 font-semibold">Agotado</span>
                </>
              )}
            </div>

            {/* Cantidad + acciones */}
            <div className="space-y-3 mt-auto">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-emerald-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-emerald-50 text-lg font-bold"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-base font-bold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-emerald-50 text-lg font-bold"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 gradient-ivmn text-white hover:opacity-95 shadow-ivmn"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar ({quantity})
                </Button>
              </div>

              <Button
                asChild
                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white h-12"
              >
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" fill="currentColor" />
                  Cotizar por WhatsApp
                </a>
              </Button>
            </div>

            {/* Garantías */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-gray-100">
              <div className="text-center">
                <Shield className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-[10px] font-semibold text-gray-600">Garantía</div>
              </div>
              <div className="text-center">
                <Truck className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-[10px] font-semibold text-gray-600">Envío nacional</div>
              </div>
              <div className="text-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-[10px] font-semibold text-gray-600">Calidad</div>
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones */}
        {product.specs.length > 0 && (
          <div className="border-t border-gray-100 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Box className="h-4 w-4 text-emerald-600" />
              Especificaciones
            </h3>
            <Accordion type="single" collapsible defaultValue="specs">
              <AccordionItem value="specs">
                <AccordionTrigger className="text-sm font-semibold text-gray-700">
                  Ver detalles técnicos
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid sm:grid-cols-2 gap-2 pt-2">
                    {product.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 px-3 bg-emerald-50/50 rounded-lg text-sm"
                      >
                        <span className="text-gray-600">{spec.label}</span>
                        <span className="font-semibold text-gray-900 text-right">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="border-t border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4 text-emerald-600" />
              Etiquetas
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
