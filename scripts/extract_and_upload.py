#!/usr/bin/env python3
"""
Recorta tarjetas de productos del PDF y las sube a R2.
Estrategia:
1. Cada página tiene un layout de 2 filas x 4 columnas (8 productos) o 2x3 (6 productos)
2. Recorta cada celda como imagen completa
3. Asigna a productos por orden de aparición en el catálogo (por categoría)
4. Sube a R2 con el SKU correspondiente

Mapa de páginas (basado en texto del PDF):
- Página 7: CÁMARAS DE SEGURIDAD (prioridad 1)
- Página 8: CÁMARAS WEB
- Páginas 14-18: AUDIFONOS
- Páginas 19-20: MOUSE
- Páginas 50-52: TECLADOS
- Páginas 12-13: MONITORES
- Páginas 9: LAPTOPS/TABLETS
- Páginas 10-11: CPU
- etc.
"""
import os
import re
import sys
import json
import subprocess
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image
import numpy as np

# Configuración
PAGES_DIR = Path("/home/z/my-project/pdf_pages")
CARDS_DIR = Path("/home/z/my-project/pdf_cards")
CATALOG_TS = Path("/home/z/my-project/src/data/catalog.ts")

ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "6fc12c9a89723c0039cf189380c0b02f")
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
if not TOKEN:
    print("ERROR: Define CLOUDFLARE_API_TOKEN environment variable")
    sys.exit(1)
BUCKET = "ivmn-products"

os.makedirs(CARDS_DIR, exist_ok=True)

# Mapa: página PDF → (categoría, número de productos esperados, grid rows x cols)
# Basado en el análisis del texto del PDF
PAGE_MAP = {
    # CÁMARAS DE SEGURIDAD (PRIORIDAD 1)
    7: ("cat-camaras", 8, 2, 4),  # CAMARAS
    # CÁMARAS WEB
    8: ("cat-webcams", 7, 2, 4),  # CAMARAS WEB
    # REDES
    2: ("cat-redes", 8, 2, 4),  # REDES TP LINK
    3: ("cat-redes", 8, 2, 4),  # REDES TP LINK
    4: ("cat-redes", 8, 2, 4),  # REDES MERCUSYS
    5: ("cat-redes", 8, 2, 4),  # ROUTERS
    6: ("cat-redes", 8, 2, 4),  # REDES
    60: ("cat-redes", 8, 2, 4),  # REDES TP LINK
    # LAPTOPS / TABLETS
    9: ("cat-laptops", 8, 2, 4),  # LAPTOPS / TABLETS
    # CPU
    10: ("cat-cpu", 8, 2, 4),  # CPU REFURBISHED
    11: ("cat-cpu", 8, 2, 4),  # CPU REFURBISHED
    # MONITORES
    12: ("cat-monitores", 8, 2, 4),  # MONITORES
    13: ("cat-monitores", 8, 2, 4),  # MONITORES
    # AUDIFONOS
    14: ("cat-audifonos", 8, 2, 4),  # AUDIFONOS PARA PC
    15: ("cat-audifonos", 8, 2, 4),
    16: ("cat-audifonos", 8, 2, 4),  # AUDIFONOS INALAMBRICOS
    17: ("cat-audifonos", 8, 2, 4),
    18: ("cat-audifonos", 8, 2, 4),
    # MOUSE
    19: ("cat-mouse", 8, 2, 4),  # MOUSE
    20: ("cat-mouse", 8, 2, 4),
    # CORNETAS / PARLANTES
    21: ("cat-parlantes", 8, 2, 4),  # CORNETAS
    22: ("cat-parlantes", 8, 2, 4),
    32: ("cat-parlantes", 8, 2, 4),  # CORNETAS
    33: ("cat-parlantes", 8, 2, 4),
    34: ("cat-parlantes", 8, 2, 4),
    # CASES / GABINETES
    23: ("cat-cases", 8, 2, 4),  # CASE GAMING
    24: ("cat-cases", 8, 2, 4),
    # SILLAS GAMER
    25: ("cat-sillas", 8, 2, 4),
    26: ("cat-sillas", 8, 2, 4),
    # TECLADOS
    50: ("cat-teclados", 8, 2, 4),
    51: ("cat-teclados", 8, 2, 4),
    52: ("cat-teclados", 8, 2, 4),
    # IMPRESORAS
    30: ("cat-impresoras", 8, 2, 4),
    55: ("cat-impresoras", 8, 2, 4),
    56: ("cat-impresoras", 8, 2, 4),
    # TARJETAS DE VIDEO
    31: ("cat-video", 8, 2, 4),
    # DISCOS DUROS
    57: ("cat-discos", 8, 2, 4),
    58: ("cat-discos", 8, 2, 4),
    # UPS / POWER BANK
    64: ("cat-ups", 8, 2, 4),  # PROTECTORES
    65: ("cat-ups", 8, 2, 4),  # REGULADORES
    66: ("cat-ups", 8, 2, 4),  # UPS/POWER BANK
    # TELEVISORES
    86: ("cat-monitores", 8, 2, 4),  # TELEVISORES (a monitores)
    # ACCESORIOS VARIOS (categoría genérica)
    27: ("cat-accesorios", 8, 2, 4),  # MESAS
    28: ("cat-accesorios", 8, 2, 4),  # BOLSOS
    29: ("cat-accesorios", 8, 2, 4),
    35: ("cat-accesorios", 8, 2, 4),  # ADAPTADORES DE AUDIO
    36: ("cat-accesorios", 8, 2, 4),  # MICROFONOS
    37: ("cat-accesorios", 8, 2, 4),  # ADAPTADORES Y CABLES
    38: ("cat-accesorios", 8, 2, 4),
    39: ("cat-accesorios", 8, 2, 4),
    40: ("cat-accesorios", 8, 2, 4),
    41: ("cat-accesorios", 8, 2, 4),
    42: ("cat-accesorios", 8, 2, 4),
    43: ("cat-accesorios", 8, 2, 4),
    44: ("cat-accesorios", 8, 2, 4),
    45: ("cat-accesorios", 8, 2, 4),  # MALETINES
    46: ("cat-cargadores", 8, 2, 4),  # CARGADORES DE LAPTOP
    47: ("cat-accesorios", 8, 2, 4),  # MOUSE PAD
    48: ("cat-discos", 8, 2, 4),  # PEN DRIVE
    49: ("cat-discos", 8, 2, 4),  # MICRO SD
    53: ("cat-accesorios", 8, 2, 4),  # ELECTRONICA
    54: ("cat-accesorios", 8, 2, 4),
    59: ("cat-fuentes", 8, 2, 4),  # FAN COOLERS/FUENTES
    61: ("cat-accesorios", 8, 2, 4),  # ENTRETENIMIENTO
    62: ("cat-accesorios", 8, 2, 4),
    63: ("cat-accesorios", 8, 2, 4),
    67: ("cat-celulares", 8, 2, 4),  # TELEFONIA
    68: ("cat-celulares", 8, 2, 4),
    69: ("cat-celulares", 8, 2, 4),
    70: ("cat-accesorios", 8, 2, 4),  # HOGAR
    71: ("cat-accesorios", 8, 2, 4),
    72: ("cat-accesorios", 8, 2, 4),
    73: ("cat-accesorios", 8, 2, 4),  # DEPORTE
    74: ("cat-accesorios", 8, 2, 4),
    75: ("cat-accesorios", 8, 2, 4),  # SALUD
    76: ("cat-accesorios", 8, 2, 4),  # BELLEZA
    77: ("cat-accesorios", 8, 2, 4),
    78: ("cat-accesorios", 8, 2, 4),  # PROYECTORES
    79: ("cat-accesorios", 8, 2, 4),  # LECTOR CODIGO DE BARRA
    80: ("cat-accesorios", 8, 2, 4),  # OFICINA
    81: ("cat-accesorios", 8, 2, 4),
    82: ("cat-accesorios", 8, 2, 4),
    83: ("cat-accesorios", 8, 2, 4),  # MOTOS Y CARROS
    84: ("cat-accesorios", 8, 2, 4),
    85: ("cat-accesorios", 8, 2, 4),
    87: ("cat-accesorios", 8, 2, 4),  # MARCA XO
    88: ("cat-accesorios", 8, 2, 4),
    89: ("cat-accesorios", 8, 2, 4),  # CASCOS PARA MOTO
    90: ("cat-accesorios", 8, 2, 4),  # TRIPOIDES/BASES
}


