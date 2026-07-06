#!/usr/bin/env python3
"""
Fase 1: Renombra TODAS las fotos en R2 con SEO.
Formato: SKU-palabra1-palabra2-palabra3-palabra4-palabra5.jpg
Mantiene el SKU al inicio para identificación.
Las palabras clave se eligen según la categoría del producto.
"""
import os
import sys
import json
import re
import io
import urllib.request
import urllib.parse
from pathlib import Path

ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "6fc12c9a89723c0039cf189380c0b02f")
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
if not TOKEN:
    print("ERROR: Define CLOUDFLARE_API_TOKEN")
    sys.exit(1)
BUCKET = "ivmn-products"
PREFIX = "inversiones-valencia/products/"
CATALOG_TS = Path("/home/z/my-project/src/data/catalog.ts")

# Palabras clave SEO por categoría (6 palabras separadas con guiones)
# Basadas en el archivo de 2208 keywords, seleccionadas manualmente
# para máxima relevancia SEO
CATEGORY_SEO_SLUGS = {
    "cat-camaras": "camaras-de-seguridad-wifi-instalacion-vigilancia-casa",
    "cat-webcams": "camaras-web-1080p-videollamadas-streaming-hd",
    "cat-redes": "router-wifi-switch-redes-conectividad-cable-utp",
    "cat-audifonos": "audifonos-gaming-pc-microfono-inalambrico-musica",
    "cat-mouse": "mouse-inalambrico-gaming-usb-optico-computadora",
    "cat-teclados": "teclados-mecanico-usb-gaming-computadora-inalambrico",
    "cat-monitores": "monitores-led-gaming-hdmi-pantalla-computadora",
    "cat-cpu": "cpu-computadora-torre-i5-i7-procesador-desktop",
    "cat-laptops": "laptops-portatil-acer-lenovo-dell-hp-notebook",
    "cat-discos": "disco-duro-ssd-almacenamiento-pendrive-micro-sd",
    "cat-parlantes": "parlantes-bocina-bluetooth-altavoz-corneta-sonido",
    "cat-cases": "case-gabinete-gaming-torre-chasis-computadora",
    "cat-cargadores": "cargadores-cable-usb-power-bank-bateria-celular",
    "cat-ups": "ups-estabilizador-regulador-protector-corriente-electrica",
    "cat-impresoras": "impresoras-toner-tinta-cartucho-laser-impresion",
    "cat-ram": "memoria-ram-ddr4-ddr5-computadora-upgrade-gaming",
    "cat-fuentes": "fuente-poder-certificada-watts-computadora-gaming",
    "cat-sillas": "silla-gamer-oficina-escritorio-ergonomica-comoda",
    "cat-tablets": "tablet-android-pantalla-tactil-portatil-digital",
    "cat-cables": "cables-adaptadores-hdmi-usb-audio-conector",
    "cat-accesorios": "accesorios-tecnologia-computadora-celular-gadget",
    "cat-soportes": "soportes-monitor-tv-pared-base-adjustable",
    "cat-baterias": "bateria-power-bank-carga-portatil-celular",
    "cat-ventilacion": "cooler-fan-ventilador-disipador-computadora-gaming",
}


def load_products():
    """Carga productos del catalog.ts para saber la categoría de cada SKU"""
    text = CATALOG_TS.read_text(encoding="utf-8")
    products = []
    blocks = text.split("  {")
    for block in blocks[1:]:
        sku_m = re.search(r'sku:\s*"([^"]+)"', block)
        cat_m = re.search(r'categoryId:\s*"([^"]+)"', block)
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        if sku_m and cat_m:
            products.append({
                "sku": sku_m.group(1),
                "categoryId": cat_m.group(1),
                "name": name_m.group(1) if name_m else "",
            })
    return products


def list_r2_objects(prefix):
    """Lista objetos en R2 con un prefijo"""
    encoded_prefix = urllib.parse.quote(prefix, safe="")
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects?prefix={encoded_prefix}&per_page=1000"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    return [obj["key"] for obj in data.get("result", [])]


def copy_r2_object(source_key, dest_key):
    """Copia un objeto en R2 (descarga + sube con nuevo nombre)"""
    # Descargar
    encoded_src = urllib.parse.quote(source_key, safe="")
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{encoded_src}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
        content_type = resp.headers.get("Content-Type", "image/jpeg")

    # Subir con nuevo nombre
    encoded_dst = urllib.parse.quote(dest_key, safe="")
    upload_url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{encoded_dst}"
    upload_req = urllib.request.Request(
        upload_url, data=data, method="PUT",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": content_type},
    )
    with urllib.request.urlopen(upload_req, timeout=60) as resp:
        return resp.status == 200


