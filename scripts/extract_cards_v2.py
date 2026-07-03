#!/usr/bin/env python3
"""
EXTRACCIÓN ROBUSTA de tarjetas del PDF con matching mejorado.

Mejoras vs versión anterior:
1. Múltiples grids por página (2x4, 3x3, 2x3) - elige el mejor por OCR
2. Preprocesamiento de imagen para OCR (escala grises, contraste)
3. Matching con difflib.SequenceMatcher (similitud de strings)
4. Excluye header (primer 10%) y footer (último 6%)
5. Reporte de confianza por tarjeta
"""
import os
import re
import sys
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance
import numpy as np
import pytesseract
from difflib import SequenceMatcher

PDF_PATH = Path("/home/z/my-project/catalogo_drive4.pdf")
PAGES_DIR = Path("/home/z/my-project/pdf_pages")
CARDS_DIR = Path("/home/z/my-project/pdf_cards2")
CATALOG_TS = Path("/home/z/my-project/src/data/catalog.ts")
TESSDATA_PREFIX = "/home/z/my-project/tessdata"

os.makedirs(PAGES_DIR, exist_ok=True)
os.makedirs(CARDS_DIR, exist_ok=True)
os.environ["TESSDATA_PREFIX"] = TESSDATA_PREFIX


def render_page(page_num, dpi=150):
    output_prefix = str(PAGES_DIR / f"page-{page_num:02d}")
    if Path(f"{output_prefix}.png").exists():
        return f"{output_prefix}.png"
    subprocess.run([
        "pdftoppm", "-png", "-r", str(dpi),
        "-f", str(page_num), "-l", str(page_num),
        str(PDF_PATH), output_prefix
    ], check=True)
    possible = [f"{output_prefix}.png", f"{output_prefix}-{page_num:02d}.png"]
    for p in possible:
        if Path(p).exists():
            return p
    return None


def preprocess_for_ocr(img):
    """Preprocesa imagen para mejorar OCR"""
    # Convertir a escala de grises
    gray = img.convert("L")
    # Aumentar tamaño 2x
    w, h = gray.size
    gray = gray.resize((w * 2, h * 2), Image.LANCZOS)
    # Aumentar contraste
    enhancer = ImageEnhance.Contrast(gray)
    gray = enhancer.enhance(2.0)
    return gray


def ocr_text(img):
    """Hace OCR con preprocesamiento"""
    processed = preprocess_for_ocr(img)
    try:
        text = pytesseract.image_to_string(processed, lang="spa", config="--psm 7")
        text = " ".join(text.split())
        return text
    except:
        return ""


def normalize(text):
    """Normaliza texto para matching"""
    if not text:
        return ""
    text = text.upper().strip()
    replacements = {"Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U", "Ñ": "N"}
    for k, v in replacements.items():
        text = text.replace(k, v)
    text = re.sub(r"[^A-Z0-9\s]", " ", text)
    text = " ".join(text.split())
    return text


def similarity(a, b):
    """Similitud entre dos strings (0-1)"""
    if not a or not b:
        return 0
    return SequenceMatcher(None, a, b).ratio()


def load_catalog():
    """Carga productos del catálogo"""
    text = CATALOG_TS.read_text(encoding="utf-8")
    products = []
    blocks = text.split("  {")
    for block in blocks[1:]:
        sku_m = re.search(r'sku:\s*"([^"]+)"', block)
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        price_m = re.search(r'price:\s*([\d.]+)', block)
        if sku_m and name_m and price_m:
            products.append({
                "sku": sku_m.group(1),
                "name": name_m.group(1),
                "name_norm": normalize(name_m.group(1)),
                "price": float(price_m.group(1)),
            })
    return products


def match_product(ocr_text, products):
    """Matching mejorado con difflib"""
    if not ocr_text:
        return None, 0

    ocr_norm = normalize(ocr_text)
    if len(ocr_norm) < 3:
        return None, 0

    best_match = None
    best_score = 0

    for prod in products:
        prod_norm = prod["name_norm"]
        if not prod_norm:
            continue

        # Similitud directa
        score = similarity(ocr_norm, prod_norm)

        # Bonus si el nombre del producto está contenido en el OCR
        if prod_norm in ocr_norm:
            score = max(score, 0.85)

        # Bonus por token overlap
        ocr_tokens = set(ocr_norm.split())
        prod_tokens = set(prod_norm.split())
        if prod_tokens:
            overlap = len(ocr_tokens & prod_tokens) / len(prod_tokens)
            if overlap == 1.0:
                score = max(score, 0.9)
            elif overlap >= 0.7:
                score = max(score, 0.75)

        if score > best_score:
            best_score = score
            best_match = prod

    return best_match, best_score


