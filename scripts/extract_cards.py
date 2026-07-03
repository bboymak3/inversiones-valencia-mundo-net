#!/usr/bin/env python3
"""
Recorta tarjetas de producto del PDF del catálogo Telemaxca.

Estrategia:
1. Renderiza cada página del PDF como imagen PNG
2. Detecta tarjetas por el color turquesa del borde
3. Recorta cada tarjeta completa (con círculo, Ref, imagen, barra negra)
4. Hace OCR a la barra negra para obtener el nombre del producto
5. Hace matching del nombre con el catálogo
6. Sube a R2 con el SKU correcto

Estructura de cada tarjeta (de arriba a abajo):
- Borde turquesa alrededor
- Círculo verde turquesa en esquina superior izquierda
- "Ref $XX.XX" arriba (precio)
- Imagen del producto en el centro
- Barra negra con nombre del producto abajo
"""
import os
import re
import sys
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np
import pytesseract

# Configuración
PDF_PATH = Path("/home/z/my-project/catalogo_drive4.pdf")
PAGES_DIR = Path("/home/z/my-project/pdf_pages")
CARDS_DIR = Path("/home/z/my-project/pdf_cards")
CATALOG_TS = Path("/home/z/my-project/src/data/catalog.ts")
TESSDATA_PREFIX = "/home/z/my-project/tessdata"

# Rango de color turquesa del borde (HSV aproximado)
# Turquesa: H=170-190, S=100-255, V=100-255
# Verde turquesa del catálogo: ~#00d4d4 a #00cccc

os.makedirs(PAGES_DIR, exist_ok=True)
os.makedirs(CARDS_DIR, exist_ok=True)

# Configurar tesseract
os.environ["TESSDATA_PREFIX"] = TESSDATA_PREFIX


def render_page(page_num, dpi=150):
    """Renderiza una página del PDF como PNG"""
    output_prefix = str(PAGES_DIR / f"page-{page_num:02d}")
    if Path(f"{output_prefix}.png").exists():
        return f"{output_prefix}.png"
    subprocess.run([
        "pdftoppm", "-png", "-r", str(dpi),
        "-f", str(page_num), "-l", str(page_num),
        str(PDF_PATH), output_prefix
    ], check=True)
    # pdftoppm puede agregar -NN al nombre
    possible = [f"{output_prefix}.png", f"{output_prefix}-{page_num:02d}.png"]
    for p in possible:
        if Path(p).exists():
            return p
    return None


def detect_turquoise_borders(img):
    """Detecta regiones con borde turquesa en la imagen"""
    arr = np.array(img.convert("RGB"))
    h, w = arr.shape[:2]

    # Convertir a HSV para detectar turquesa
    img_hsv = img.convert("HSV")
    hsv = np.array(img_hsv)

    # Turquesa: H entre 165-195 (en escala 0-255 de PIL)
    # S alto (>100), V alto (>100)
    h_channel = hsv[:, :, 0]
    s_channel = hsv[:, :, 1]
    v_channel = hsv[:, :, 2]

    turquoise_mask = (
        ((h_channel >= 160) & (h_channel <= 200)) &
        (s_channel > 80) &
        (v_channel > 80)
    )

    return turquoise_mask, (h, w)


def find_card_boundaries(turquoise_mask, img_shape):
    """Encuentra límites de tarjetas analizando filas y columnas con bordes turquesa"""
    h, w = img_shape

    # Contar píxeles turquesa por fila
    row_counts = turquoise_mask.sum(axis=1)
    # Contar píxeles turquesa por columna
    col_counts = turquoise_mask.sum(axis=0)

    # Encontrar filas con mucha actividad turquesa (bordes horizontales)
    threshold_row = w * 0.05  # al menos 5% del ancho
    threshold_col = h * 0.05  # al menos 5% del alto

    rows_with_turquoise = np.where(row_counts > threshold_row)[0]
    cols_with_turquoise = np.where(col_counts > threshold_col)[0]

    if len(rows_with_turquoise) == 0 or len(cols_with_turquoise) == 0:
        return []

    # Agrupar filas consecutivas (son el mismo borde)
    def group_consecutive(arr, gap=20):
        if len(arr) == 0:
            return []
        groups = [[arr[0]]]
        for x in arr[1:]:
            if x - groups[-1][-1] <= gap:
                groups[-1].append(x)
            else:
                groups.append([x])
        return [(g[0], g[-1]) for g in groups]

    row_groups = group_consecutive(rows_with_turquoise)
    col_groups = group_consecutive(cols_with_turquoise)

    # Las tarjetas están entre pares consecutivos de bordes
    # Necesitamos al menos 2 grupos horizontales y 2 verticales
    if len(row_groups) < 2 or len(col_groups) < 2:
        return []

    cards = []
    for i in range(len(row_groups) - 1):
        for j in range(len(col_groups) - 1):
            y1 = row_groups[i][1]  # fin del borde superior
            y2 = row_groups[i + 1][0]  # inicio del borde inferior
            x1 = col_groups[j][1]  # fin del borde izquierdo
            x2 = col_groups[j + 1][0]  # inicio del borde derecho

            # Validar que el área sea razonable (no muy chica)
            area = (x2 - x1) * (y2 - y1)
            if area < (w * h * 0.005):  # menos del 0.5% de la página
                continue

            cards.append((x1, y1, x2, y2))

    return cards


