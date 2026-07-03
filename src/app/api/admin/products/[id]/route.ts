import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/catalog";

export const runtime = "edge";

// GET - obtener un producto por ID (busca en catálogo base + D1)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id || p.sku === id);

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: product });
}

// PUT - actualizar producto (guarda override en D1)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Buscar el producto en el catálogo base por id o sku
    const existing = PRODUCTS.find((p) => p.id === id || p.sku === id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado en catálogo base" },
        { status: 404 }
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

    // Guardar override en D1 (solo los campos modificados)
    await db
      .prepare(
        `INSERT INTO ivmn_product_overrides (sku, name, category_id, price, compare_at_price, stock, is_featured, brand, short_description, long_description, image_emoji, image_color, image_r2_key, tags, is_deleted, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))
         ON CONFLICT(sku) DO UPDATE SET
           name = excluded.name, category_id = excluded.category_id, price = excluded.price,
           compare_at_price = excluded.compare_at_price, stock = excluded.stock,
           is_featured = excluded.is_featured, brand = excluded.brand,
           short_description = excluded.short_description,
           long_description = excluded.long_description,
           image_emoji = excluded.image_emoji, image_color = excluded.image_color,
           image_r2_key = excluded.image_r2_key, tags = excluded.tags,
           is_deleted = 0, updated_at = datetime('now')`
      )
      .bind(
        existing.sku,
        body.name || existing.name,
        body.categoryId || existing.categoryId,
        body.price !== undefined ? parseFloat(body.price) : existing.price,
        body.compareAtPrice !== undefined ? parseFloat(body.compareAtPrice) : (existing.compareAtPrice || null),
        body.stock !== undefined ? parseInt(body.stock) : existing.stock,
        body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : (existing.isFeatured ? 1 : 0),
        body.brand || existing.brand,
        body.shortDescription || existing.shortDescription,
        body.longDescription || existing.longDescription,
        body.imageEmoji || existing.imageEmoji,
        body.imageColor || existing.imageColor,
        body.imageR2Key || existing.imageR2Key,
        JSON.stringify(body.tags || existing.tags)
      )
      .run();

    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      price: parseFloat(body.price ?? existing.price),
      stock: parseInt(body.stock ?? existing.stock),
    };

    return NextResponse.json({
      success: true,
      message: "Producto actualizado en D1 (override guardado)",
      data: updated,
    });
  } catch (err: any) {
    console.error("Error PUT product:", err);
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

// DELETE - marcar producto como eliminado (override en D1)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = PRODUCTS.find((p) => p.id === id || p.sku === id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
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

    // Marcar como eliminado en overrides
    await db
      .prepare(
        `INSERT INTO ivmn_product_overrides (sku, is_deleted, updated_at)
         VALUES (?, 1, datetime('now'))
         ON CONFLICT(sku) DO UPDATE SET is_deleted = 1, updated_at = datetime('now')`
      )
      .bind(existing.sku)
      .run();

    return NextResponse.json({
      success: true,
      message: `Producto ${existing.name} marcado como eliminado`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
