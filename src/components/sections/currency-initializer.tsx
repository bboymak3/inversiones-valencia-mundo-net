"use client";

import { useEffect } from "react";
import { useCurrency, fetchBcvRate } from "@/lib/currency-store";

// Inicializa la tasa BCV al cargar la app
// Se monta una sola vez en el layout principal
export function CurrencyInitializer() {
  const setRate = useCurrency((s) => s.setRate);

  useEffect(() => {
    let mounted = true;

    const loadRate = async () => {
      try {
        const { rate, date } = await fetchBcvRate();
        if (mounted && rate && rate > 0) {
          setRate(rate, "bcv", date);
        }
      } catch (err) {
        // Mantener la tasa guardada en localStorage (si existe)
        // Si no, la tasa por defecto del store
        console.warn("No se pudo cargar tasa BCV, usando valor guardado");
      }
    };

    loadRate();
    // Refresh cada 30 minutos
    const interval = setInterval(loadRate, 30 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [setRate]);

  return null;
}