def extract_text_from_card(card_img):
    """Extrae texto de la barra negra inferior de la tarjeta"""
    w, h = card_img.size
    # La barra negra está en el último ~15% de la tarjeta
    bar_y1 = int(h * 0.82)
    bar_y2 = int(h * 0.98)
    bar = card_img.crop((0, bar_y1, w, bar_y2))

    # OCR en la barra
    try:
        text = pytesseract.image_to_string(bar, lang="spa").strip()
        # Limpiar
        text = " ".join(text.split())
        return text
    except Exception as e:
        return ""


def extract_ref_from_card(card_img):
    """Extrae el precio (Ref $XX.XX) de la parte superior de la tarjeta"""
    w, h = card_img.size
    # El Ref está en el primer ~20% de la tarjeta
    top = card_img.crop((0, 0, w, int(h * 0.20)))
    try:
        text = pytesseract.image_to_string(top, lang="spa").strip()
        # Buscar patrón Ref $XX.XX o Ref XX.XX
        match = re.search(r"Ref\s*\$?\s*(\d+[.,]?\d*)", text, re.IGNORECASE)
        if match:
            return match.group(1).replace(",", ".")
    except:
        pass
    return None


def load_catalog_products():
    """Carga productos del catalog.ts"""
    text = CATALOG_TS.read_text(encoding="utf-8")
    # Patrón: sku: "..." ... name: "..."
    products = []
    # Buscar bloques de producto
    sku_pattern = re.compile(r'sku:\s*"([^"]+)"')
    name_pattern = re.compile(r'name:\s*"([^"]+)"')
    price_pattern = re.compile(r'price:\s*([\d.]+)')

    skus = sku_pattern.findall(text)
    names = name_pattern.findall(text)
    prices = price_pattern.findall(text)

    # Aparecen en orden, pero hay que alinearlos
    # sku aparece primero, luego name, luego price
    # Vamos a buscar por bloques
    products = []
    blocks = text.split("  {")
    for block in blocks[1:]:  # saltar el primero que es header
        sku_m = re.search(r'sku:\s*"([^"]+)"', block)
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        price_m = re.search(r'price:\s*([\d.]+)', block)
        if sku_m and name_m and price_m:
            products.append({
                "sku": sku_m.group(1),
                "name": name_m.group(1).upper(),
                "price": float(price_m.group(1)),
            })
    return products


def normalize_text(text):
    """Normaliza texto para matching"""
    text = text.upper().strip()
    # Quitar acentos
    replacements = {"Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U", "Ñ": "N"}
    for k, v in replacements.items():
        text = text.replace(k, v)
    # Quitar caracteres no alfanuméricos
    text = re.sub(r"[^A-Z0-9\s]", " ", text)
    # Colapsar espacios
    text = " ".join(text.split())
    return text


