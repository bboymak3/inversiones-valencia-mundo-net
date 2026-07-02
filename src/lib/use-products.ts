"use client";

import { useState, useEffect } from "react";
import { PRODUCTS, type Product } from "@/data/catalog";

// Hook para cargar productos desde la API (catálogo base + overrides de D1)
// Usa PRODUCTS como estado inicial para mostrar inmediatamente
// Luego actualiza con los overrides cuando la API responde
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/admin/products?limit=1000", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data.success && data.data?.items) {
          setProducts(data.data.items);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Error cargando productos desde API, usando catálogo base:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading };
}
