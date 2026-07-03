#!/usr/bin/env python3
"""
Compone cada imagen de producto sobre el marco de fondo (IVMN-ACCE-0001.jpg).
Estrategia:
1. Abrir el marco (1331x1691) - plantilla con logo + área blanca central
2. Abrir la imagen del producto (PNG con fondo negro)
3. Redimensionar el producto para que quepa en el área central del marco
4. Si la imagen tiene fondo negro, intentar hacerlo transparente
5. Pegar el producto centrado en el marco
6. Guardar y subir a R2

Uso:
  python3 scripts/compose_with_frame.py --skus IVMN-REDE-0001,IVMN-CAMA-0001
  python3 scripts/compose_with_frame.py --all  # procesa los 580
  python3 scripts/compose_with_frame.py --sample 10  # procesa 10 de muestra
"""
import os
import sys
import json
import argparse
import subprocess
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image, ImageOps

# Configuración
ACCOUNT_ID = "6fc12c9a89723c0039cf189380c0b02f"
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
if not TOKEN:
    print("ERROR: Define CLOUDFLARE_API_TOKEN environment variable")
    sys.exit(1)
BUCKET = "ivmn-products"
MARCO_PATH = Path("/home/z/my-project/images/marco/marco.jpg")
MAPPED_DIR = Path("/home/z/my-project/images/mapped")
PROCESADAS_DIR = Path("/home/z/my-project/images/procesadas")
CATALOG_TS = Path("/home/z/my-project/src/data/catalog.ts")

# Dimensiones del marco
MARCO_W, MARCO_H = 1331, 1691
# Área útil dentro del marco (excluyendo logo y bordes)
# El logo está en esquina superior izquierda, así que dejamos margen arriba
AREA_X, AREA_Y = 80, 200  # offset desde esquina superior izquierda
AREA_W, AREA_H = 1171, 1411  # ancho y alto del área útil

PROCESADAS_DIR.mkdir(parents=True, exist_ok=True)


def extract_skus_from_catalog():
    """Extrae todos los SKUs del catalog.ts"""
    text = CATALOG_TS.read_text(encoding="utf-8")
    import re
    return re.findall(r'sku:\s*"([^"]+)"', text)


def download_from_r2(sku, dest_path):
    """Descarga una imagen de R2 vía API REST"""
    key = f"inversiones-valencia/products/{sku}.jpg"
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{urllib.parse.quote(key, safe='')}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            dest_path.write_bytes(resp.read())
        return True
    except Exception as e:
        print(f"  ✗ Error descargando {sku}: {e}")
        return False


def upload_to_r2(sku, src_path):
    """Sube una imagen a R2 vía API REST"""
    key = f"inversiones-valencia/products/{sku}.jpg"
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{urllib.parse.quote(key, safe='')}"
    data = src_path.read_bytes()
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
        print(f"  ✗ Error subiendo {sku}: {e}")
        return False