def match_product(ocr_text, ref_price, products):
    """Hace matching del texto OCR con un producto del catálogo"""
    if not ocr_text:
        return None

    ocr_norm = normalize_text(ocr_text)
    if not ocr_norm:
        return None

    best_match = None
    best_score = 0

    for prod in products:
        prod_norm = normalize_text(prod["name"])

        # Coincidencia exacta
        if ocr_norm == prod_norm:
            return prod

        # Coincidencia parcial: ¿el OCR contiene el nombre del producto?
        if prod_norm and len(prod_norm) > 3:
            # Token overlap
            ocr_tokens = set(ocr_norm.split())
            prod_tokens = set(prod_norm.split())
            if prod_tokens:
                overlap = len(ocr_tokens & prod_tokens) / len(prod_tokens)
                # Si el producto tiene pocas palabras, requerir más overlap
                if len(prod_tokens) <= 3 and overlap >= 0.67:
                    if overlap > best_score:
                        best_score = overlap
                        best_match = prod
                elif overlap >= 0.5 and len(prod_tokens) > 3:
                    if overlap > best_score:
                        best_score = overlap
                        best_match = prod

        # Matching por substring
        if prod_norm and len(prod_norm) > 5 and prod_norm in ocr_norm:
            score = len(prod_norm) / len(ocr_norm) if ocr_norm else 0
            if score > best_score:
                best_score = score
                best_match = prod

    return best_match


def process_page(page_num, products, save_cards=True):
    """Procesa una página del PDF y devuelve las tarjetas encontradas"""
    # 1. Renderizar página
    page_path = render_page(page_num)
    if not page_path:
        return []

    img = Image.open(page_path)

    # 2. Detectar bordes turquesa
    turquoise_mask, (h, w) = detect_turquoise_borders(img)

    # 3. Encontrar tarjetas
    cards = find_card_boundaries(turquoise_mask, (h, w))

    if not cards:
        # Fallback: dividir en grid 2x4 o 3x3
        print(f"  Página {page_num}: no se detectaron bordes, usando grid 2x4")
        # Layout típico: 2 filas de 4 productos, o 3 filas de 3
        # Vamos con 2x4 como default
        rows, cols = 2, 4
        cell_w = w // cols
        cell_h = (h - 100) // rows
        cards = []
        for r in range(rows):
            for c in range(cols):
                x1 = c * cell_w
                y1 = 100 + r * cell_h
                x2 = x1 + cell_w
                y2 = y1 + cell_h
                cards.append((x1, y1, x2, y2))

    results = []
    for i, (x1, y1, x2, y2) in enumerate(cards):
        card_img = img.crop((x1, y1, x2, y2))

        # 4. OCR del nombre (barra negra inferior)
        ocr_text = extract_text_from_card(card_img)

        # 5. Extraer precio (Ref)
        ref_price = extract_ref_from_card(card_img)

        # 6. Matching con catálogo
        match = match_product(ocr_text, ref_price, products)

        # Guardar tarjeta
        card_filename = f"page-{page_num:02d}-card-{i+1}.png"
        card_path = CARDS_DIR / card_filename
        if save_cards:
            card_img.save(card_path, "PNG")

        results.append({
            "page": page_num,
            "card_index": i + 1,
            "ocr_text": ocr_text,
            "ref_price": ref_price,
            "matched_sku": match["sku"] if match else None,
            "matched_name": match["name"] if match else None,
            "matched_price": match["price"] if match else None,
            "card_path": str(card_path),
        })

    return results


def main():
    print("=== Cargando catálogo ===")
    products = load_catalog_products()
    print(f"Productos en catálogo: {len(products)}")

    # Procesar páginas de prueba (2-6)
    test_pages = [2, 3, 4, 5, 6]
    all_results = []

    for page_num in test_pages:
        print(f"\n=== Procesando página {page_num} ===")
        results = process_page(page_num, products)
        all_results.extend(results)

        print(f"  Tarjetas encontradas: {len(results)}")
        for r in results:
            matched = f"→ {r['matched_sku']} ({r['matched_name'][:30]})" if r["matched_sku"] else "→ SIN MATCH"
            print(f"    Card {r['card_index']}: OCR='{r['ocr_text'][:40]}' {matched}")

    # Estadísticas
    matched_count = sum(1 for r in all_results if r["matched_sku"])
    print(f"\n=== ESTADÍSTICAS ===")
    print(f"  Total tarjetas: {len(all_results)}")
    print(f"  Con matching: {matched_count}")
    print(f"  Sin matching: {len(all_results) - matched_count}")
    print(f"  Tasa de matching: {matched_count*100/len(all_results):.1f}%")

    # Guardar resultados
    output_file = CARDS_DIR / "_results.json"
    output_file.write_text(json.dumps(all_results, indent=2, ensure_ascii=False))
    print(f"\nResultados guardados en: {output_file}")


if __name__ == "__main__":
    main()
