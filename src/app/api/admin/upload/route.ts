import { NextRequest, NextResponse } from "next/server";

// Subida de imágenes al bucket R2 (ivmn-products)
// CONVIERTE AUTOMÁTICAMENTE A WEBP para optimizar peso
// También sube el JPG original como respaldo
export const runtime = "edge";

// Canvas API para conversión a WebP en el servidor Edge
async function convertToWebp(file: File): Promise<{ webp: ArrayBuffer; jpg: ArrayBuffer; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const width = bitmap.width;
  const height = bitmap.height;

  // Redimensionar si es muy grande (máx 1200px)
  const maxDim = 1200;
  let targetW = width;
  let targetH = height;
  if (Math.max(width, height) > maxDim) {
    const ratio = maxDim / Math.max(width, height);
    targetW = Math.round(width * ratio);
    targetH = Math.round(height * ratio);
  }

  // Crear canvas y dibujar
  const canvas = new OffscreenCanvas(targetW, targetH);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener contexto 2D");

  // Fondo blanco (para PNGs con transparencia)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, targetW, targetH);

  // Dibujar imagen
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);

  // Convertir a WebP (calidad 85 = buen balance peso/calidad)
  const webpBlob = await canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
  const webp = await webpBlob.arrayBuffer();

  // También generar JPG como respaldo (calidad 88)
  const jpgBlob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.88 });
  const jpg = await jpgBlob.arrayBuffer();

  bitmap.close();
  return { webp, jpg, width: targetW, height: targetH };
}

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

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "El archivo supera los 10MB" },
        { status: 400 }
      );
    }

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

    // Convertir a WebP + JPG
    let webpData: ArrayBuffer | null = null;
    let jpgData: ArrayBuffer | null = null;
    let dimensions = { width: 0, height: 0 };
    let conversionNote = "";

    try {
      const result = await convertToWebp(file);
      webpData = result.webp;
      jpgData = result.jpg;
      dimensions = { width: result.width, height: result.height };
    } catch (err: any) {
      console.warn("Conversión WebP falló, subiendo original:", err.message);
      conversionNote = " (no se pudo convertir a WebP, se subió original)";
      jpgData = await file.arrayBuffer();
    }

    // Subir WebP (formato principal)
    const webpKey = `inversiones-valencia/products/${sku}.webp`;
    if (webpData) {
      await bucket.put(webpKey, webpData, {
        httpMetadata: {
          contentType: "image/webp",
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    }

    // Subir JPG como respaldo
    const jpgKey = `inversiones-valencia/products/${sku}.jpg`;
    if (jpgData) {
      await bucket.put(jpgKey, jpgData, {
        httpMetadata: {
          contentType: "image/jpeg",
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Imagen subida y optimizada a WebP" + conversionNote,
      data: {
        sku,
        webpKey: webpData ? webpKey : null,
        jpgKey,
        url: `/api/img/${sku}?t=${Date.now()}`,
        originalSize: file.size,
        webpSize: webpData?.byteLength || 0,
        jpgSize: jpgData?.byteLength || 0,
        dimensions,
        savings: webpData
          ? Math.round((1 - webpData.byteLength / file.size) * 100) + "%"
          : "N/A",
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

    const env = (process as any).env || (globalThis as any).env || {};
    const bucket = env.PRODUCTS_BUCKET;

    if (!bucket) {
      return NextResponse.json(
        { success: false, message: "R2 bucket no configurado" },
        { status: 503 }
      );
    }

    // Eliminar ambos formatos (WebP y JPG)
    await bucket.delete(`inversiones-valencia/products/${sku}.webp`);
    await bucket.delete(`inversiones-valencia/products/${sku}.jpg`);

    return NextResponse.json({
      success: true,
      message: "Imagen eliminada de R2 (WebP + JPG)",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
