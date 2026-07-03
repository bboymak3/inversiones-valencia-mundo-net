import { NextRequest, NextResponse } from "next/server";

// Convierte TODAS las imágenes JPG de R2 a WebP (mucho más liviano)
// GET: lista cuántas imágenes hay que convertir
// POST: { prefix?: string } → convierte todas las imágenes con ese prefijo

export const runtime = "edge";

const PRODUCTS_PREFIX = "inversiones-valencia/products/";

// GET: lista imágenes que necesitan conversión (tienen JPG pero no WebP)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const prefix = url.searchParams.get("prefix") || "";
  const fullPrefix = prefix ? `${PRODUCTS_PREFIX}${prefix}` : PRODUCTS_PREFIX;

  const env = (process as any).env || (globalThis as any).env || {};
  const bucket = env.PRODUCTS_BUCKET;

  if (!bucket) {
    return NextResponse.json(
      { success: false, message: "R2 bucket no configurado" },
      { status: 503 }
    );
  }

  try {
    const listed = await bucket.list({ prefix: fullPrefix, limit: 1000 });

    const jpgs: string[] = [];
    const webps: string[] = [];

    for (const obj of listed.objects) {
      if (obj.key.endsWith(".jpg")) {
        jpgs.push(obj.key);
      } else if (obj.key.endsWith(".webp")) {
        webps.push(obj.key);
      }
    }

    // Identificar JPGs que no tienen WebP correspondiente
    const webpSet = new Set(webps.map((k) => k.replace(".webp", "")));
    const needConversion = jpgs.filter((k) => !webpSet.has(k.replace(".jpg", "")));

    return NextResponse.json({
      success: true,
      stats: {
        totalJpgs: jpgs.length,
        totalWebps: webps.length,
        needConversion: needConversion.length,
        alreadyConverted: jpgs.length - needConversion.length,
      },
      needConversion: needConversion.slice(0, 50), // primeros 50 para preview
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

// POST: convierte UNA imagen JPG a WebP
// Body: { key: "inversiones-valencia/products/IVMN-IMG-0001.jpg" }
// Retorna el WebP generado para que el cliente lo suba
export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();

    if (!key || !key.endsWith(".jpg")) {
      return NextResponse.json(
        { success: false, message: "Key inválida (debe ser .jpg)" },
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

    // Descargar JPG
    const jpgObject = await bucket.get(key);
    if (!jpgObject) {
      return NextResponse.json(
        { success: false, message: "JPG no encontrado" },
        { status: 404 }
      );
    }

    const jpgBuffer = await jpgObject.arrayBuffer();
    const jpgSize = jpgBuffer.byteLength;

    // Convertir a WebP usando Canvas API
    const blob = new Blob([jpgBuffer], { type: "image/jpeg" });
    const bitmap = await createImageBitmap(blob);

    // Redimensionar si es muy grande (máx 1200px)
    const maxDim = 1200;
    let targetW = bitmap.width;
    let targetH = bitmap.height;
    if (Math.max(bitmap.width, bitmap.height) > maxDim) {
      const ratio = maxDim / Math.max(bitmap.width, bitmap.height);
      targetW = Math.round(bitmap.width * ratio);
      targetH = Math.round(bitmap.height * ratio);
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

    // Convertir a WebP
    const webpBlob = await canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
    const webpBuffer = await webpBlob.arrayBuffer();
    const webpSize = webpBuffer.byteLength;

    // Subir WebP a R2
    const webpKey = key.replace(".jpg", ".webp");
    await bucket.put(webpKey, webpBuffer, {
      httpMetadata: {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    const savings = Math.round((1 - webpSize / jpgSize) * 100);

    return NextResponse.json({
      success: true,
      message: `Convertido: ${key} → ${webpKey}`,
      data: {
        originalKey: key,
        webpKey,
        originalSize: jpgSize,
        webpSize,
        savings: savings + "%",
        dimensions: { width: targetW, height: targetH },
      },
    });
  } catch (err: any) {
    console.error("Error convirtiendo a WebP:", err);
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
