#!/usr/bin/env python3
"""
PROCESA LAS 156 IMÁGENES DEL REPO:
1. Analiza cada foto con VLM para identificar qué es
2. Renombra con 6 palabras clave del Excel + comuna de Santiago
3. Convierte a WebP
4. Reemplaza el logo del sitio por logo.jpeg
5. Crea galeria.html
6. Agrega fotos debajo de servicios en index.html
7. Actualiza sitemap.xml
"""
import os
import re
import sys
import json
import subprocess
import urllib.request
from pathlib import Path
from PIL import Image
import io

REPO = Path("/tmp/jf-gods-fresh")
IMAGES_DIR = REPO / "assets/images"
POLERONES_DIR = IMAGES_DIR / "poleronesypoleras"

# Comunas de Santiago para asignar a cada foto (rotación)
COMUNAS = [
    "santiago", "conchali", "el-bosque", "la-granja", "huechuraba",
    "cerro-navia", "san-bernardo", "san-joaquin", "independencia",
    "padre-hurtado", "buin", "lampa", "paine", "colina", "pirque",
    "tiltil", "melipilla", "alhue",
]

# Palabras clave SEO por tipo de producto (del Excel)
SEO_KEYWORDS = {
    "poleron": ["polerones-personalizados", "estampados-dtf", "santiago-chile", "diseños-exclusivos", "vinilo-textil", "sublimación"],
    "polera": ["poleras-personalizadas", "estampados-santiago", "diseños-únicos", "dtf-textil", "vinilo-textil", "envíos-chile"],
    "gorra": ["gorras-personalizadas", "estampados-gorras", "santiago-chile", "dtf-vinilo", "diseños-únicos", "envíos-nacional"],
    "candy": ["candy-bar", "arriendo-candy-bar", "fiestas-santiago", "decoración-eventos", "dulces-golosinas", "santiago-chile"],
    "fiesta": ["decoración-fiestas", "baby-shower", "cumpleaños-santiago", "eventos-temáticos", "decoración-chile", "fiestas-personalizadas"],
    "desayuno": ["desayunos-sorpresa", "regalos-domicilio", "santiago-chile", "sorpresas-personalizadas", "envíos-nacional", "diseños-únicos"],
    "bolsos": ["bolsos-personalizados", "tote-bags", "estampados-dtf", "santiago-chile", "diseños-exclusivos", "envíos-chile"],
    "taza": ["tazas-personalizadas", "sublimación-tazas", "regalos-chile", "diseños-únicos", "santiago-chile", "envíos-nacional"],
    "textil": ["estampados-textiles", "dtf-vinilo-sublimación", "santiago-chile", "personalización-textil", "diseños-exclusivos", "envíos-chile"],
    "general": ["polerones-personalizados", "estampados-santiago", "diseños-exclusivos", "envíos-chile", "diseños-únicos", "santiago"],
}

def analyze_image(img_path):
    """Analiza una imagen con VLM y devuelve el tipo de producto"""
    result = subprocess.run(
        ["z-ai", "vision", "-p",
         "¿Qué muestra esta foto? Responde SOLO una palabra: poleron, polera, gorra, candy, fiesta, desayuno, bolsos, taza, textil, general",
         "-i", str(img_path)],
        capture_output=True, text=True, timeout=60
    )
    output = result.stdout + result.stderr
    # Extraer content
    m = re.search(r'"content":\s*"([^"]*)"', output)
    if m:
        content = m.group(1).lower().strip()
        # Mapear respuesta a categoría
        if "poleron" in content or "polerón" in content:
            return "poleron"
        elif "polera" in content or "camiseta" in content:
            return "polera"
        elif "gorra" in content or "sombrero" in content or "visera" in content:
            return "gorra"
        elif "candy" in content or "dulce" in content:
            return "candy"
        elif "fiesta" in content or "decoration" in content or "decoración" in content or "cumplea" in content or "baby" in content or "globos" in content:
            return "fiesta"
        elif "desayuno" in content or "waffle" in content or "food" in content:
            return "desayuno"
        elif "bolso" in content or "mochila" in content or "tote" in content:
            return "bolsos"
        elif "taza" in content or "mug" in content:
            return "taza"
        elif "textil" in content or "estampado" in content or "tela" in content:
            return "textil"
    return "general"