def delete_r2_object(key):
    """Elimina un objeto de R2"""
    encoded = urllib.parse.quote(key, safe="")
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{encoded}"
    req = urllib.request.Request(url, method="DELETE", headers={"Authorization": f"Bearer {TOKEN}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status in [200, 204]
    except:
        return False


def main():
    print("=== Cargando productos del catálogo ===")
    products = load_products()
    print(f"Total productos: {len(products)}")

    # Mapear SKU → categoría
    sku_to_cat = {p["sku"]: p["categoryId"] for p in products}

    print("\n=== Listando imágenes en R2 ===")
    all_keys = list_r2_objects(PREFIX)
    print(f"Total objetos en R2: {len(all_keys)}")

    # Filtrar solo .jpg y .webp (no .svg ni otros)
    image_keys = [k for k in all_keys if k.endswith(".jpg") or k.endswith(".webp")]
    print(f"Imágenes (.jpg/.webp): {len(image_keys)}")

    # Para cada imagen, generar el nuevo nombre con SEO
    renamed = 0
    skipped = 0
    failed = 0
    results = []

    for i, key in enumerate(image_keys, 1):
        filename = key.split("/")[-1]
        # Extraer SKU del nombre actual
        # Formatos: IVMN-XXXX-NNNN.jpg o IVMN-IMG-NNNN.jpg
        sku_match = re.match(r'(IVMN-[A-Z]+-\d+)\.(jpg|webp)', filename)
        if not sku_match:
            skipped += 1
            continue

        sku = sku_match.group(1)
        ext = sku_match.group(2)

        # Determinar categoría del SKU
        # El SKU tiene formato IVMN-XXXX-NNNN donde XXXX es el código de categoría
        parts = sku.split("-")
        if len(parts) >= 3:
            cat_code = parts[1]  # CAMA, REDE, etc.
            # Mapear código a categoría completa
            cat_id = f"cat-{cat_code.lower()}"

            # Buscar el slug SEO para esta categoría
            seo_slug = CATEGORY_SEO_SLUGS.get(cat_id)
            if not seo_slug:
                # Intentar mapeos alternativos
                alt_map = {
                    "CAMA": "cat-camaras",
                    "WEBC": "cat-webcams",
                    "REDE": "cat-redes",
                    "AUDI": "cat-audifonos",
                    "MOUS": "cat-mouse",
                    "TECL": "cat-teclados",
                    "MONI": "cat-monitores",
                    "CPU": "cat-cpu",
                    "LAPT": "cat-laptops",
                    "DISC": "cat-discos",
                    "PARL": "cat-parlantes",
                    "CASE": "cat-cases",
                    "CARG": "cat-cargadores",
                    "UPS": "cat-ups",
                    "IMPR": "cat-impresoras",
                    "RAM": "cat-ram",
                    "FUEN": "cat-fuentes",
                    "SILL": "cat-sillas",
                    "TABL": "cat-tablets",
                    "CABL": "cat-cables",
                    "ACCE": "cat-accesorios",
                    "SOPO": "cat-soportes",
                    "BATE": "cat-baterias",
                    "VENT": "cat-ventilacion",
                    "IMG": None,  # Imágenes genéricas sin categoría
                }
                cat_id = alt_map.get(cat_code)
                if cat_id:
                    seo_slug = CATEGORY_SEO_SLUGS.get(cat_id)

        if not seo_slug:
            # SKU genérico (IVMN-IMG-XXXX) o categoría no encontrada
            # Usar un slug genérico de cámaras (prioridad)
            seo_slug = "camaras-de-seguridad-instalacion-vigilancia-wifi-casa"

        # Generar nuevo nombre: SKU-seo-slug.ext
        new_filename = f"{sku}-{seo_slug}.{ext}"
        new_key = f"{PREFIX}{new_filename}"

        # Si ya tiene el nombre correcto, saltar
        if key == new_key:
            skipped += 1
            continue

        # Copiar con nuevo nombre
        if copy_r2_object(key, new_key):
            renamed += 1
            results.append({
                "sku": sku,
                "old_key": key,
                "new_key": new_key,
                "category": cat_id if cat_code in ["CAMA", "WEBC", "REDE", "AUDI", "MOUS"] else "generic",
            })
            if renamed % 50 == 0:
                print(f"  [{i}/{len(image_keys)}] Renombradas: {renamed}")
        else:
            failed += 1

    print(f"\n{'='*60}")
    print(f"RESUMEN FASE 1 - RENOMBRAR FOTOS")
    print(f"{'='*60}")
    print(f"  ✓ Renombradas: {renamed}")
    print(f"  ⏭ Saltadas (ya renombradas o sin SKU): {skipped}")
    print(f"  ✗ Fallidas: {failed}")
    print(f"  Total: {renamed + skipped + failed}")

    # Guardar resultados
    output = Path("/home/z/my-project/renamed_images.json")
    output.write_text(json.dumps(results[:100], indent=2, ensure_ascii=False))  # primeros 100
    print(f"\nResultados: {output}")

    # NOTA: No borramos las originales todavía para seguridad
    # Se pueden borrar después de verificar
    print(f"\n⚠ NOTA: Las imágenes originales NO se borraron.")
    print(f"   Verifica que las nuevas funcionen y luego puedes borrar las viejas.")


if __name__ == "__main__":
    main()
