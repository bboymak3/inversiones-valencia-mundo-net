import { NextRequest, NextResponse } from "next/server";

// API para gestionar marcos de productos
// GET: listar marcos disponibles en R2 (carpeta inversiones-valencia/marcos/)
// POST: subir nuevo marco a R2
// PUT: elegir marco activo (se guarda en D1 ivmn_settings)

export const runtime = "edge";

const MARCOS_PREFIX = "inversiones-valencia/marcos/";
const MARCO_DEFAULT_KEY = "inversiones-valencia/products/IVMN-ACCE-0001.jpg"; // marco inicial existente

// GET: lista todos los marcos disponibles
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "list";

  const env = (process as any).env || (globalThis as any).env || {};
  const db = env.DB;
  const bucket = env.PRODUCTS_BUCKET;

  if (action === "active") {
    // Devolver solo el marco activo
    if (!db) {
      return NextResponse.json({
        success: true,
        activeMarco: {
          key: MARCO_DEFAULT_KEY,
          name: "Marco por defecto (IVMN-ACCE-0001)",
          isDefault: true,
        },
      });
    }
    try {
      const result = await db
        .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
        .bind("active_marco_key")
        .first();
      const resultName = await db
        .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
        .bind("active_marco_name")
        .first();

      return NextResponse.json({
        success: true,
        activeMarco: {
          key: result?.value || MARCO_DEFAULT_KEY,
          name: resultName?.value || "Marco por defecto (IVMN-ACCE-0001)",
          isDefault: !result?.value,
        },
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: "Error: " + err.message },
        { status: 500 }
      );
    }
  }

  // Listar todos los marcos en R2 (carpeta marcos/) + el default
  const marcos: { key: string; name: string; isDefault: boolean }[] = [
    {
      key: MARCO_DEFAULT_KEY,
      name: "Marco por defecto (IVMN-ACCE-0001)",
      isDefault: true,
    },
  ];

  if (bucket) {
    try {
      // Cloudflare R2 list vía API binding
      const listed = await bucket.list({ prefix: MARCOS_PREFIX });
      for (const obj of listed.objects) {
        const name = obj.key.split("/").pop() || obj.key;
        marcos.push({
          key: obj.key,
          name: name.replace(/\.[^.]+$/, ""), // sin extensión
          isDefault: false,
        });
      }
    } catch (err) {
      console.warn("No se pudieron listar marcos de R2:", err);
    }
  }

  // Obtener marco activo de D1
  let activeKey = MARCO_DEFAULT_KEY;
  if (db) {
    try {
      const result = await db
        .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
        .bind("active_marco_key")
        .first();
      if (result?.value) activeKey = result.value;
    } catch {}
  }

  return NextResponse.json({
    success: true,
    marcos,
    activeKey,
    defaultKey: MARCO_DEFAULT_KEY,
  });
}

// POST: subir nuevo marco a R2
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Falta el archivo" },
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
        { success: false, message: "R2 bucket no configurado" },
        { status: 503 }
      );
    }

    // Nombre del marco: usar el proporcionado o el nombre del archivo
    const baseName = name || file.name.replace(/\.[^.]+$/, "");
    const safeName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const extension = file.name.split(".").pop() || "jpg";
    const r2Key = `${MARCOS_PREFIX}${safeName}.${extension}`;

    const buffer = await file.arrayBuffer();
    await bucket.put(r2Key, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Marco subido correctamente",
      data: {
        key: r2Key,
        name: baseName,
        url: `/api/marco?key=${encodeURIComponent(r2Key)}`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

// PUT: elegir marco activo
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, name } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Falta la key del marco" },
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

    await db
      .prepare(
        "INSERT INTO ivmn_settings (key, value, description, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')"
      )
      .bind("active_marco_key", key, "Key del marco activo en R2")
      .run();

    await db
      .prepare(
        "INSERT INTO ivmn_settings (key, value, description, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')"
      )
      .bind("active_marco_name", name || key, "Nombre del marco activo")
      .run();

    return NextResponse.json({
      success: true,
      message: `Marco "${name || key}" seleccionado como activo`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

// DELETE: eliminar marco (solo los subidos por el usuario, no el default)
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Falta la key del marco" },
        { status: 400 }
      );
    }

    if (key === MARCO_DEFAULT_KEY) {
      return NextResponse.json(
        { success: false, message: "No se puede eliminar el marco por defecto" },
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

    await bucket.delete(key);

    return NextResponse.json({
      success: true,
      message: "Marco eliminado",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
