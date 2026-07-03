#!/usr/bin/env python3
"""
Filtra las imágenes extraídas del PDF:
- Solo fotos de productos (>15KB)
- Convierte fondo negro a blanco
- Redimensiona si es muy grande (máx 1500px)
- Sube a R2 con nombres genéricos IVMN-IMG-XXXX
"""
import os
import sys
import json
import io
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image
import numpy as np

# Configuración
INPUT_DIR = Path("/home/z/my-project/images_individual")
OUTPUT_DIR = Path("/home/z/my-project/images_processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "6fc12c9a89723c0039cf189380c0b02f")
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
if not TOKEN:
    print("ERROR: Define CLOUDFLARE_API_TOKEN")
    sys.exit(1)
BUCKET = "ivmn-products"

# Solo fotos de productos (más de 15KB)
SIZE_THRESHOLD = 15000


def fix_black_background(img):
    """Convierte el fondo negro a blanco manteniendo el producto"""
    # Convertir a RGB si es necesario
    if img.mode == "RGBA":
        # Si tiene alpha, componer sobre blanco primero
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    else:
        img = img.convert("RGB")
    
    arr = np.array(img)
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    
    # Detectar píxeles negros (fondo)
    black_mask = (r < 30) & (g < 30) & (b < 30)
    
    # Convertir píxeles negros a blanco
    arr[black_mask] = [255, 255, 255]
    
    return Image.fromarray(arr)


def process_image(img_path):
    """Procesa una imagen: redimensionar, fondo blanco, devolver bytes JPEG"""
    try:
        img = Image.open(img_path)
        
        # Redimensionar si es muy grande (máx 1500px lado más largo)
        max_dim = 1500
        if max(img.size) > max_dim:
            ratio = max_dim / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        
        # Convertir fondo negro a blanco
        img = fix_black_background(img)
        
        # Guardar como JPEG en memoria
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=88, optimize=True)
        buf.seek(0)
        return buf.read()
    except Exception as e:
        print(f"  ✗ Error procesando {img_path}: {e}")
        return None


def upload_to_r2(sku, data):
    """Sube una imagen JPEG a R2"""
    key = f"inversiones-valencia/products/{sku}.jpg"
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{urllib.parse.quote(key, safe='')}"
    req = urllib.request.Request(
        url,
        data=data,
        method="PUT",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "image/jpeg",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status == 200
    except Exception as e:
        return False


def main():
    print("=== Listando imágenes extraídas ===")
    all_images = sorted(INPUT_DIR.glob("img-*.png")) + sorted(INPUT_DIR.glob("img-*.jpg"))
    print(f"Total imágenes: {len(all_images)}")
    
    # Filtrar por tamaño (>15KB)
    product_images = []
    for img_path in all_images:
        size = img_path.stat().st_size
        if size >= SIZE_THRESHOLD:
            product_images.append((img_path, size))
    
    print(f"Imágenes >15KB (fotos de productos): {len(product_images)}")
    
    # Ordenar por número de página y luego por índice
    import re
    def sort_key(item):
        path = item[0]
        name = path.name
        # Extraer página y índice: img-007-123.png → (7, 123)
        m = re.search(r"img-(\d+)-(\d+)", name)
        if m:
            return (int(m.group(1)), int(m.group(2)))
        return (999, 999)
    
    product_images.sort(key=sort_key)
    
    print(f"\n=== Procesando y subiendo {len(product_images)} imágenes ===")
    print("Formato: JPEG con fondo blanco")
    print()
    
    success = 0
    failed = 0
    results = []
    
    for i, (img_path, size) in enumerate(product_images, 1):
        # Nombre genérico: IVMN-IMG-0001, IVMN-IMG-0002, etc.
        sku = f"IVMN-IMG-{i:04d}"
        
        # Procesar imagen
        data = process_image(img_path)
        if not data:
            failed += 1
            continue
        
        # Subir a R2
        if upload_to_r2(sku, data):
            success += 1
            results.append({
                "sku": sku,
                "source": img_path.name,
                "size_original": size,
                "size_processed": len(data),
                "url": f"/api/img/{sku}",
            })
            if i % 50 == 0:
                print(f"  [{i}/{len(product_images)}] ✓ Subidas: {success}")
        else:
            failed += 1
            if failed <= 3:
                print(f"  [{i}/{len(product_images)}] ✗ Falló: {sku}")
    
    print(f"\n{'='*60}")
    print(f"RESUMEN FINAL")
    print(f"{'='*60}")
    print(f"  ✓ Subidas: {success}")
    print(f"  ✗ Fallidas: {failed}")
    print(f"  Total: {success + failed}")
    
    # Guardar resultados
    output_file = OUTPUT_DIR / "_upload_results.json"
    output_file.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\nResultados: {output_file}")
    print(f"\nLas imágenes están en R2 como IVMN-IMG-0001.jpg hasta IVMN-IMG-{success:04d}.jpg")
    print(f"URLs: /api/img/IVMN-IMG-0001, /api/img/IVMN-IMG-0002, etc.")


if __name__ == "__main__":
    main()
