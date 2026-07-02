import { NextRequest, NextResponse } from "next/server";

// Reemplaza la imagen de un producto en R2 con una nueva (ya procesada con marco)
// POST: FormData { file, sku } → sobreescribe inversiones-valencia/products/{sku}.jpg

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sku = formData.get("sku") as string | null;

    if (!file || !sku) {
      return NextResponse.json(
        { success: false, message: "Falta el archivo o el SKU" },
        { status: 400 }
      );
    }

    const env = (process as any).env || (globalThis as any).env || {};
    const bucket = env.PRODUCTS_BUCKET;

    if (!bucket) {
      return NextResponse.json(
        { success: false, message: "R2 bucket no configurado" },
        { status: 503 }
      );
    }

    const r2Key = `inversiones-valencia/products/${sku}.jpg`;
    const buffer = await file.arrayBuffer();

    await bucket.put(r2Key, buffer, {
      httpMetadata: {
        contentType: "image/jpeg",
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Imagen de ${sku} reemplazada`,
      data: {
        r2Key,
        url: `/api/img/${sku}?t=${Date.now()}`,
        size: file.size,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