def remove_black_background(img):
    """Hace transparente el fondo negro/oscuro de una imagen usando numpy."""
    try:
        import numpy as np
        arr = np.array(img)
        if arr.shape[2] == 4:
            # Ya tiene alpha
            r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
            # Mask: píxeles muy oscuros
            mask = (r < 40) & (g < 40) & (b < 40)
            arr[mask, 3] = 0  # hacer transparente
            return Image.fromarray(arr, "RGBA")
        else:
            # Convertir a RGBA primero
            img = img.convert("RGBA")
            arr = np.array(img)
            r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
            mask = (r < 40) & (g < 40) & (b < 40)
            arr[mask, 3] = 0
            return Image.fromarray(arr, "RGBA")
    except ImportError:
        # Sin numpy, método lento
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        data = img.getdata()
        new_data = []
        for item in data:
            r, g, b, a = item
            if r < 40 and g < 40 and b < 40:
                new_data.append((r, g, b, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        return img


def compose_product_on_frame(product_path, output_path, remove_black=True):
    """Compone la imagen del producto sobre el marco."""
    # Abrir el marco
    marco = Image.open(MARCO_PATH).convert("RGBA")

    # Abrir el producto
    producto = Image.open(product_path).convert("RGBA")

    # Redimensionar primero si es muy grande (para acelerar procesamiento)
    max_dim = 1500
    if max(producto.size) > max_dim:
        ratio = max_dim / max(producto.size)
        new_size = (int(producto.size[0] * ratio), int(producto.size[1] * ratio))
        producto = producto.resize(new_size, Image.LANCZOS)

    # Solo quitar fondo negro si la imagen tiene mucho negro (>30%)
    import numpy as np
    arr = np.array(producto.convert("RGB"))
    black_pct = ((arr[:,:,0] < 40) & (arr[:,:,1] < 40) & (arr[:,:,2] < 40)).sum() * 100 / (arr.shape[0] * arr.shape[1])
    print(f"    (negro: {black_pct:.1f}%)", end="")

    if remove_black and black_pct > 30:
        producto = remove_black_background(producto)
        print(" → fondo removido", end="")
    else:
        print(" → sin remover", end="")

    # Calcular tamaño para que quepa en el área útil preservando aspect ratio
    prod_w, prod_h = producto.size
    area_ratio = AREA_W / AREA_H
    prod_ratio = prod_w / prod_h

    if prod_ratio > area_ratio:
        new_w = AREA_W
        new_h = int(AREA_W / prod_ratio)
    else:
        new_h = AREA_H
        new_w = int(AREA_H * prod_ratio)

    # Redimensionar con alta calidad
    producto = producto.resize((new_w, new_h), Image.LANCZOS)

    # Crear fondo blanco para el producto (marco de 40px)
    bg = Image.new("RGBA", (new_w + 40, new_h + 40), (255, 255, 255, 255))
    bg.paste(producto, (20, 20), producto)

    # Posición centrada en el área útil
    pos_x = AREA_X + (AREA_W - bg.size[0]) // 2
    pos_y = AREA_Y + (AREA_H - bg.size[1]) // 2

    # Pegar sobre el marco
    marco.paste(bg, (pos_x, pos_y), bg)

    # Convertir a RGB y guardar como JPEG
    final = marco.convert("RGB")
    final.save(output_path, "JPEG", quality=85, optimize=True)
    return output_path


def process_sku(sku):
    """Procesa un SKU: descarga, compone, sube"""
    # Buscar la imagen local mapeada
    local_path = MAPPED_DIR / f"{sku}.png"
    if not local_path.exists():
        # Descargar de R2 si no está local
        local_path = PROCESADAS_DIR / f"{sku}_original.png"
        if not download_from_r2(sku, local_path):
            return False

    # Compone sobre el marco
    output_path = PROCESADAS_DIR / f"{sku}.jpg"
    try:
        compose_product_on_frame(local_path, output_path)
    except Exception as e:
        print(f"  ✗ Error componiendo {sku}: {e}")
        return False

    # Subir a R2
    if upload_to_r2(sku, output_path):
        return True
    return False


def main():
    parser = argparse.ArgumentParser(description="Compone productos sobre el marco")
    parser.add_argument("--skus", help="Lista de SKUs separados por coma")
    parser.add_argument("--all", action="store_true", help="Procesar todos los SKUs")
    parser.add_argument("--sample", type=int, help="Procesar N SKUs de muestra (uno por categoría)")
    args = parser.parse_args()

    all_skus = extract_skus_from_catalog()
    print(f"Total SKUs en catálogo: {len(all_skus)}")

    if args.all:
        skus_to_process = all_skus
    elif args.sample:
        # Tomar N SKUs de diferentes categorías
        seen_cats = set()
        skus_to_process = []
        for sku in all_skus:
            cat = sku.split("-")[1]
            if cat not in seen_cats:
                skus_to_process.append(sku)
                seen_cats.add(cat)
                if len(skus_to_process) >= args.sample:
                    break
        # Completar con los primeros si no hay suficientes categorías
        if len(skus_to_process) < args.sample:
            for sku in all_skus:
                if sku not in skus_to_process:
                    skus_to_process.append(sku)
                    if len(skus_to_process) >= args.sample:
                        break
    elif args.skus:
        skus_to_process = [s.strip() for s in args.skus.split(",")]
    else:
        print("Usa --skus, --all o --sample N")
        sys.exit(1)

    print(f"\n=== Procesando {len(skus_to_process)} imágenes ===")
    print(f"Marco: {MARCO_PATH} ({MARCO_W}x{MARCO_H})")
    print(f"Área útil: ({AREA_X},{AREA_Y}) -> ({AREA_X+AREA_W},{AREA_Y+AREA_H})")
    print()

    success = 0
    failed = 0
    failed_list = []

    for i, sku in enumerate(skus_to_process, 1):
        print(f"[{i}/{len(skus_to_process)}] Procesando {sku}...", end=" ")
        if process_sku(sku):
            print("✓")
            success += 1
        else:
            print("✗")
            failed += 1
            failed_list.append(sku)

    print(f"\n{'='*50}")
    print(f"RESUMEN:")
    print(f"  ✓ Procesadas: {success}")
    print(f"  ✗ Fallidas: {failed}")
    print(f"  Total: {success + failed}")

    if failed_list:
        print(f"\nSKUs fallidos: {', '.join(failed_list[:10])}")

    # Guardar lista de procesados
    log = {
        "processed": [s for s in skus_to_process if s not in failed_list],
        "failed": failed_list,
        "timestamp": str(__import__("datetime").datetime.now()),
    }
    log_path = PROCESADAS_DIR / "_processing_log.json"
    log_path.write_text(json.dumps(log, indent=2))
    print(f"\nLog: {log_path}")


if __name__ == "__main__":
    main()
