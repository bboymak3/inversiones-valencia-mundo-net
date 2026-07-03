import { NextRequest, NextResponse } from "next/server";

// API para obtener la tasa del BCV
// Scrapping de https://www.bcv.org.ve/ (reimplementación TS del repo frankpradov/BCV-PHP-OBTENER)
// Con fallback a tasa manual guardada en D1 (ivmn_settings)

export const runtime = "edge";

const FALLBACK_RATE = 245.5;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const source = url.searchParams.get("source");

  const env = (process as any).env || (globalThis as any).env || {};
  const db = env.DB;

  if (db && source !== "bcv") {
    try {
      const result = await db
        .prepare("SELECT value, updated_at FROM ivmn_settings WHERE key = ?")
        .bind("bcv_rate_manual")
        .first();

      if (result && result.value) {
        const manualRate = parseFloat(result.value);
        const manualDate = await db
          .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
          .bind("bcv_rate_manual_date")
          .first();

        const forceManual = await db
          .prepare("SELECT value FROM ivmn_settings WHERE key = ?")
          .bind("bcv_force_manual")
          .first();

        if (forceManual && forceManual.value === "true") {
          return NextResponse.json({
            success: true,
            rate: manualRate,
            source: "manual",
            date: manualDate?.value || null,
            updatedAt: result.updated_at,
          });
        }

        const bcvResult = await fetchBcvRate();
        if (bcvResult) {
          return NextResponse.json({
            success: true,
            rate: bcvResult.rate,
            source: "bcv",
            date: bcvResult.date,
            fallbackManual: manualRate,
            fallbackDate: manualDate?.value || null,
          });
        }

        return NextResponse.json({
          success: true,
          rate: manualRate,
          source: "manual",
          date: manualDate?.value || null,
          updatedAt: result.updated_at,
          note: "BCV no disponible, usando tasa manual",
        });
      }
    } catch (err) {
      console.warn("D1 no disponible, continuando con BCV directo:", err);
    }
  }

  if (source !== "manual") {
    const bcvResult = await fetchBcvRate();
    if (bcvResult) {
      return NextResponse.json({
        success: true,
        rate: bcvResult.rate,
        source: "bcv",
        date: bcvResult.date,
      });
    }
  }

  return NextResponse.json(
    {
      success: false,
      rate: FALLBACK_RATE,
      source: "fallback",
      message: "No se pudo obtener la tasa del BCV ni de la base de datos",
    },
    { status: 200 }
  );
}

// Reimplementación del scraping BCV en TypeScript
// Basado en https://github.com/frankpradov/BCV-PHP-OBTENER
async function fetchBcvRate(): Promise<{ rate: number; date: string | null } | null> {
  const urls = [
    "https://www.bcv.org.ve/terminos-condiciones",
    "https://www.bcv.org.ve/",
    "https://bcv.org.ve/",
  ];

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-VE,es;q=0.9,en;q=0.8",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`BCV ${url} → ${res.status}`);
        continue;
      }

      const html = await res.text();

      let date: string | null = null;
      const dateMatch = html.match(
        /(\d{1,2}\s+de\s+[a-zA-Záéíóúñ]+\s*,?\s*\d{4})|(\d{1,2}\/\d{1,2}\/\d{4})/i
      );
      if (dateMatch) {
        date = dateMatch[0];
      }

      // Método 1: todos los números con formato venezolano "1.234,56"
      const allNumbers = html.match(/(\d{1,3}(?:\.\d{3})*,\d{2,4})/g);
      if (allNumbers && allNumbers.length >= 5) {
        const rateStr = allNumbers[4].replace(/\./g, "").replace(",", ".");
        const rate = parseFloat(rateStr);
        if (rate > 1 && rate < 100000) {
          return { rate, date };
        }
      }

      // Método 2: tasa cerca de "dólar" o "USD"
      const usdMatch = html.match(
        /(?:d[óo]lar|USD|usd)[^0-9]{0,200}(\d{1,3}(?:\.\d{3})*,\d{2,4})/i
      );
      if (usdMatch) {
        const rateStr = usdMatch[1].replace(/\./g, "").replace(",", ".");
        const rate = parseFloat(rateStr);
        if (rate > 1 && rate < 100000) {
          return { rate, date };
        }
      }

      // Método 3: heuristic — número entre 100 y 1000
      const candidates = (allNumbers || [])
        .map((n) => {
          const v = parseFloat(n.replace(/\./g, "").replace(",", "."));
          return { raw: n, value: v };
        })
        .filter((c) => c.value > 100 && c.value < 1000);

      if (candidates.length > 0) {
        const usdCandidate = candidates.reduce((max, c) =>
          c.value > max.value ? c : max
        );
        return { rate: usdCandidate.value, date };
      }
    } catch (err) {
      console.warn(`Error fetching BCV ${url}:`, err);
      continue;
    }
  }

  return null;
}
