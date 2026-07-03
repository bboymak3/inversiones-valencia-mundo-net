"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Upload, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type R2Image = {
  key: string;
  sku: string;
  filename: string;
  size: number;
  url: string;
};

type ImagePickerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (sku: string, key: string) => void;
  currentSku?: string;
  categories?: { prefix: string; name: string }[];
};

export function ImagePickerModal({
  open,
  onOpenChange,
  onSelect,
  currentSku,
  categories = [],
}: ImagePickerModalProps) {
  const [images, setImages] = useState<R2Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [uploadingNew, setUploadingNew] = useState(false);
  const [useMarco, setUseMarco] = useState(true);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/list-images?prefix=${encodeURIComponent(categoryFilter)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      } else {
        toast.error(data.message || "Error al cargar imágenes");
      }
    } catch (err) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    if (open) loadImages();
  }, [open, loadImages]);

  const filtered = images.filter((img) => {
    if (search) {
      const term = search.toLowerCase();
      return (
        img.sku.toLowerCase().includes(term) ||
        img.filename.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleUploadNew = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Debe ser una imagen");
      return;
    }
    setUploadingNew(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const timestamp = Date.now();
      const newSku = `IVMN-IMG-${timestamp}`;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("sku", newSku);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (data.success) {
        if (useMarco) {
          toast.info("Aplicando marco del sistema...");
          try {
            await fetch("/api/admin/apply-marco", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sku: newSku }),
            });
            toast.success("Imagen subida con marco aplicado");
          } catch (err) {
            toast.warning("Imagen subida, no se pudo aplicar marco");
          }
        } else {
          toast.success("Imagen subida sin marco");
        }
        loadImages();
        setTimeout(() => {
          onSelect(newSku, data.data.r2Key);
          onOpenChange(false);
        }, 500);
      } else {
        toast.error(data.message || "Error al subir");
      }
    } catch (err) {
      toast.error("Error de conexión");
    } finally {
      setUploadingNew(false);
    }
  };

  const handleSelectExisting = (img: R2Image) => {
    onSelect(img.sku, img.key);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-gray-100 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-emerald-600" />
              Seleccionar imagen del producto
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="border-b border-gray-100 p-3 space-y-3 bg-gray-50">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por SKU o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-emerald-200"
              />
            </div>
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-emerald-200 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.prefix} value={cat.prefix}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadImages}
              disabled={loading}
              className="border-emerald-200 text-emerald-700"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Actualizar"
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center bg-white p-3 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="picker-upload-new"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUploadNew(f);
                }}
                disabled={uploadingNew}
              />
              <Label
                htmlFor="picker-upload-new"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 gradient-ivmn text-white rounded-md text-sm font-semibold hover:opacity-95"
              >
                {uploadingNew ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploadingNew ? "Subiendo..." : "Subir nueva imagen"}
              </Label>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={useMarco}
                onChange={(e) => setUseMarco(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
              <span className="text-gray-700 font-medium">
                Aplicar marco del sistema automáticamente
              </span>
            </label>
          </div>

          <div className="text-xs text-gray-500">
            {loading ? (
              "Cargando..."
            ) : (
              <>
                {filtered.length} imagen{filtered.length !== 1 ? "es" : ""} encontrada
                {filtered.length !== 1 ? "s" : ""} en R2
                {currentSku && (
                  <span className="ml-2 text-emerald-700">
                    • Imagen actual: <strong>{currentSku}</strong>
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {loading && images.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No se encontraron imágenes</p>
              <p className="text-xs mt-1">
                Sube una nueva imagen con el botón de arriba
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((img) => (
                <button
                  key={img.key}
                  onClick={() => handleSelectExisting(img)}
                  className={`group relative aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all hover:shadow-ivmn ${
                    currentSku === img.sku
                      ? "border-emerald-500 ring-2 ring-emerald-300"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.sku}
                    className="w-full h-full object-contain p-1"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <div className="text-[10px] font-mono text-white font-bold truncate">
                      {img.sku}
                    </div>
                    <div className="text-[9px] text-gray-300">
                      {(img.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  {currentSku === img.sku && (
                    <Badge className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] flex items-center gap-0.5">
                      <Check className="h-2.5 w-2.5" />
                      ACTUAL
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 shadow-lg">
                      <Check className="h-5 w-5 text-emerald-700" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-3 bg-gray-50 text-xs text-gray-600 flex items-center justify-between">
          <span>
            💡 Haz clic en cualquier imagen para seleccionarla como foto del producto
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
