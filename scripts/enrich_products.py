#!/usr/bin/env python3
"""
Fase 2: Enriquece los nombres y descripciones de productos en catalog.ts
- Nombres más descriptivos con palabras clave SEO
- Descripciones enriquecidas con keywords naturales
- Mantiene el SKU intacto
"""
import re
from pathlib import Path

CATALOG_TS = Path("/home/z/my-project/src/data/catalog.ts")

# Plantillas de nombres enriquecidos por categoría
# Formato: nombre original → nombre enriquecido con keywords SEO
CATEGORY_NAME_ENRICHMENT = {
    "cat-camaras": {
        "prefix": "Cámara de Seguridad",
        "suffix": "Instalación a Nivel Nacional",
        "description_template": (
            "{name}. Especialistas en instalación de cámaras de seguridad CCTV "
            "a nivel nacional en Venezuela. Envíos a toda Venezuela. "
            "Cámaras de vigilancia WiFi con acceso remoto desde tu celular 24/7. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-webcams": {
        "prefix": "Cámara Web",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Cámara web HD para videollamadas, streaming y reuniones online. "
            "Compatible con PC y laptop. Envíos a toda Venezuela. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-redes": {
        "prefix": "Equipos de Red",
        "suffix": "Instalación y Envíos Nacionales",
        "description_template": (
            "{name}. Equipos de redes y conectividad para hogar y oficina. "
            "Routers WiFi, switches y cableado UTP. Instalación a nivel nacional. "
            "Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-audifonos": {
        "prefix": "Audífonos",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Audífonos de alta calidad para PC, gaming y música. "
            "Con micrófono y sonido envolvente. Envíos a toda Venezuela. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-mouse": {
        "prefix": "Mouse",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Mouse para computadora: inalámbrico, gaming, óptico y mecánico. "
            "Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-teclados": {
        "prefix": "Teclado",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Teclado mecánico, USB e inalámbrico para computadora y gaming. "
            "Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-monitores": {
        "prefix": "Monitor",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Monitor LED, gaming y profesional para computadora. "
            "Conexión HDMI y alta resolución. Envíos a toda Venezuela. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-cpu": {
        "prefix": "Computadora CPU",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Computadora de escritorio CPU con procesador Intel y AMD. "
            "Lista para usar. Envíos a toda Venezuela. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-laptops": {
        "prefix": "Laptop",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Laptop portátil nueva y refurbished. Marcas: Acer, Lenovo, Dell, HP. "
            "Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-discos": {
        "prefix": "Disco Duro y Almacenamiento",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Disco duro, SSD, pendrive y micro SD para almacenamiento. "
            "Para CCTV y computadora. Envíos a toda Venezuela. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-parlantes": {
        "prefix": "Parlante y Bocina",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Parlante, bocina y altavoz Bluetooth con excelente sonido. "
            "Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-cases": {
        "prefix": "Case / Gabinete",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Case o gabinete gaming para computadora de escritorio. "
            "Diseño moderno con ventilación. Envíos a toda Venezuela. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-cargadores": {
        "prefix": "Cargador y Cable",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Cargador, cable USB, power bank y batería para celular. "
            "Carga rápida. Envíos a toda Venezuela. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-ups": {
        "prefix": "UPS y Estabilizador",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. UPS, estabilizador y regulador de corriente para proteger tus equipos. "
            "Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126."
        ),
    },
    "cat-impresoras": {
        "prefix": "Impresora",
        "suffix": "Envíos a Toda Venezuela",
        "description_template": (
            "{name}. Impresora, toner y tinta para oficina y hogar. "
            "Laser e inyección de tinta. Envíos a toda Venezuela. "
            "Cotiza por WhatsApp +58 416-9726126."
        ),
    },
}

# Para categorías que no están en el mapa, usar genérico
DEFAULT_ENRICHMENT = {
    "prefix": "",
    "suffix": "Envíos a Toda Venezuela",
    "description_template": (
        "{name}. Producto disponible en Inversiones Valencia Mundo Net. "
        "Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126."
    ),
}


def enrich_name(original_name, category_id):
    """Enriquece el nombre del producto con SEO"""
    enrichment = CATEGORY_NAME_ENRICHMENT.get(category_id, DEFAULT_ENRICHMENT)

    # Si el nombre ya tiene el prefijo, no duplicar
    name_clean = original_name.strip()
    prefix = enrichment["prefix"].upper()
    suffix = enrichment["suffix"]

    # Si el nombre ya empieza con el prefijo, solo agregar sufijo
    if prefix and name_clean.upper().startswith(prefix):
        return f"{name_clean} - {suffix}"
    elif prefix:
        return f"{prefix} {name_clean} - {suffix}"
    else:
        return f"{name_clean} - {suffix}"


def enrich_description(original_name, category_id):
    """Genera una descripción enriquecida con palabras clave SEO"""
    enrichment = CATEGORY_NAME_ENRICHMENT.get(category_id, DEFAULT_ENRICHMENT)
    return enrichment["description_template"].format(name=original_name.strip())


def enrich_short_description(original_name, category_id):
    """Genera una descripción corta enriquecida"""
    enrichment = CATEGORY_NAME_ENRICHMENT.get(category_id, DEFAULT_ENRICHMENT)
    prefix = enrichment["prefix"]
    if prefix:
        return f"{prefix}: {original_name.strip()}. Disponible con envíos a toda Venezuela."
    else:
        return f"{original_name.strip()}. Disponible con envíos a toda Venezuela."


def process_catalog():
    """Procesa el catalog.ts y enriquece nombres y descripciones"""
    print("=== Cargando catalog.ts ===")
    text = CATALOG_TS.read_text(encoding="utf-8")
    print(f"Tamaño: {len(text)} caracteres")

    # Patrones para encontrar y reemplazar
    # name: "..." → name: "NOMBRE ENRIQUECIDO"
    # shortDescription: "..." → shortDescription: "DESC CORTA ENRIQUECIDA"
    # longDescription: "..." → longDescription: "DESC LARGA ENRIQUECIDA"

    # Encontrar todos los bloques de producto
    # Cada producto tiene: categoryId, name, shortDescription, longDescription

    # Vamos a procesar bloque por bloque
    blocks = text.split("  {")
    enriched_blocks = [blocks[0]]  # header

    count = 0
    for block in blocks[1:]:
        # Extraer categoryId
        cat_m = re.search(r'categoryId:\s*"([^"]+)"', block)
        if not cat_m:
            enriched_blocks.append(block)
            continue

        cat_id = cat_m.group(1)

        # Extraer nombre original
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        if not name_m:
            enriched_blocks.append(block)
            continue

        original_name = name_m.group(1)

        # Generar nombre y descripciones enriquecidos
        new_name = enrich_name(original_name, cat_id)
        new_short = enrich_short_description(original_name, cat_id)
        new_long = enrich_description(original_name, cat_id)

        # Reemplazar en el bloque
        # name: "original" → name: "nuevo"
        block = re.sub(
            r'(name:\s*")' + re.escape(original_name) + r'(")',
            r'\g<1>' + new_name.replace("\\", "\\\\").replace('"', '\\"') + r'\g<2>',
            block,
            count=1
        )

        # shortDescription
        block = re.sub(
            r'(shortDescription:\s*")([^"]*)(")',
            r'\g<1>' + new_short.replace("\\", "\\\\").replace('"', '\\"') + r'\g<3>',
            block,
            count=1
        )

        # longDescription
        block = re.sub(
            r'(longDescription:\s*")([^"]*)(")',
            r'\g<1>' + new_long.replace("\\", "\\\\").replace('"', '\\"') + r'\g<3>',
            block,
            count=1
        )

        enriched_blocks.append(block)
        count += 1

    print(f"\nProductos enriquecidos: {count}")

    # Guardar
    new_text = "  {".join(enriched_blocks)
    CATALOG_TS.write_text(new_text, encoding="utf-8")
    print(f"✓ catalog.ts actualizado ({len(new_text)} caracteres)")


if __name__ == "__main__":
    process_catalog()
