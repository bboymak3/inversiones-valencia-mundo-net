#!/usr/bin/env python3
"""
Fase 2 CORREGIDA: Enriquece nombres y descripciones de productos en catalog.ts
Usa json.dumps para escapar correctamente comillas y caracteres especiales.
"""
import re
import json
from pathlib import Path

CATALOG_TS = Path("/home/z/my-project/src/data/catalog.ts")

# Plantillas por categoría
CATEGORY_ENRICHMENT = {
    "cat-camaras": {
        "prefix": "",
        "suffix": " - Instalación a Nivel Nacional",
        "short_desc": "Cámara de seguridad para videovigilancia. WiFi, acceso remoto desde celular. Envíos a toda Venezuela.",
        "long_desc": "Especialistas en instalación de cámaras de seguridad CCTV a nivel nacional en Venezuela. Cámaras de vigilancia WiFi con acceso remoto 24/7. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-webcams": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Cámara web HD para videollamadas y streaming. Envíos a toda Venezuela.",
        "long_desc": "Cámara web HD para videollamadas, streaming y reuniones online. Compatible con PC y laptop. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-redes": {
        "prefix": "",
        "suffix": " - Instalación y Envíos Nacionales",
        "short_desc": "Equipos de redes y conectividad WiFi. Router, switch, cableado UTP. Envíos a toda Venezuela.",
        "long_desc": "Equipos de redes y conectividad para hogar y oficina. Routers WiFi, switches y cableado UTP. Instalación a nivel nacional. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-audifonos": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Audífonos de alta calidad para PC y gaming. Envíos a toda Venezuela.",
        "long_desc": "Audífonos de alta calidad para PC, gaming y música. Con micrófono y sonido envolvente. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-mouse": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Mouse para computadora: inalámbrico, gaming, óptico. Envíos a toda Venezuela.",
        "long_desc": "Mouse para computadora: inalámbrico, gaming, óptico y mecánico. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-teclados": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Teclado mecánico, USB e inalámbrico. Envíos a toda Venezuela.",
        "long_desc": "Teclado mecánico, USB e inalámbrico para computadora y gaming. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-monitores": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Monitor LED y gaming para computadora. HDMI. Envíos a toda Venezuela.",
        "long_desc": "Monitor LED, gaming y profesional para computadora. Conexión HDMI y alta resolución. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-cpu": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Computadora CPU de escritorio. Intel y AMD. Envíos a toda Venezuela.",
        "long_desc": "Computadora de escritorio CPU con procesador Intel y AMD. Lista para usar. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-laptops": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Laptop portátil nueva y refurbished. Envíos a toda Venezuela.",
        "long_desc": "Laptop portátil nueva y refurbished. Marcas: Acer, Lenovo, Dell, HP. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-discos": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Disco duro, SSD, pendrive y micro SD. Envíos a toda Venezuela.",
        "long_desc": "Disco duro, SSD, pendrive y micro SD para almacenamiento. Para CCTV y computadora. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-parlantes": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Parlante y bocina Bluetooth. Envíos a toda Venezuela.",
        "long_desc": "Parlante, bocina y altavoz Bluetooth con excelente sonido. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-cases": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Case o gabinete gaming para computadora. Envíos a toda Venezuela.",
        "long_desc": "Case o gabinete gaming para computadora de escritorio. Diseño moderno con ventilación. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-cargadores": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Cargador, cable USB y power bank. Envíos a toda Venezuela.",
        "long_desc": "Cargador, cable USB, power bank y batería para celular. Carga rápida. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-ups": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "UPS, estabilizador y regulador. Envíos a toda Venezuela.",
        "long_desc": "UPS, estabilizador y regulador de corriente para proteger tus equipos. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
    "cat-impresoras": {
        "prefix": "",
        "suffix": " - Envíos a Toda Venezuela",
        "short_desc": "Impresora, toner y tinta. Envíos a toda Venezuela.",
        "long_desc": "Impresora, toner y tinta para oficina y hogar. Laser e inyección de tinta. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
    },
}

DEFAULT_ENRICHMENT = {
    "prefix": "",
    "suffix": " - Envíos a Toda Venezuela",
    "short_desc": "Producto disponible con envíos a toda Venezuela.",
    "long_desc": "Producto disponible en Inversiones Valencia Mundo Net. Envíos a toda Venezuela. Cotiza por WhatsApp +58 416-9726126.",
}


def js_string_escape(s):
    """Escapa un string para usarlo en JavaScript/TypeScript con comillas simples"""
    # Reemplazar comillas dobles y simples, backslashes
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    s = s.replace("'", "\\'")
    s = s.replace("\n", "\\n")
    s = s.replace("\r", "")
    return s


def process():
    print("=== Cargando catalog.ts ===")
    text = CATALOG_TS.read_text(encoding="utf-8")
    print(f"Tamaño: {len(text)} caracteres")

    # Patrón para encontrar bloques de producto
    # Cada producto es: { id: "...", categoryId: "...", sku: "...", name: "...", ... }
    # Vamos a usar regex para encontrar name:, shortDescription: y longDescription:

    # Encontrar cada producto individualmente
    # Patrón: categoryId: "cat-xxx" ... name: "..." ... shortDescription: "..." ... longDescription: "..."

    def replace_product(match):
        """Reemplaza name, shortDescription y longDescription de un producto"""
        full = match.group(0)

        # Extraer categoryId
        cat_m = re.search(r'categoryId:\s*\'([^\']+)\'', full)
        if not cat_m:
            return full
        cat_id = cat_m.group(1)

        # Extraer nombre original
        name_m = re.search(r'name:\s*\'([^\']+)\'', full)
        if not name_m:
            return full
        original_name = name_m.group(1)

        # Obtener enriquecimiento
        enrichment = CATEGORY_ENRICHMENT.get(cat_id, DEFAULT_ENRICHMENT)

        # Generar nuevos valores
        new_name = original_name + enrichment["suffix"]
        new_short = enrichment["short_desc"]
        new_long = enrichment["long_desc"]

        # Escapar para JS
        new_name_escaped = js_string_escape(new_name)
        new_short_escaped = js_string_escape(new_short)
        new_long_escaped = js_string_escape(new_long)

        # Reemplazar en el bloque
        full = re.sub(
            r"(name:\s*)'[^']*'",
            r"\g<1>'" + new_name_escaped + "'",
            full,
            count=1
        )
        full = re.sub(
            r"(shortDescription:\s*)'[^']*'",
            r"\g<1>'" + new_short_escaped + "'",
            full,
            count=1
        )
        full = re.sub(
            r"(longDescription:\s*)'[^']*'",
            r"\g<1>'" + new_long_escaped + "'",
            full,
            count=1
        )

        return full

    # Encontrar todos los bloques de producto
    # Cada producto empieza con "  {" y termina con "  },"
    # Vamos a procesar línea por línea es más seguro

    lines = text.split("\n")
    in_product = False
    current_cat = None
    current_name = None
    enriched_count = 0

    for i, line in enumerate(lines):
        # Detectar categoryId
        cat_m = re.search(r"categoryId:\s*'([^']+)'", line)
        if cat_m:
            current_cat = cat_m.group(1)

        # Detectar name
        name_m = re.search(r"name:\s*'([^']*)'", line)
        if name_m and current_cat:
            current_name = name_m.group(1)
            enrichment = CATEGORY_ENRICHMENT.get(current_cat, DEFAULT_ENRICHMENT)
            new_name = js_string_escape(current_name + enrichment["suffix"])
            lines[i] = re.sub(
                r"(name:\s*)'[^']*'",
                r"\g<1>'" + new_name + "'",
                line
            )

        # Detectar shortDescription
        short_m = re.search(r"shortDescription:\s*'[^']*'", line)
        if short_m and current_cat:
            enrichment = CATEGORY_ENRICHMENT.get(current_cat, DEFAULT_ENRICHMENT)
            new_short = js_string_escape(enrichment["short_desc"])
            lines[i] = re.sub(
                r"(shortDescription:\s*)'[^']*'",
                r"\g<1>'" + new_short + "'",
                line
            )

        # Detectar longDescription
        long_m = re.search(r"longDescription:\s*'[^']*'", line)
        if long_m and current_cat:
            enrichment = CATEGORY_ENRICHMENT.get(current_cat, DEFAULT_ENRICHMENT)
            new_long = js_string_escape(enrichment["long_desc"])
            lines[i] = re.sub(
                r"(longDescription:\s*)'[^']*'",
                r"\g<1>'" + new_long + "'",
                line
            )
            enriched_count += 1
            # Reset al final del producto
            if enriched_count % 100 == 0:
                print(f"  Enriquecidos: {enriched_count}")

    print(f"\nTotal enriquecidos: {enriched_count}")

    # Guardar
    new_text = "\n".join(lines)
    CATALOG_TS.write_text(new_text, encoding="utf-8")
    print(f"✓ catalog.ts actualizado ({len(new_text)} caracteres)")


if __name__ == "__main__":
    process()
