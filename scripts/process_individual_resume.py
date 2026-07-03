#!/usr/bin/env python3
"""
Versión robusta con resume: continúa desde donde se quedó.
Lee cuántas IVMN-IMG-XXXX ya están en R2 y continúa desde ahí.
"""
import os
import sys
import json
import io
import urllib.request
import urllib.parse
import re
from pathlib import Path
from PIL import Image
import numpy as np

INPUT_DIR = Path("/home/z/my-project/images_individual")
OUTPUT_DIR = Path("/home/z/my-project/images_processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "6fc12c9a89723c0039cf189380c0b02f")
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
if not TOKEN:
    print("ERROR: Define CLOUDFLARE_API_TOKEN")
    sys.exit(1)
BUCKET = "ivmn-products"
SIZE_THRESHOLD = 15000


def fix_black_background(img):
    if img.mode == "RGBA":
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    else:
        img = img.convert("RGB")
    arr = np.array(img)
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    black_mask = (r < 30) & (g < 30) & (b < 30)
    arr[black_mask] = [255, 255, 255]
    return Image.fromarray(arr)


def process_image(img_path):
    try:
        img = Image.open(img_path)
        max_dim = 1500
        if max(img.size) > max_dim:
            ratio = max_dim / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        img = fix_black_background(img)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=88, optimize=True)
        buf.seek(0)
        return buf.read()
    except Exception as e:
        return None


def upload_to_r2(sku, data):
    key = f"inversiones-valencia/products/{sku}.jpg"
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{urllib.parse.quote(key, safe='')}"
    req = urllib.request.Request(
        url, data=data, method="PUT",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "image/jpeg"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status == 200
    except:
        return False


def get_existing_count():
    """Cuenta cuántos IVMN-IMG-XXXX ya están en R2"""
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects?prefix=inversiones-valencia/products/IVMN-IMG&per_page=1000"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            return len(data.get("result", []))
    except:
        return 0


def main():
    print("=== Listando imágenes extraídas ===")
    all_images = sorted(INPUT_DIR.glob("img-*.png")) + sorted(INPUT_DIR.glob("img-*.jpg"))
    print(f"Total: {len(all_images)}")
    
    # Filtrar por tamaño
    product_images = []
    for img_path in all_images:
        size = img_path.stat().st_size
        if size >= SIZE_THRESHOLD:
            product_images.append((img_path, size))
    
    # Ordenar por página y índice
    def sort_key(item):
        m = re.search(r"img-(\d+)-(\d+)", item[0].name)
        if m:
            return (int(m.group(1)), int(m.group(2)))
        return (999, 999)
    product_images.sort(key=sort_key)
    print(f"Imágenes >15KB: {len(product_images)}")
    
    # Verificar cuántas ya están en R2
    existing = get_existing_count()
    print(f"Ya en R2: {existing}")
    start_from = existing  # continuar desde aquí
    print(f"Empezando desde: IVMN-IMG-{start_from+1:04d}")
    print()
    
    success = 0
    failed = 0
    
    for i in range(start_from, len(product_images)):
        img_path, size = product_images[i]
        sku = f"IVMN-IMG-{i+1:04d}"
        
        data = process_image(img_path)
        if not data:
            failed += 1
            continue
        
        if upload_to_r2(sku, data):
            success += 1
            if (i + 1) % 50 == 0:
                print(f"  [{i+1}/{len(product_images)}] ✓ {success} subidas en esta sesión")
        else:
            failed += 1
    
    print(f"\n=== RESUMEN ===")
    print(f"  ✓ Subidas ahora: {success}")
    print(f"  ✗ Fallidas: {failed}")
    total_in_r2 = get_existing_count()
    print(f"  Total en R2: {total_in_r2}")


if __name__ == "__main__":
    main()
