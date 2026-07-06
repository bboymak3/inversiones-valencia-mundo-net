#!/usr/bin/env python3
"""
Analiza las 2208 palabras clave del archivo CSV y las agrupa por categoría.
Genera un mapeo: categoría → 6 palabras clave principales (separadas con guiones).
"""
import re
import json
from pathlib import Path
from collections import defaultdict

KEYWORDS_FILE = Path("/home/z/my-project/keywords.csv")
OUTPUT = Path("/home/z/my-project/keywords_by_category.json")

# Definir categorías y palabras clave que las identifican
# Cada categoría tiene una lista de "triggers" - palabras que aparecen en las keywords
CATEGORY_TRIGGERS = {
    "cat-camaras": [
        "camaras de seguridad", "instalacion de camaras", "instalar camaras",
        "venta de camaras", "donde comprar camaras", "camaras de vigilancia",
        "camaras de seguridad wifi", "camaras de seguridad exterior",
        "camaras de seguridad inalambricas", "camara espia", "mini camara espia",
        "camaras de videovigilancia", "sistema de camaras", "camaras para casa",
        "camara vigilancia", "camaras inalambricas", "camara wifi exterior",
        "camara ezviz", "camara vigilancia wifi", "camaras wifi",
        "camara exterior wifi", "alarma con camara", "camara de vigilancia wifi",
        "camaras de seguridad precios", "camara seguridad", "videovigilancia",
        "cámaras de seguridad", "instalación de cámaras", "cámara de vigilancia",
        "hikvision", "dahua", "tp-link tapo", "v380", "yoosee", "ezviz",
        "camara ip", "camara cctv", "camara dome", "camara bala",
        "camara ptz", "camara solar", "camara bombillo", "camara 360",
        "camara panoramica", "camara interior", "camara exterior",
    ],
    "cat-webcams": [
        "camara web", "webcam", "camara para pc", "camara streaming",
        "camara videollamadas", "facecam", "camara 1080p", "camara hd",
    ],
    "cat-redes": [
        "router", "switch", "cable utp", "redes", "wifi", "acces point",
        "adaptador de red", "repetidor", "deco", "omada", "mercusys",
        "tp-link", "tplink", "linksys", "poe", " ethernet",
    ],
    "cat-audifonos": [
        "audifonos", "audifono", "auriculares", "headphone", "headset",
        "audífonos", "inalambricos", "gaming",
    ],
    "cat-mouse": [
        "mouse", "raton", "optico", "inalambrico", "gamer",
    ],
    "cat-teclados": [
        "teclado", "keyboard", "mecanico",
    ],
    "cat-monitores": [
        "monitor", "pantalla", "display", "led", "ips", "gaming monitor",
    ],
    "cat-cpu": [
        "cpu", "computadora", "pc", "torre", "i5", "i7", "i3", "ryzen",
        "procesador", "desktop",
    ],
    "cat-laptops": [
        "laptop", "notebook", "portatil", "acer", "lenovo", "dell", "hp",
        "msi", "macbook",
    ],
    "cat-discos": [
        "disco duro", "ssd", "hdd", "almacenamiento", "pendrive", "usb",
        "micro sd", "tarjeta de memoria", "memoria",
    ],
    "cat-parlantes": [
        "parlante", "bocina", "corneta", "altavoz", "speaker", "bluetooth",
        "soundbar",
    ],
    "cat-cases": [
        "case", "gabinete", "chasis", "cabinet", "tower case",
    ],
    "cat-cargadores": [
        "cargador", "cable", "lightning", "usb-c", "usbc", "power bank",
        "bateria", "carga",
    ],
    "cat-ups": [
        "ups", "estabilizador", "regulador", "protector", "inversor",
    ],
    "cat-impresoras": [
        "impresora", "toner", "tinta", "cartucho", "printer", "laser",
    ],
}

