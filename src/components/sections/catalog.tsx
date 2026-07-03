"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ShoppingCart, MessageCircle, Star, Filter, ArrowRight, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CATEGORIES,
  PRODUCTS,
  type Product,
  buildProductWhatsAppLink,
  getCategoryById,
} from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-store";
import { ProductDetailModal } from "@/components/shop/product-detail-modal";
import { useProducts } from "@/lib/use-products";

// ============================================================
// COMPONENTE: PriceDisplay
// Muestra el precio en USD o Bs según la moneda seleccionada
// Siempre muestra la conversión secundaria en gris más pequeño
// ============================================================
function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
}) {
  const currency = useCurrency((s) => s.currency);
  const rate = useCurrency((s) => s.rate);

  const formatVes = (v: number) => {
    // Formato venezolano: 1.234.567,89
    const parts = v.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  };

  const mainSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  const subSize = size === "lg" ? "text-sm" : "text-[10px]";

  if (currency === "USD") {
    return (
      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`${mainSize} font-extrabold text-emerald-700`}>
            ${price.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-gray-400">USD</span>
          {compareAtPrice && (
            <span className="text-xs text-gray-400 line-through ml-auto">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className={`text-gray-400 ${subSize}`}>
          ≈ Bs {formatVes(price * rate)}
        </div>
      </div>
    );
  }

  // Bs como moneda principal
  const ves = price * rate;
  const vesCompare = compareAtPrice ? compareAtPrice * rate : undefined;
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className={`${mainSize} font-extrabold text-emerald-700`}>
          Bs {formatVes(ves)}
        </span>
        {vesCompare && (
          <span className="text-xs text-gray-400 line-through ml-auto">
            Bs {formatVes(vesCompare)}
          </span>
        )}
      </div>
      <div className={`text-gray-400 ${subSize}`}>
        ≈ ${price.toFixed(2)} USD
      </div>
    </div>
  );
}

function ProductImage({ product, size = "md" }: { product: Product; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-24" : "h-44";
  const emoji = size === "sm" ? "text-2xl" : "text-5xl";
  // Imagen servida desde R2 vía proxy /api/img/[sku]
  // Sin marca de agua, sin bordes verdes, sin logo - solo la imagen del producto
  const imageUrl = `/api/img/${product.sku}`;
  return (
    <div
      className={`relative ${h} w-full overflow-hidden bg-white`}
    >
      {/* Imagen real desde R2 con object-contain (no deforma, muestra producto completo) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-contain"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Fondo placeholder (solo color, sin emoji) */}
      <span
        className="absolute inset-0 -z-10"
        style={{ background: `linear-gradient(135deg, ${product.imageColor}22 0%, ${product.imageColor}55 100%)` }}
      />
      {product.compareAtPrice && (
        <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold z-20">
          OFERTA
        </Badge>
      )}
      {product.isFeatured && (
        <Badge className="absolute top-2 right-2 gradient-ivmn text-white text-[10px] font-bold z-20">
          DESTACADO
        </Badge>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onOpenDetail,
}: {
  product: Product;
  onOpenDetail: (p: Product) => void;
}) {
  const addItem = useCart((s) => s.addItem);
  const category = getCategoryById(product.categoryId);
  const waLink = buildProductWhatsAppLink(product);

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden flex flex-col border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn-lg transition-all duration-300 bg-white cursor-pointer" onClick={() => onOpenDetail(product)}>
      <CardHeader className="p-0">
        <ProductImage product={product} />
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge
            variant="secondary"
            className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          >
            {category?.name || "Producto"}
          </Badge>
        </div>

        <CardTitle className="text-sm font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-700 transition-colors">
          {product.name}
        </CardTitle>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3 min-h-[2rem]">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.round(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-500">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
          {discount > 0 && (
            <span className="text-[11px] font-bold text-amber-600">
              Ahorra {discount}%
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2 flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            onClick={() => addItem(product)}
            className="gradient-ivmn text-white hover:opacity-95 shadow-ivmn text-xs h-9"
            size="sm"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Agregar
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs h-9"
          >
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              Cotizar
            </a>
          </Button>
        </div>
        <div className="text-[10px] text-gray-400 text-center w-full">
          SKU: {product.sku} · Stock: {product.stock} unid.
        </div>
      </CardFooter>
    </Card>
  );
}

export function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">(
    "featured"
  );
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Cargar productos desde API (catálogo base + overrides de D1)
  // Se actualiza automáticamente cuando el admin hace cambios
  const { products: allProducts } = useProducts();

  const openDetail = (p: Product) => {
    setDetailProduct(p);
    setDetailOpen(true);
  };

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term) ||
          p.longDescription.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.categoryId.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return list;
  }, [selectedCategory, searchTerm, sortBy, allProducts]);

  const totalProducts = allProducts.length;

  return (
    <section id="catalogo" className="py-8 lg:py-12 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            Tienda Online
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Explora nuestro catálogo con <strong>{totalProducts} productos</strong>{" "}
            en stock: cámaras de seguridad, kits CCTV, DVR/NVR, accesorios para
            PC, celulares y redes. Envíos a toda Venezuela. Cotiza por WhatsApp
            con respuesta inmediata.
          </p>
        </div>

        {/* Enlaces rápidos a categorías (landing pages) */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo/${cat.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Filters bar */}
        <div className="sticky top-16 lg:top-20 z-20 bg-white/95 backdrop-blur border border-emerald-100 rounded-2xl p-3 lg:p-4 shadow-sm mb-8 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Buscar por nombre, SKU (ej: IVMN-MOUS), marca o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-emerald-200 focus-visible:ring-emerald-500"
              aria-label="Buscar productos"
            />
          </div>

          {/* Category chips */}
          <div className="flex items-start gap-2 overflow-x-auto no-scrollbar pb-1">
            <Button
              size="sm"
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 ${
                selectedCategory === "all"
                  ? "gradient-ivmn text-white"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5 mr-1" />
              Todos ({totalProducts})
            </Button>
            {CATEGORIES.map((cat) => {
              const count = allProducts.filter((p) => p.categoryId === cat.id).length;
              return (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 ${
                    selectedCategory === cat.id
                      ? "gradient-ivmn text-white"
                      : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {cat.name} ({count})
                </Button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-500 text-xs">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}{" "}
              encontrado{filtered.length !== 1 ? "s" : ""}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs border border-emerald-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Ordenar productos"
            >
              <option value="featured">Destacados primero</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No encontramos productos
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta con otra búsqueda o categoría. Si no encuentras lo que
              necesitas, escríbenos por WhatsApp.
            </p>
            <Button
              asChild
              className="gradient-ivmn text-white"
            >
              <a
                href={`https://wa.me/584169726126?text=${encodeURIComponent(
                  "Hola *Inversiones Valencia Mundo Net*, no encuentro un producto en su catálogo y quisiera que me ayuden a conseguirlo. ¡Gracias!"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Pedir ayuda por WhatsApp
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((product, idx) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s` }}
              >
                <ProductCard product={product} onOpenDetail={openDetail} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de ficha de producto */}
      <ProductDetailModal
        product={detailProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </section>
  );
}

// ============================================================
// CATALOG HOME - Versión para la página de inicio
// SOLO muestra productos de cámaras y redes (no todos)
// Con enlaces a las categorías individuales
// ============================================================
const HOME_ALLOWED_CATEGORIES = ["cat-camaras", "cat-webcams", "cat-redes"];

export function CatalogHome() {
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (p: Product) => {
    setDetailProduct(p);
    setDetailOpen(true);
  };

  const { products: allProducts } = useProducts();

  // Filtrar SOLO productos de cámaras y redes
  const homeProducts = useMemo(() => {
    const filtered = allProducts.filter((p) =>
      HOME_ALLOWED_CATEGORIES.includes(p.categoryId)
    );
    // Ordenar: destacados primero, luego por rating
    return filtered.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return Number(b.isFeatured) - Number(a.isFeatured);
      return b.rating - a.rating;
    });
  }, [allProducts]);

  // Categorías para mostrar como tarjetas (solo las permitidas)
  const homeCategories = CATEGORIES.filter((c) =>
    HOME_ALLOWED_CATEGORIES.includes(c.id)
  );

  return (
    <section id="catalogo" className="py-8 lg:py-12 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            Catálogo de Productos
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Cámaras de Seguridad y Redes
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Explora nuestras categorías principales: cámaras de seguridad, cámaras web
            y redes. Envíos a toda Venezuela. Cotiza por WhatsApp con respuesta inmediata.
          </p>
        </div>

        {/* Tarjetas de categorías (enlaces a landing pages) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {homeCategories.map((cat) => {
            const count = allProducts.filter((p) => p.categoryId === cat.id).length;
            return (
              <Link
                key={cat.id}
                href={`/catalogo/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn-lg transition-all duration-300 bg-white p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl gradient-ivmn text-white flex items-center justify-center mx-auto mb-3 shadow-ivmn">
                  <Camera className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{cat.description}</p>
                <div className="text-sm font-bold text-emerald-700">
                  {count} producto{count !== 1 ? "s" : ""}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:gap-2 transition-all">
                  Ver categoría
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Productos destacados de cámaras y redes */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Productos destacados</h3>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:gap-2 transition-all"
          >
            Ver tienda completa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {homeProducts.slice(0, 8).map((product, idx) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s` }}
            >
              <ProductCard product={product} onOpenDetail={openDetail} />
            </div>
          ))}
        </div>

        {/* CTA a tienda */}
        <div className="mt-10 text-center">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 px-6 py-3 gradient-ivmn text-white rounded-xl font-bold shadow-ivmn-lg hover:opacity-95 transition-all"
          >
            Ver todos los productos (accesorios PC, celulares y más)
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Modal de ficha de producto */}
        <ProductDetailModal
          product={detailProduct}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </div>
    </section>
  );
}