def load_catalog_by_category():
    """Carga productos del catálogo agrupados por categoría"""
    text = CATALOG_TS.read_text(encoding="utf-8")
    products = []
    blocks = text.split("  {")
    for block in blocks[1:]:
        sku_m = re.search(r'sku:\s*"([^"]+)"', block)
        cat_m = re.search(r'categoryId:\s*"([^"]+)"', block)
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        if sku_m and cat_m and name_m:
            products.append({
                "sku": sku_m.group(1),
                "categoryId": cat_m.group(1),
                "name": name_m.group(1),
            })
    
    # Agrupar por categoría
    by_cat = {}
    for p in products:
        by_cat.setdefault(p["categoryId"], []).append(p)
    return by_cat


def fix_black_background(img):
    """Convierte el fondo negro a blanco manteniendo el producto"""
    arr = np.array(img.convert("RGB"))
    h, w = arr.shape[:2]
    
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    
    # Detectar píxeles negros (fondo)
    black_mask = (r < 30) & (g < 30) & (b < 30)
    
    # Convertir píxeles negros a blanco
    arr[black_mask] = [255, 255, 255]
    
    return Image.fromarray(arr)


def crop_page(page_num, rows, cols):
    """Recorta una página en grid rows x cols"""
    # Los archivos son page-01.png, page-02.png, etc. (2 dígitos)
    page_path = PAGES_DIR / f"page-{page_num:02d}.png"
    if not page_path.exists():
        # Probar con 3 dígitos
        page_path = PAGES_DIR / f"page-{page_num:03d}.png"
    if not page_path.exists():
        print(f"  ✗ Página {page_num} no encontrada")
        return []
    
    img = Image.open(page_path)
    w, h = img.size
    
    # Excluir header (10%) y footer (6%)
    top_margin = int(h * 0.10)
    bottom_margin = int(h * 0.06)
    usable_h = h - top_margin - bottom_margin
    
    cell_w = w // cols
    cell_h = usable_h // rows
    
    cards = []
    for r in range(rows):
        for c in range(cols):
            x1 = c * cell_w
            y1 = top_margin + r * cell_h
            x2 = x1 + cell_w
            y2 = y1 + cell_h
            
            card = img.crop((x1, y1, x2, y2))
            # Arreglar fondo negro
            card = fix_black_background(card)
            cards.append(card)
    
    return cards