def try_grid(img, rows, cols, products, page_num):
    """Intenta un grid específico y devuelve resultados con scoring"""
    w, h = img.size
    # Excluir header (10%) y footer (6%)
    top_margin = int(h * 0.10)
    bottom_margin = int(h * 0.06)
    usable_h = h - top_margin - bottom_margin

    cell_w = w // cols
    cell_h = usable_h // rows

    results = []
    total_score = 0
    matched_count = 0

    for r in range(rows):
        for c in range(cols):
            x1 = c * cell_w
            y1 = top_margin + r * cell_h
            x2 = x1 + cell_w
            y2 = y1 + cell_h

            card_img = img.crop((x1, y1, x2, y2))

            # OCR de la tarjeta completa (la barra negra está abajo)
            text = ocr_text(card_img)

            # Matching
            match, score = match_product(text, products)

            if match and score > 0.4:
                total_score += score
                matched_count += 1

            results.append({
                "page": page_num,
                "row": r + 1,
                "col": c + 1,
                "grid": f"{rows}x{cols}",
                "ocr_text": text,
                "matched_sku": match["sku"] if match and score > 0.4 else None,
                "matched_name": match["name"] if match and score > 0.4 else None,
                "score": round(score, 2),
                "card_img": card_img,
                "bbox": (x1, y1, x2, y2),
            })

    avg_score = total_score / len(results) if results else 0
    return results, avg_score, matched_count


def process_page(page_num, products):
    """Procesa una página probando múltiples grids"""
    page_path = render_page(page_num)
    if not page_path:
        return []

    img = Image.open(page_path)

    # Probar múltiples grids
    grids = [(2, 4), (3, 3), (2, 3), (3, 2), (1, 4), (2, 2)]
    best_results = []
    best_avg = 0
    best_matched = 0

    for rows, cols in grids:
        results, avg_score, matched = try_grid(img, rows, cols, products, page_num)
        if matched > best_matched or (matched == best_matched and avg_score > best_avg):
            best_results = results
            best_avg = avg_score
            best_matched = matched

    # Guardar tarjetas con matching
    saved = []
    for r in best_results:
        if r["matched_sku"] and r["score"] > 0.4:
            card_filename = f"{r['matched_sku']}.png"
            card_path = CARDS_DIR / card_filename
            r["card_img"].save(card_path, "PNG")
            saved.append({
                "sku": r["matched_sku"],
                "name": r["matched_name"],
                "ocr_text": r["ocr_text"],
                "score": r["score"],
                "page": r["page"],
                "grid": r["grid"],
                "card_path": str(card_path),
            })

    return saved, best_results, best_matched, len(best_results)


def main():
    print("=== Cargando catálogo ===")
    products = load_catalog()
    print(f"Productos en catálogo: {len(products)}")

    # Probar páginas 2-10
    test_pages = list(range(2, 11))
    all_matched = []
    all_results = []

    for page_num in test_pages:
        print(f"\n=== Página {page_num} ===")
        saved, results, matched, total = process_page(page_num, products)
        all_matched.extend(saved)
        all_results.extend(results)

        print(f"  Grids probados, mejor: {matched}/{total} tarjetas con matching")
        for s in saved:
            print(f"    ✓ {s['sku']} | score={s['score']} | OCR='{s['ocr_text'][:40]}'")

    # Estadísticas
    print(f"\n=== ESTADÍSTICAS FINALES ===")
    print(f"  Páginas procesadas: {len(test_pages)}")
    print(f"  Tarjetas con matching: {len(all_matched)}")
    print(f"  Productos únicos con imagen: {len(set(s['sku'] for s in all_matched))}")

    # Score promedio
    if all_matched:
        avg_score = sum(s["score"] for s in all_matched) / len(all_matched)
        print(f"  Score promedio: {avg_score:.2f}")
        high_confidence = sum(1 for s in all_matched if s["score"] > 0.7)
        print(f"  Alta confianza (>0.7): {high_confidence}")

    # Guardar resultados
    output_file = CARDS_DIR / "_results.json"
    output_file.write_text(json.dumps(all_matched, indent=2, ensure_ascii=False))
    print(f"\nResultados: {output_file}")


if __name__ == "__main__":
    main()
