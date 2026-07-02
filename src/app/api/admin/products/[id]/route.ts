import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/catalog";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: product });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const existing = PRODUCTS.find((p) => p.id === id);
  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Producto no encontrado" },
      { status: 404 }
    );
  }

  const updated = {
    ...existing,
    ...body,
    id: existing.id,
    price: parseFloat(body.price ?? existing.price),
    stock: parseInt(body.stock ?? existing.stock),
  };

  return NextResponse.json({
    success: true,
    message: "Producto actualizado (modo demo)",
    data: updated,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = PRODUCTS.find((p) => p.id === id);
  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Producto ${existing.name} eliminado (modo demo)`,
  });
}
