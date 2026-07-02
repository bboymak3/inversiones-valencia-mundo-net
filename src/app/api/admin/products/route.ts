import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, CATEGORIES, type Product } from "@/data/catalog";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const categoryId = url.searchParams.get("category") || "";
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  let filtered = [...PRODUCTS];

  if (categoryId) {
    filtered = filtered.filter((p) => p.categoryId === categoryId);
  }

  if (search) {
    const term = search.toLowerCase();
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos: name, price, categoryId" },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      id: `prod-custom-${Date.now()}`,
      categoryId: body.categoryId,
      sku: body.sku || `IVMN-CUST-${Date.now()}`,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      shortDescription: body.shortDescription || body.name,
      longDescription: body.longDescription || body.shortDescription || "",
      price: parseFloat(body.price),
      compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : undefined,
      currency: body.currency || "USD",
      stock: parseInt(body.stock || "0"),
      isFeatured: Boolean(body.isFeatured),
      brand: body.brand || "Generic",
      model: body.model || "",
      imageColor: body.imageColor || "#4CAF50",
      imageEmoji: body.imageEmoji || "📦",
      imageR2Key: body.imageR2Key || `inversiones-valencia/products/${body.sku || "custom-" + Date.now()}.jpg`,
      specs: body.specs || [],
      tags: body.tags || [],
      rating: 0,
      reviewCount: 0,
    };

    return NextResponse.json({
      success: true,
      message: "Producto creado (modo demo - en producción se guardaría en D1)",
      data: newProduct,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
