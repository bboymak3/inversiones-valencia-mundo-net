import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Test directo de escritura a D1
export async function POST() {
  const env = (process as any).env || {};
  const db = env.DB;

  if (!db) {
    return NextResponse.json({ success: false, message: "DB not available" });
  }

  const results: any = {};

  try {
    // 1. Test INSERT simple
    const insertResult = await db
      .prepare(
        `INSERT INTO ivmn_product_overrides (sku, name, price, is_deleted, updated_at)
         VALUES (?, ?, ?, 0, datetime('now'))
         ON CONFLICT(sku) DO UPDATE SET name = excluded.name, price = excluded.price, updated_at = datetime('now')`
      )
      .bind("TEST-SKU-001", "Test Product", 99.99)
      .run();

    results.insert = {
      success: true,
      meta: insertResult.meta,
    };
  } catch (err: any) {
    results.insert = {
      success: false,
      error: err.message,
      stack: err.stack?.split("\n").slice(0, 3),
    };
  }

  // 2. Verificar si se guardó
  try {
    const selectResult = await db
      .prepare("SELECT sku, name, price FROM ivmn_product_overrides")
      .all();
    results.select = {
      success: true,
      count: selectResult.results?.length || 0,
      results: selectResult.results,
    };
  } catch (err: any) {
    results.select = {
      success: false,
      error: err.message,
    };
  }

  return NextResponse.json({ success: true, results });
}
