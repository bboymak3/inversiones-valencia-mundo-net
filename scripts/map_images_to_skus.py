#!/usr/bin/env python3
"""
Mapea las imágenes extraídas del PDF a los productos del catálogo.

Estrategia:
- Cada página del PDF tiene ~8 productos (2 filas de 4)
- Las imágenes grandes (>15KB) son fotos de productos
- Las imágenes pequeñas (<10KB) son iconos/logos/texto
- Ordenamos por número de página y posición, y asignamos a productos en orden

Salida: copia las imágenes seleccionadas a /home/z/my-project/images/mapped/
con el nombre {SKU}.png para luego subirlas a R2.
"""
import os
import re
import json
from pathlib import Path
import shutil

IMAGES_DIR = Path("/home/z/my-project/images")
MAPPED_DIR = Path("/home/z/my-project/images/mapped")
CATALOG_TS = Path("/home/z/my-project/src/data/catalog.ts")

# Umbral: imágenes > 15KB son fotos de productos
SIZE_THRESHOLD = 15000

# Crear carpeta de salida
MAPPED_DIR.mkdir(parents=True, exist_ok=True)

# Leer SKUs del catálogo TS
print("=== Leyendo SKUs del catálogo ===")
catalog_text = CATALOG_TS.read_text(encoding="utf-8")
# Patrón: sku: "IVMN-XXXX-NNNN"
sku_matches = re.findall(r'sku:\s*"([^"]+)"', catalog_text)
print(f"Total SKUs encontrados: {len(sku_matches)}")

# Listar todas las imágenes con su tamaño
print("\n=== Listando imágenes con tamaño ===")
all_images = []
for f in IMAGES_DIR.glob("product-*.png"):
    stat = f.stat()
    all_images.append({
        "filename": f.name,
        "path": str(f),
        "size": stat.st_size,
        "page": int(re.search(r"product-(\d+)-", f.name).group(1)),
        "index": int(re.search(r"-(\d+)\.png$", f.name).group(1)),
    })

print(f"Total imágenes: {len(all_images)}")

# Filtrar solo imágenes grandes (fotos de productos)
product_images = [img for img in all_images if img["size"] >= SIZE_THRESHOLD]
print(f"Imágenes > {SIZE_THRESHOLD} bytes (candidatas a foto de producto): {len(product_images)}")

# Ordenar por página y luego por índice
product_images.sort(key=lambda x: (x["page"], x["index"]))

# Eliminar duplicados: si la misma imagen aparece varias veces (mismo tamaño en misma página),
# tomar solo la primera
seen_hashes = set()
unique_images = []
for img in product_images:
    # Hash simple: tamaño + página
    h = (img["size"], img["page"])
    if h not in seen_hashes:
        seen_hashes.add(h)
        unique_images.append(img)

print(f"Imágenes únicas tras dedupe: {len(unique_images)}")

# Mapear a SKUs en orden
print(f"\n=== Mapeando {min(len(unique_images), len(sku_matches))} imágenes a SKUs ===")
mapped_count = 0
unmapped_skus = []

for i, sku in enumerate(sku_matches):
    if i < len(unique_images):
        img = unique_images[i]
        # Copiar y renombrar
        src = Path(img["path"])
        dst = MAPPED_DIR / f"{sku}.png"
        shutil.copy2(src, dst)
        mapped_count += 1
    else:
        unmapped_skus.append(sku)

print(f"✓ Mapeadas: {mapped_count}")
print(f"✗ Sin imagen: {len(unmapped_skus)}")

# Estadísticas
print(f"\n=== Estadísticas ===")
print(f"  SKUs totales: {len(sku_matches)}")
print(f"  Imágenes extraídas: {len(all_images)}")
print(f"  Imágenes candidatas (>15KB): {len(product_images)}")
print(f"  Imágenes únicas: {len(unique_images)}")
print(f"  Productos con foto: {mapped_count} ({mapped_count*100//len(sku_matches)}%)")

# Guardar mapeo en JSON
mapping = []
for i, sku in enumerate(sku_matches):
    if i < len(unique_images):
        img = unique_images[i]
        mapping.append({
            "sku": sku,
            "source": img["filename"],
            "page": img["page"],
            "size": img["size"],
            "mapped_path": f"images/mapped/{sku}.png",
        })
    else:
        mapping.append({
            "sku": sku,
            "source": None,
            "page": None,
            "size": None,
            "mapped_path": None,
        })

with open("/home/z/my-project/images/mapping.json", "w") as f:
    json.dump(mapping, f, indent=2, ensure_ascii=False)

print(f"\n✓ Mapeo guardado en /home/z/my-project/images/mapping.json")
print(f"✓ Imágenes renombradas en /home/z/my-project/images/mapped/")
