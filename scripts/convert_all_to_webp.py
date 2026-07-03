#!/usr/bin/env python3
"""
Convierte TODAS las imágenes JPG de R2 a WebP (mucho más liviano).
- Descarga cada JPG de R2
- Lo convierte a WebP con Pillow (calidad 85, máx 1200px)
- Sube el WebP a R2
- No borra el JPG (queda como respaldo)

Se ejecuta localmente porque Edge Runtime no soporta createImageBitmap.
"""
import os
import sys
import json
import io
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image

ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "6fc12c9a89723c0039cf189380c0b02f")
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
if not TOKEN:
    print("ERROR: Define CLOUDFLARE_API_TOKEN")
    sys.exit(1)
BUCKET = "ivmn-products"
PREFIX = "inversiones-valencia/products/"


def list_jpgs():
    """Lista todos los JPGs en R2 que NO tienen WebP correspondiente"""
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects?prefix={urllib.parse.quote(PREFIX, safe='')}&per_page=1000"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())

    jpgs = []
    webps = set()
    for obj in data.get("result", []):
        key = obj.get("key", "")
        if key.endswith(".jpg"):
            jpgs.append(key)
        elif key.endswith(".webp"):
            webps.add(key.replace(".webp", ""))

    # Solo los que no tienen WebP
    need_conversion = [k for k in jpgs if k.replace(".jpg", "") not in webps]
    return need_conversion


def download_from_r2(key):
    """Descarga un objeto de R2"""
    encoded_key = urllib.parse.quote(key, safe="")
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{encoded_key}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def upload_to_r2(key, data, content_type):
    """Sube un objeto a R2"""
    encoded_key = urllib.parse.quote(key, safe="")
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{encoded_key}"
    req = urllib.request.Request(
        url, data=data, method="PUT",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": content_type,
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.status == 200


def convert_to_webp(jpg_data):
    """Convierte bytes JPG a bytes WebP con Pillow"""
    img = Image.open(io.BytesIO(jpg_data))

    # Convertir modo si es necesario
    if img.mode == "RGBA":
        # Componer sobre blanco
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Redimensionar si es muy grande (máx 1200px)
    max_dim = 1200
    if max(img.size) > max_dim:
        ratio = max_dim / max(img.size)
        new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    # Convertir a WebP
    buf = io.BytesIO()
    img.save(buf, format="WEBP", quality=85, method=6)  # method=6 = mejor compresión
    buf.seek(0)
    return buf.read(), img.size


def main():
    print("=== Listando JPGs que necesitan conversión ===")
    jpgs = list_jpgs()
    print(f"Total a convertir: {len(jpgs)}")
    print()

    success = 0
    failed = 0
    total_original = 0
    total_webp = 0

    for i, jpg_key in enumerate(jpgs, 1):
        webp_key = jpg_key.replace(".jpg", ".webp")
        sku = jpg_key.split("/")[-1].replace(".jpg", "")

        try:
            # Descargar JPG
            jpg_data = download_from_r2(jpg_key)
            original_size = len(jpg_data)

            # Convertir a WebP
            webp_data, dimensions = convert_to_webp(jpg_data)
            webp_size = len(webp_data)

            # Subir WebP
            if upload_to_r2(webp_key, webp_data, "image/webp"):
                success += 1
                total_original += original_size
                total_webp += webp_size
                savings = round((1 - webp_size / original_size) * 100) if original_size > 0 else 0

                if i % 25 == 0 or i == len(jpgs):
                    avg_savings = round((1 - total_webp / total_original) * 100) if total_original > 0 else 0
                    print(f"  [{i}/{len(jpgs)}] ✓ {success} convertidas | ahorro promedio: {avg_savings}%")
            else:
                failed += 1
                print(f"  [{i}/{len(jpgs)}] ✗ Falló upload: {sku}")
        except Exception as e:
            failed += 1
            if failed <= 3:
                print(f"  [{i}/{len(jpgs)}] ✗ Error: {sku}: {e}")

    print(f"\n{'='*60}")
    print(f"RESUMEN FINAL")
    print(f"{'='*60}")
    print(f"  ✓ Convertidas: {success}")
    print(f"  ✗ Fallidas: {failed}")
    print(f"  Total: {success + failed}")
    if total_original > 0:
        print(f"\n  Tamaño original total: {total_original / 1024 / 1024:.1f} MB")
        print(f"  Tamaño WebP total: {total_webp / 1024 / 1024:.1f} MB")
        print(f"  Ahorro total: {(total_original - total_webp) / 1024 / 1024:.1f} MB ({round((1 - total_webp / total_original) * 100)}%)")


if __name__ == "__main__":
    main()