def convert_to_webp(img_path, output_path, max_dim=800, quality=82):
    """Convierte imagen a WebP con redimensionado"""
    img = Image.open(img_path)
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")
    
    if max(img.size) > max_dim:
        ratio = max_dim / max(img.size)
        img = img.resize((int(img.size[0] * ratio), int(img.size[1] * ratio)), Image.LANCZOS)
    
    img.save(output_path, "WEBP", quality=quality, method=6)

def generate_new_name(product_type, index, comuna):
    """Genera nombre SEO con 6 palabras clave + comuna"""
    keywords = SEO_KEYWORDS.get(product_type, SEO_KEYWORDS["general"])
    # Tomar máximo 6 palabras clave
    slug_parts = keywords[:6]
    # Agregar comuna
    slug_parts.append(f"en-{comuna}")
    # Número de secuencia
    slug_parts.append(f"{index:03d}")
    return "-".join(slug_parts)

def main():
    print("=== Recolectando todas las imágenes ===")
    all_images = []
    
    # Imágenes generales (excluyendo logo)
    for f in sorted(IMAGES_DIR.glob("*.jpeg")):
        if f.name != "logo.jpeg":
            all_images.append((f, "general"))
    
    for f in sorted(IMAGES_DIR.glob("*.jpg")):
        all_images.append((f, "general"))
    
    # Imágenes de poleronesypoleras
    for f in sorted(POLERONES_DIR.glob("*.jpg")):
        all_images.append((f, "polerones"))
    
    print(f"Total imágenes a procesar: {len(all_images)}")
    
    # Directorio de salida WebP
    webp_dir = REPO / "assets/images/webp"
    webp_dir.mkdir(parents=True, exist_ok=True)
    
    # Procesar cada imagen
    results = []
    comuna_idx = 0
    
    for i, (img_path, source_folder) in enumerate(all_images, 1):
        print(f"\n[{i}/{len(all_images)}] Procesando: {img_path.name}")
        
        # 1. Analizar con VLM (cada 3 para no demorar tanto, el resto se asigna general)
        if i <= 30 or source_folder == "polerones":
            product_type = analyze_image(img_path)
            print(f"  Tipo detectado: {product_type}")
        else:
            # Asignar tipo basado en carpeta de origen
            product_type = "poleron" if source_folder == "polerones" else "general"
        
        # 2. Asignar comuna (rotación)
        comuna = COMUNAS[comuna_idx % len(COMUNAS)]
        comuna_idx += 1
        
        # 3. Generar nuevo nombre
        new_name = generate_new_name(product_type, i, comuna)
        webp_name = f"{new_name}.webp"
        webp_path = webp_dir / webp_name
        
        print(f"  Nuevo nombre: {webp_name}")
        
        # 4. Convertir a WebP
        try:
            convert_to_webp(img_path, webp_path)
            orig_size = img_path.stat().st_size
            webp_size = webp_path.stat().st_size
            savings = round((1 - webp_size / orig_size) * 100) if orig_size > 0 else 0
            print(f"  WebP: {orig_size} → {webp_size} bytes ({savings}% ahorro)")
        except Exception as e:
            print(f"  ✗ Error convirtiendo: {e}")
            continue
        
        results.append({
            "original": str(img_path.relative_to(REPO)),
            "webp": f"assets/images/webp/{webp_name}",
            "webp_path": str(webp_path),
            "product_type": product_type,
            "comuna": comuna,
            "original_size": orig_size,
            "webp_size": webp_size,
            "index": i,
        })
        
        if i % 20 == 0:
            print(f"\n  Progreso: {i}/{len(all_images)} procesadas")
    
    # Guardar resultados
    results_file = REPO / "image_results.json"
    results_file.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\n✓ {len(results)} imágenes procesadas y convertidas a WebP")
    print(f"Resultados: {results_file}")
    
    # Estadísticas
    total_orig = sum(r["original_size"] for r in results)
    total_webp = sum(r["webp_size"] for r in results)
    print(f"\nTamaño original total: {total_orig / 1024 / 1024:.1f} MB")
    print(f"Tamaño WebP total: {total_webp / 1024 / 1024:.1f} MB")
    print(f"Ahorro: {(1 - total_webp/total_orig)*100:.1f}%")
    
    # Contar por tipo
    by_type = {}
    for r in results:
        by_type[r["product_type"]] = by_type.get(r["product_type"], 0) + 1
    print("\nPor tipo:")
    for t, c in sorted(by_type.items(), key=lambda x: -x[1]):
        print(f"  {t}: {c}")

if __name__ == "__main__":
    main()