# Palabras clave a ignorar (muy genéricas o irrelevantes para nosotros)
IGNORE_KEYWORDS = [
    "mercado libre", "amazon", "walmart", "segunda mano", "usado",
    "fotografica", "fotografico", "video camara", "videocamara",
    "panasonic", "voigtlander", "yashica", "gadnic", "night owl",
    "compañia", "compañias", "empresa", "empresas", "vecinos",
    "objetivos", "seguros",
]


def load_keywords():
    """Carga las palabras clave del CSV"""
    keywords = []
    text = KEYWORDS_FILE.read_text(encoding="utf-8", errors="ignore")
    for line in text.splitlines():
        kw = line.strip().lower()
        if kw and len(kw) > 3:
            keywords.append(kw)
    return list(set(keywords))  # únicas


def assign_to_category(keyword):
    """Asigna una palabra clave a la mejor categoría"""
    scores = defaultdict(int)
    for cat, triggers in CATEGORY_TRIGGERS.items():
        for trigger in triggers:
            if trigger in keyword:
                scores[cat] += len(trigger.split())  # más palabras = más específico

    # Ignorar ciertas keywords
    for ignore in IGNORE_KEYWORDS:
        if ignore in keyword:
            return None

    if not scores:
        return None

    # Devolver la categoría con mayor score
    return max(scores.items(), key=lambda x: x[1])[0]


def pick_best_keywords(keywords_by_cat, n=6):
    """Selecciona las mejores 6 palabras clave por categoría"""
    result = {}
    for cat, kws in keywords_by_cat.items():
        # Ordenar por longitud (las más largas = más específicas)
        # y priorizar las que tienen "instalacion" o "wifi" o "exterior"
        def score(kw):
            s = 0
            if "instalacion" in kw or "instalar" in kw:
                s += 10
            if "wifi" in kw:
                s += 5
            if "exterior" in kw:
                s += 3
            if "casa" in kw:
                s += 2
            if "precio" in kw or "precios" in kw:
                s += 1
            s += len(kw.split())  # más palabras = mejor
            return s

        sorted_kws = sorted(kws, key=score, reverse=True)
        # Tomar las 6 mejores, únicas y variadas
        selected = []
        seen_words = set()
        for kw in sorted_kws:
            # Evitar duplicados de palabras principales
            words = set(kw.split())
            if len(words & seen_words) > 3:
                continue
            selected.append(kw)
            seen_words.update(words)
            if len(selected) >= n:
                break

        # Convertir a slug con guiones
        slug_parts = []
        for kw in selected:
            # Tomar solo las 2-3 palabras más importantes de cada keyword
            parts = kw.split()[:2]
            slug_parts.extend(parts)

        # Limitar a 6 palabras
        slug_parts = slug_parts[:6]
        slug = "-".join(slug_parts)
        # Limpiar
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        slug = re.sub(r'-+', '-', slug).strip('-')

        result[cat] = {
            "slug": slug,
            "keywords": selected,
        }

    return result


def main():
    print("=== Cargando palabras clave ===")
    keywords = load_keywords()
    print(f"Total palabras clave únicas: {len(keywords)}")

    print("\n=== Asignando palabras clave a categorías ===")
    keywords_by_cat = defaultdict(list)
    unassigned = 0
    for kw in keywords:
        cat = assign_to_category(kw)
        if cat:
            keywords_by_cat[cat].append(kw)
        else:
            unassigned += 1

    for cat in sorted(CATEGORY_TRIGGERS.keys()):
        print(f"  {cat}: {len(keywords_by_cat.get(cat, []))} palabras clave")
    print(f"  No asignadas: {unassigned}")

    print("\n=== Seleccionando mejores 6 palabras clave por categoría ===")
    result = pick_best_keywords(keywords_by_cat, n=6)

    for cat, data in sorted(result.items()):
        print(f"\n  {cat}:")
        print(f"    Slug: {data['slug']}")
        print(f"    Keywords: {data['keywords']}")

    # Guardar resultado
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False))
    print(f"\n✓ Resultado guardado en: {OUTPUT}")


if __name__ == "__main__":
    main()
