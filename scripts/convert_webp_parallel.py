#!/usr/bin/env python3
"""
Versión paralela: convierte múltiples imágenes a la vez usando threads.
"""
import os
import sys
import json
import io
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed

ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "6fc12c9a89723c0039cf189380c0b02f")
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
if not TOKEN:
    print("ERROR: Define CLOUDFLARE_API_TOKEN")
    sys.exit(1)
BUCKET = "ivmn-products"
PREFIX = "inversiones-valencia/products/"


def list_jpgs_needing_webp():
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

    return [k for k in jpgs if k.replace(".jpg", "") not in webps]


def process_one(jpg_key):
    """Procesa una imagen: descargar, convertir, subir"""
    webp_key = jpg_key.replace(".jpg", ".webp")
    sku = jpg_key.split("/")[-1].replace(".jpg", "")
    
    try:
        # Descargar
        encoded = urllib.parse.quote(jpg_key, safe="")
        url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{encoded}"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            jpg_data = resp.read()
        
        original_size = len(jpg_data)
        
        # Convertir
        img = Image.open(io.BytesIO(jpg_data))
        if img.mode == "RGBA":
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")
        
        max_dim = 1200
        if max(img.size) > max_dim:
            ratio = max_dim / max(img.size)
            img = img.resize((int(img.size[0] * ratio), int(img.size[1] * ratio)), Image.LANCZOS)
        
        buf = io.BytesIO()
        img.save(buf, format="WEBP", quality=85, method=6)
        buf.seek(0)
        webp_data = buf.read()
        webp_size = len(webp_data)
        
        # Subir WebP
        encoded_webp = urllib.parse.quote(webp_key, safe="")
        upload_url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{encoded_webp}"
        upload_req = urllib.request.Request(
            upload_url, data=webp_data, method="PUT",
            headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "image/webp"},
        )
        with urllib.request.urlopen(upload_req, timeout=60) as resp:
            if resp.status == 200:
                return (True, sku, original_size, webp_size)
        return (False, sku, 0, 0)
    except Exception as e:
        return (False, sku, 0, 0)


def main():
    print("=== Listando JPGs que necesitan WebP ===")
    jpgs = list_jpgs_needing_webp()
    print(f"Total a convertir: {len(jpgs)}")
    print()
    
    success = 0
    failed = 0
    total_orig = 0
    total_webp = 0
    
    # Procesar en paralelo (8 hilos)
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(process_one, k): k for k in jpgs}
        
        for i, future in enumerate(as_completed(futures), 1):
            ok, sku, orig, webp = future.result()
            if ok:
                success += 1
                total_orig += orig
                total_webp += webp
            else:
                failed += 1
            
            if i % 25 == 0 or i == len(jpgs):
                avg = round((1 - total_webp / total_orig) * 100) if total_orig > 0 else 0
                print(f"  [{i}/{len(jpgs)}] ✓ {success} | ✗ {failed} | ahorro: {avg}%")
    
    print(f"\n{'='*60}")
    print(f"RESUMEN")
    print(f"{'='*60}")
    print(f"  ✓ Convertidas: {success}")
    print(f"  ✗ Fallidas: {failed}")
    if total_orig > 0:
        print(f"  Original: {total_orig / 1024 / 1024:.1f} MB")
        print(f"  WebP: {total_webp / 1024 / 1024:.1f} MB")
        print(f"  Ahorro: {(total_orig - total_webp) / 1024 / 1024:.1f} MB ({round((1 - total_webp / total_orig) * 100)}%)")


if __name__ == "__main__":
    main()
