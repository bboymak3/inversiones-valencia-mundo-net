import { NextRequest, NextResponse } from "next/server";

// Reemplaza la imagen de un producto en R2
// CONVIERTE AUTOMÁTICAMENTE A WEBP + JPG de respaldo
// POST: FormData { file, sku } → sube {sku}.webp + {sku}.jpg

export const runtime = "edge";

async function convertImage(file: File | Blob): Promise<{ webp: ArrayBuffer; jpg: ArrayBuffer }> {
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

  const canvas = new OffscreenCanvas(targetW, targetH);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener contexto 2D");

  // Fondo blanco
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, targetW, targetH);

  // Dibujar imagen
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  // Convertir a WebP (calidad 85)
  const webpBlob = await canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
  const webp = await webpBlob.arrayBuffer();

  // Convertir a JPG como respaldo (calidad 88)
  const jpgBlob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.88 });
  const jpg = await jpgBlob.arrayBuffer();

  return { webp, jpg };
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

    const env = (process as any).env || (globalThis as any).env || {};
    const bucket = env.PRODUCTS_BUCKET;

    if (!bucket) {
      return NextResponse.json(
        { success: false, message: "R2 bucket no configurado" },
        { status: 503 }
      );
    }

    // Convertir a WebP + JPG
    let webpData: ArrayBuffer | null = null;
    let jpgData: ArrayBuffer | null = null;
    const originalSize = file.size;

    try {
      const result = await convertImage(file);
      webpData = result.webp;
      jpgData = result.jpg;
    } catch (err: any) {
      console.warn("Conversión falló, subiendo original:", err.message);
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
      message: `Imagen de ${sku} reemplazada y optimizada`,
      data: {
        sku,
        webpKey: webpData ? webpKey : null,
        jpgKey,
        url: `/api/img/${sku}?t=${Date.now()}`,
        originalSize,
        webpSize: webpData?.byteLength || 0,
        savings: webpData
          ? Math.round((1 - webpData.byteLength / originalSize) * 100) + "%"
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
