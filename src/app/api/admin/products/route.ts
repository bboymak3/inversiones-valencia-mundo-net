import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, CATEGORIES, type Product } from "@/data/catalog";

// API para listar productos combinando catálogo base + overrides de D1 + custom de D1
// GET: lista todos los productos con overrides aplicados
// Soporta: ?search=, ?category=, ?limit=, ?offset=

export const runtime = "edge";

type ProductOverride = {
  sku: string;
  name?: string;
  category_id?: string;
  price?: number;
  compare_at_price?: number;
  stock?: number;
  is_featured?: number;
  brand?: string;
  short_description?: string;
  long_description?: string;
  image_emoji?: string;
  image_color?: string;
  image_r2_key?: string;
  tags?: string;
  is_deleted?: number;
};

type CustomProduct = {
  id: string;
  sku: string;
  name: string;
  category_id: string;
  price: number;
  compare_at_price: number | null;
  currency: string;
  stock: number;
  is_featured: number;
  brand: string | null;
  model: string | null;
  short_description: string | null;
  long_description: string | null;
  image_emoji: string | null;
  image_color: string | null;
  image_r2_key: string | null;
  specs: string | null;
  tags: string | null;
  rating: number;
  review_count: number;
  slug: string | null;
  is_active: number;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const categoryId = url.searchParams.get("category") || "";
  const limit = parseInt(url.searchParams.get("limit") || "1000");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const env = (process as any).env || (globalThis as any).env || {};
  const db = env.DB;

  // Empezar con el catálogo base
  let products: Product[] = [...PRODUCTS];

  if (db) {
    try {
      // 1. Aplicar overrides
      const overridesResult = await db
        .prepare("SELECT * FROM ivmn_product_overrides")
        .all();

      const overrides = new Map<string, ProductOverride>();
      const deletedSkus = new Set<string>();

      for (const row of overridesResult.results || []) {
        const o = row as unknown as ProductOverride;
        overrides.set(o.sku, o);
        if (o.is_deleted === 1) deletedSkus.add(o.sku);
      }

      // Aplicar overrides al catálogo base
      products = products
        .filter((p) => !deletedSkus.has(p.sku)) // quitar eliminados
        .map((p) => {
          const o = overrides.get(p.sku);
          if (!o) return p;
          return {
            ...p,
            name: o.name || p.name,
            categoryId: o.category_id || p.categoryId,
            price: o.price !== null && o.price !== undefined ? o.price : p.price,
            compareAtPrice: o.compare_at_price !== null && o.compare_at_price !== undefined ? o.compare_at_price : p.compareAtPrice,
            stock: o.stock !== null && o.stock !== undefined ? o.stock : p.stock,
            isFeatured: o.is_featured === 1,
            brand: o.brand || p.brand,
            shortDescription: o.short_description || p.shortDescription,
            longDescription: o.long_description || p.longDescription,
            imageEmoji: o.image_emoji || p.imageEmoji,
            imageColor: o.image_color || p.imageColor,
            imageR2Key: o.image_r2_key || p.imageR2Key,
            tags: o.tags ? safeParseTags(o.tags) : p.tags,
          };
        });

      // 2. Agregar productos custom
      const customResult = await db
        .prepare("SELECT * FROM ivmn_custom_products WHERE is_active = 1")
        .all();

      for (const row of customResult.results || []) {
        const c = row as unknown as CustomProduct;
        const customProduct: Product = {
          id: c.id,
          categoryId: c.category_id,
          sku: c.sku,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          shortDescription: c.short_description || c.name,
          longDescription: c.long_description || c.short_description || "",
          price: c.price,
          compareAtPrice: c.compare_at_price || undefined,
          currency: c.currency || "USD",
          stock: c.stock,
          isFeatured: c.is_featured === 1,
          brand: c.brand || "Generic",
          model: c.model || "",
          imageColor: c.image_color || "#4CAF50",
          imageEmoji: c.image_emoji || "📦",
          imageR2Key: c.image_r2_key || `inversiones-valencia/products/${c.sku}.jpg`,
          specs: c.specs ? safeParseSpecs(c.specs) : [],
          tags: c.tags ? safeParseTags(c.tags) : [],
          rating: c.rating || 0,
          reviewCount: c.review_count || 0,
        };
        products.push(customProduct);
      }
    } catch (err) {
      console.warn("Error leyendo D1, usando catálogo base:", err);
    }
  }

  // Aplicar filtros
  let filtered = products;

  if (categoryId) {
    filtered = filtered.filter((p) => p.categoryId === categoryId);
  }

  if (search) {
    const term = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term)
    );
  }

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      items,
      total,
      offset,
      limit,
      hasMore: offset + limit < total,
    },
    categories: CATEGORIES,
  });
}

function safeParseTags(json: string): string[] {
  try {
    return JSON.parse(json) || [];
  } catch {
    return [];
  }
}

function safeParseSpecs(json: string): { label: string; value: string }[] {
  try {
    return JSON.parse(json) || [];
  } catch {
    return [];
  }
}

// POST: crear producto custom en D1 (o override de uno existente)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos: name, price, categoryId" },
        { status: 400 }
      );
    }

    const env = (process as any).env || (globalThis as any).env || {};
    const db = env.DB;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "D1 no configurado" },
        { status: 503 }
      );
    }

    const id = body.id || `prod-custom-${Date.now()}`;
    const sku = body.sku || `IVMN-CUST-${Date.now()}`;
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);

    await db
      .prepare(
        `INSERT INTO ivmn_custom_products (id, sku, name, category_id, price, compare_at_price, currency, stock, is_featured, brand, model, short_description, long_description, image_emoji, image_color, image_r2_key, specs, tags, rating, review_count, slug, is_active, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
         ON CONFLICT(id) DO UPDATE SET
           sku = excluded.sku, name = excluded.name, category_id = excluded.category_id,
           price = excluded.price, compare_at_price = excluded.compare_at_price,
           stock = excluded.stock, is_featured = excluded.is_featured,
           brand = excluded.brand, short_description = excluded.short_description,
           long_description = excluded.long_description, image_emoji = excluded.image_emoji,
           image_color = excluded.image_color, image_r2_key = excluded.image_r2_key,
           tags = excluded.tags, slug = excluded.slug, updated_at = datetime('now')`
      )
      .bind(
        id, sku, body.name, body.categoryId, parseFloat(body.price),
        body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        body.currency || "USD", parseInt(body.stock || "0"),
        body.isFeatured ? 1 : 0, body.brand || "Generic", body.model || "",
        body.shortDescription || body.name, body.longDescription || "",
        body.imageEmoji || "📦", body.imageColor || "#4CAF50",
        body.imageR2Key || `inversiones-valencia/products/${sku}.jpg`,
        JSON.stringify(body.specs || []), JSON.stringify(body.tags || []),
        0, 0, slug
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Producto guardado en D1",
      data: { id, sku, ...body },
    });
  } catch (err: any) {
    console.error("Error POST products:", err);
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
