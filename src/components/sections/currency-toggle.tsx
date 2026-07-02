"use client";

import { DollarSign, Coins } from "lucide-react";
import { useCurrency } from "@/lib/currency-store";
import { cn } from "@/lib/utils";

export function CurrencyToggle({ compact = false }: { compact?: boolean }) {
  const currency = useCurrency((s) => s.currency);
  const setCurrency = useCurrency((s) => s.setCurrency);

  return (
    <div
      className={cn(
        "inline-flex items-center bg-emerald-50 border border-emerald-200 rounded-full p-0.5",
        compact && "scale-90"
      )}
      role="radiogroup"
      aria-label="Seleccionar moneda"
    >
      <button
        type="button"
        onClick={() => setCurrency("USD")}
        role="radio"
        aria-checked={currency === "USD"}
        className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all",
          currency === "USD"
            ? "gradient-ivmn text-white shadow-sm"
            : "text-emerald-700 hover:bg-emerald-100"
        )}
      >
        <DollarSign className="h-3 w-3" />
        USD
      </button>
      <button
        type="button"
        onClick={() => setCurrency("VES")}
        role="radio"
        aria-checked={currency === "VES"}
        className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all",
          currency === "VES"
            ? "gradient-ivmn text-white shadow-sm"
            : "text-emerald-700 hover:bg-emerald-100"
        )}
      >
        <Coins className="h-3 w-3" />
        Bs
      </button>
    </div>
  );
}
