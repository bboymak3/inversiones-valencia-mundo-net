import { NextRequest, NextResponse } from "next/server";

// API admin para gestionar la tasa BCV (manual + forzar manual)
export const runtime = "edge";

export async function GET() {
  const env = (process as any).env || (globalThis as any).env || {};
  const db = env.DB;

  if (!db) {
    return NextResponse.json({
      success: false,
      message: "D1 no configurado",
      config: null,
    });
  }

  try {
    const rateResult = await db
      .prepare("SELECT value, updated_at FROM ivmn_settings WHERE key = ?")
      .bind("bcv_rate_manual")
      .first();

    const dateResult = await db
      .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
      .bind("bcv_rate_manual_date")
      .first();

    const forceResult = await db
      .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
      .bind("bcv_force_manual")
      .first();

    return NextResponse.json({
      success: true,
      config: {
        manualRate: rateResult?.value ? parseFloat(rateResult.value) : null,
        manualDate: dateResult?.value || null,
        forceManual: forceResult?.value === "true",
        updatedAt: rateResult?.updated_at || null,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rate, date } = body;

    if (!rate || isNaN(parseFloat(rate))) {
      return NextResponse.json(
        { success: false, message: "Tasa inválida" },
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

    const rateValue = parseFloat(rate);
    const dateValue = date || new Date().toISOString().split("T")[0];

    await db
      .prepare(
        "INSERT INTO ivmn_settings (key, value, description, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')"
      )
      .bind("bcv_rate_manual", String(rateValue), "Tasa BCV manual (Bs por USD)")
      .run();

    await db
      .prepare(
        "INSERT INTO ivmn_settings (key, value, description, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')"
      )
      .bind("bcv_rate_manual_date", dateValue, "Fecha de la tasa manual BCV")
      .run();

    return NextResponse.json({
      success: true,
      message: "Tasa manual guardada",
      data: { rate: rateValue, date: dateValue },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { forceManual } = body;

    const env = (process as any).env || (globalThis as any).env || {};
    const db = env.DB;

    if (!db) {
      return NextResponse.json(
        { success: false, message: "D1 no configurado" },
        { status: 503 }
      );
    }

    const value = forceManual ? "true" : "false";

    await db
      .prepare(
        "INSERT INTO ivmn_settings (key, value, description, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')"
      )
      .bind(
        "bcv_force_manual",
        value,
        "Forzar uso de tasa manual en vez de BCV automática"
      )
      .run();

    return NextResponse.json({
      success: true,
      message: forceManual
        ? "Ahora se usa la tasa manual"
        : "Ahora se usa la tasa automática del BCV",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error: " + err.message },
      { status: 500 }
    );
  }
}
