#!/usr/bin/env python3
"""
Sube las imágenes mapeadas a Cloudflare R2 (bucket ivmn-products)
usando la API de wrangler.

Cada imagen se sube a: inversiones-valencia/products/{SKU}.jpg
"""
import subprocess
import os
import json
from pathlib import Path

MAPPED_DIR = Path("/home/z/my-project/images/mapped")
MAPPING_FILE = Path("/home/z/my-project/images/mapping.json")
BUCKET = "ivmn-products"

# Token de Cloudflare - leer de variable de entorno
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
if not TOKEN:
    print("ERROR: Define la variable de entorno CLOUDFLARE_API_TOKEN")
    print("Ejemplo: CLOUDFLARE_API_TOKEN='tu_token' python3 scripts/upload_images_to_r2.py")
    exit(1)
WRANGLER = "/home/z/my-project/node_modules/.bin/wrangler"

print("=== Cargando mapeo ===")
mapping = json.loads(MAPPING_FILE.read_text())
total = len(mapping)
print(f"Total productos a subir: {total}")

# Filtrar solo los que tienen imagen mapeada
to_upload = [m for m in mapping if m["mapped_path"]]
print(f"Productos con imagen: {len(to_upload)}")

print(f"\n=== Subiendo {len(to_upload)} imágenes a R2 bucket '{BUCKET}' ===")
print("Esto puede tardar varios minutos...\n")

success = 0
failed = 0
errors = []

for i, item in enumerate(to_upload, 1):
    sku = item["sku"]
    local_path = MAPPED_DIR / f"{sku}.png"
    r2_key = f"inversiones-valencia/products/{sku}.jpg"

    if not local_path.exists():
        print(f"  [{i}/{len(to_upload)}] ✗ {sku}: archivo no encontrado")
        failed += 1
        errors.append({"sku": sku, "error": "file not found"})
        continue

    # Subir con wrangler
    env = os.environ.copy()
    env["CLOUDFLARE_API_TOKEN"] = TOKEN

    cmd = [
        WRANGLER, "r2", "object", "put",
        f"{BUCKET}/{r2_key}",
        f"--file={local_path}",
        "--content-type=image/jpeg",
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            env=env,
            timeout=60
        )
        if result.returncode == 0:
            success += 1
            if i % 20 == 0 or i == len(to_upload):
                print(f"  [{i}/{len(to_upload)}] ✓ {sku} subido ({success} ok, {failed} fail)")
        else:
            failed += 1
            errors.append({"sku": sku, "error": result.stderr[:200]})
            if failed <= 5:  # Mostrar primeros 5 errores
                print(f"  [{i}/{len(to_upload)}] ✗ {sku}: {result.stderr[:100]}")
    except subprocess.TimeoutExpired:
        failed += 1
        errors.append({"sku": sku, "error": "timeout"})
    except Exception as e:
        failed += 1
        errors.append({"sku": sku, "error": str(e)})

print(f"\n{'='*50}")
print(f"RESUMEN:")
print(f"  ✓ Subidas: {success}")
print(f"  ✗ Fallidas: {failed}")
print(f"  Total: {success + failed}")
print(f"  Tasa de éxito: {success*100//(success+failed)}%")

if errors:
    print(f"\nPrimeros 5 errores:")
    for e in errors[:5]:
        print(f"  {e['sku']}: {e['error']}")

# Guardar log de errores
if errors:
    with open("/home/z/my-project/images/upload_errors.json", "w") as f:
        json.dump(errors, f, indent=2)
    print(f"\nLog completo en /home/z/my-project/images/upload_errors.json")