def upload_to_r2(sku, img, format="JPEG", quality=90):
    """Sube una imagen a R2"""
    # Guardar temporalmente
    import io
    buf = io.BytesIO()
    if format == "JPEG":
        img.save(buf, format="JPEG", quality=quality, optimize=True)
        content_type = "image/jpeg"
        ext = "jpg"
    else:
        img.save(buf, format="PNG", optimize=True)
        content_type = "image/png"
        ext = "png"
    
    buf.seek(0)
    data = buf.read()
    
    # Como PNG preserva más calidad pero pesa más, usamos JPEG para productos
    # (más rápido de servir en la web)
    key = f"inversiones-valencia/products/{sku}.jpg"
    
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{urllib.parse.quote(key, safe='')}"
    req = urllib.request.Request(
        url,
        data=data,
        method="PUT",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": content_type,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status == 200
    except Exception as e:
        print(f"  ✗ Error subiendo {sku}: {e}")
        return False


def process_all():
    """Procesa todas las páginas y sube a R2"""
    print("=== Cargando catálogo ===")
    by_cat = load_catalog_by_category()
    total_in_catalog = sum(len(ps) for ps in by_cat.values())
    print(f"Total productos en catálogo: {total_in_catalog}")
    for cat, ps in sorted(by_cat.items()):
        print(f"  {cat}: {len(ps)} productos")
    
    # Para cada categoría, llevar un contador de qué producto tocar
    cat_counters = {cat: 0 for cat in by_cat}
    
    # Procesar páginas en orden de prioridad:
    # 1. CÁMARAS (página 7) - PRIORIDAD 1
    # 2. CÁMARAS WEB (página 8)
    # 3. Resto de páginas
    
    priority_order = [7, 8]  # Cámaras primero
    other_pages = [p for p in sorted(PAGE_MAP.keys()) if p not in priority_order]
    all_pages = priority_order + other_pages
    
    total_uploaded = 0
    total_failed = 0
    results = []
    
    for page_num in all_pages:
        if page_num not in PAGE_MAP:
            continue
        
        cat_id, expected, rows, cols = PAGE_MAP[page_num]
        page_path = PAGES_DIR / f"page-{page_num:02d}.png"
        if not page_path.exists():
            page_path = PAGES_DIR / f"page-{page_num:03d}.png"
        if not page_path.exists():
            print(f"\n=== Página {page_num} ({cat_id}) - NO RENDERIZADA, saltando ===")
            continue
        
        print(f"\n=== Página {page_num} ({cat_id}) - esperados {expected} productos ===")
        
        # Recortar
        cards = crop_page(page_num, rows, cols)
        print(f"  Tarjetas recortadas: {len(cards)}")
        
        # Subir cada tarjeta al siguiente producto de la categoría
        for i, card in enumerate(cards):
            products_in_cat = by_cat.get(cat_id, [])
            if cat_counters[cat_id] >= len(products_in_cat):
                print(f"  ⚠ No hay más productos en {cat_id}, saltando tarjeta {i+1}")
                break
            
            product = products_in_cat[cat_counters[cat_id]]
            cat_counters[cat_id] += 1
            
            # Subir a R2
            if upload_to_r2(product["sku"], card):
                total_uploaded += 1
                results.append({
                    "sku": product["sku"],
                    "name": product["name"],
                    "category": cat_id,
                    "page": page_num,
                    "card_index": i + 1,
                })
                if total_uploaded % 10 == 0:
                    print(f"  ✓ Subidas: {total_uploaded} (último: {product['sku']})")
            else:
                total_failed += 1
    
    print(f"\n{'='*60}")
    print(f"RESUMEN FINAL")
    print(f"{'='*60}")
    print(f"  ✓ Subidas: {total_uploaded}")
    print(f"  ✗ Fallidas: {total_failed}")
    print(f"  Total: {total_uploaded + total_failed}")
    print(f"\nPor categoría:")
    cat_counts = {}
    for r in results:
        cat_counts[r["category"]] = cat_counts.get(r["category"], 0) + 1
    for cat, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count} imágenes")
    
    # Guardar resultados
    output = CARDS_DIR / "_upload_results.json"
    output.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\nResultados: {output}")
    
    return results


if __name__ == "__main__":
    process_all()
