"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export const runtime = "edge";

import Link from "next/link";
import { Search, ShoppingCart, MessageCircle, Star, Filter, ArrowLeft, ChevronRight } from "lucide-react";
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
  getCategoryBySlug,
  WHATSAPP_NUMBER,
} from "@/data/catalog";
import { useCart } from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-store";
import { useProducts } from "@/lib/use-products";
import { ProductDetailModal } from "@/components/shop/product-detail-modal";

function PriceDisplay({
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

  if (currency === "USD") {
    return (
      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-extrabold text-emerald-700">
            ${price.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-gray-400">USD</span>
          {compareAtPrice && (
            <span className="text-xs text-gray-400 line-through ml-auto">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="text-[10px] text-gray-400">
          ≈ Bs {formatVes(price * rate)}
        </div>
      </div>
    );
  }

  const ves = price * rate;
  const vesCompare = compareAtPrice ? compareAtPrice * rate : undefined;
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xl font-extrabold text-emerald-700">
          Bs {formatVes(ves)}
        </span>
        {vesCompare && (
          <span className="text-xs text-gray-400 line-through ml-auto">
            Bs {formatVes(vesCompare)}
          </span>
        )}
      </div>
      <div className="text-[10px] text-gray-400">
        ≈ ${price.toFixed(2)} USD
      </div>
    </div>
  );
}

function ProductImage({ product }: { product: Product }) {
  const imageUrl = `/api/img/${product.sku}`;
  return (
    <div className="relative h-44 w-full overflow-hidden bg-white">
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
      <span
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, ${product.imageColor}22 0%, ${product.imageColor}55 100%)`,
        }}
      />
      {product.compareAtPrice && (
        <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold">
          OFERTA
        </Badge>
      )}
      {product.isFeatured && (
        <Badge className="absolute top-2 right-2 gradient-ivmn text-white text-[10px] font-bold">
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
    <Card
      className="group overflow-hidden flex flex-col border-emerald-100 hover:border-emerald-300 hover:shadow-ivmn-lg transition-all duration-300 bg-white cursor-pointer"
      onClick={() => onOpenDetail(product)}
    >
      <CardHeader className="p-0">
        <ProductImage product={product} />
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <Badge variant="secondary" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 mb-1.5 w-fit">
          {category?.name || "Producto"}
        </Badge>
        <CardTitle className="text-sm font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-700 transition-colors">
          {product.name}
        </CardTitle>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 min-h-[2rem]">
          {product.shortDescription}
        </p>
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

export default function CategoriaPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug as string;

  const { products: allProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const category = getCategoryBySlug(slug);

  const filtered = useMemo(() => {
    if (!category) return [];
    let list = allProducts.filter((p) => p.categoryId === category.id);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term)
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
  }, [allProducts, category, searchTerm, sortBy]);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoría no encontrada</h1>
          <Button asChild>
            <Link href="/tienda">Volver a la tienda</Link>
          </Button>
        </div>
      </div>
    );
  }

  const openDetail = (p: Product) => {
    setDetailProduct(p);
    setDetailOpen(true);
  };

  return (
    <section className="py-8 lg:py-12 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tienda" className="hover:text-emerald-700">Tienda</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-emerald-700 font-semibold">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/tienda")}
            className="mb-3 text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a la tienda
          </Button>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
            {category.name}
          </h1>
          <p className="text-gray-600 max-w-3xl">{category.description}</p>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur border border-emerald-100 rounded-2xl p-3 lg:p-4 shadow-sm mb-8 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Buscar por nombre, SKU o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-emerald-200 focus-visible:ring-emerald-500"
              aria-label="Buscar productos"
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-500 text-xs">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos productos</h3>
            <p className="text-gray-500 mb-4">Intenta con otra búsqueda o categoría.</p>
            <Button asChild className="gradient-ivmn text-white">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hola *Inversiones Valencia Mundo Net*, no encuentro un producto. ¡Gracias!"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
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

      <ProductDetailModal
        product={detailProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </section>
  );
}
