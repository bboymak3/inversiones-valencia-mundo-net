"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Currency = "USD" | "VES";

type CurrencyState = {
  currency: Currency; // moneda seleccionada por el usuario
  rate: number; // tasa BCV actual (Bs por USD)
  rateSource: "bcv" | "manual" | "loading";
  rateUpdatedAt: string | null;
  rateDate: string | null; // fecha publicada por BCV
  setCurrency: (c: Currency) => void;
  toggle: () => void;
  setRate: (rate: number, source: "bcv" | "manual", date?: string | null) => void;
  convert: (usd: number) => number;
  format: (usd: number, currency?: Currency) => string;
};

// Tasa inicial razonable (se actualiza al cargar la página)
const INITIAL_RATE = 245.5;

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "USD",
      rate: INITIAL_RATE,
      rateSource: "loading",
      rateUpdatedAt: null,
      rateDate: null,
      setCurrency: (c) => set({ currency: c }),
      toggle: () =>
        set((s) => ({ currency: s.currency === "USD" ? "VES" : "USD" })),
      setRate: (rate, source, date = null) =>
        set({
          rate,
          rateSource: source,
          rateUpdatedAt: new Date().toISOString(),
          rateDate: date,
        }),
      convert: (usd) => {
        const { rate } = get();
        return usd * rate;
      },
      format: (usd, currency) => {
        const c = currency || get().currency;
        if (c === "USD") {
          return `$${usd.toFixed(2)} USD`;
        }
        const ves = usd * get().rate;
        // Formato venezolano: 1.234,56 Bs
        const formatted = ves
          .toFixed(2)
          .replace(/\D/g, "")
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
          .replace(/(\d+)(\d{2})$/, "$1,$2");
        return `Bs ${formatted}`;
      },
    }),
    {
      name: "ivmn-currency",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currency: s.currency,
        rate: s.rate,
        rateSource: s.rateSource,
        rateUpdatedAt: s.rateUpdatedAt,
        rateDate: s.rateDate,
      }),
    }
  )
);

// Hook helper para inicializar la tasa al cargar la app
// Se llama desde un useEffect en el layout principal
export async function fetchBcvRate(): Promise<{
  rate: number;
  date: string | null;
}> {
  try {
    const res = await fetch("/api/bcv", { cache: "no-store" });
    if (!res.ok) throw new Error("BCV API error");
    const data = await res.json();
    if (data.success && data.rate) {
      return { rate: data.rate, date: data.date || null };
    }
    throw new Error(data.message || "Sin tasa");
  } catch (err) {
    console.warn("BCV fetch falló, usando tasa guardada:", err);
    throw err;
  }
}
