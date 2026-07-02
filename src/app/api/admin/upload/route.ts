import { NextRequest, NextResponse } from "next/server";

// Subida de imágenes al bucket R2 (ivmn-products)
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

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "El archivo debe ser una imagen" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "El archivo supera los 5MB" },
        { status: 400 }
      );
    }

    const r2Key = `inversiones-valencia/products/${sku}.jpg`;
    const env = (process as any).env || (globalThis as any).env || {};
    const bucket = env.PRODUCTS_BUCKET;

    if (!bucket) {
      return NextResponse.json(
        {
          success: false,
          message: "R2 bucket no configurado. En desarrollo local no se pueden subir imágenes.",
        },
        { status: 503 }
      );
    }

    const buffer = await file.arrayBuffer();
    await bucket.put(r2Key, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Imagen subida correctamente a R2",
      data: {
        r2Key,
        url: `/api/img/${sku}`,
        size: file.size,
        contentType: file.type,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sku = url.searchParams.get("sku");

    if (!sku) {
      return NextResponse.json(
        { success: false, message: "Falta el SKU" },
        { status: 400 }
      );
    }

    const r2Key = `inversiones-valencia/products/${sku}.jpg`;
    const env = (process as any).env || (globalThis as any).env || {};
    const bucket = env.PRODUCTS_BUCKET;

    if (!bucket) {
      return NextResponse.json(
        { success: false, message: "R2 bucket no configurado" },
        { status: 503 }
      );
    }

    await bucket.delete(r2Key);

    return NextResponse.json({
      success: true,
      message: "Imagen eliminada de R2",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
