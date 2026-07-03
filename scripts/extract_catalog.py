#!/usr/bin/env python3
"""
Extractor del catálogo Telemaxca para Inversiones Valencia Mundo Net.
Lee el texto extraído del PDF y genera un array TypeScript con todos los productos.

Estructura detectada en el PDF:
- Cada página tiene 2 filas de 4 productos
- Formato: [línea de precios] [línea vacía] [nombres de productos 1-4]
- Precios: "Ref 105$" o "15.93$" o "Ref 105" (con número partido en otra línea)
- Headers de categoría: "REDES TP LINK", "CAMARAS", "MOUSE", "TABLETS", etc.
"""

import re
import json
from pathlib import Path

INPUT = Path("/home/z/my-project/catalogo.txt")
OUTPUT_JSON = Path("/home/z/my-project/products_extracted.json")
OUTPUT_TS = Path("/home/z/my-project/src/data/catalog-telemaxca.ts")

# Categorías detectadas en el catálogo
CATEGORIES_MAP = {
    "REDES TP LINK": ("cat-redes", "Redes TP-Link"),
    "REDES MERCUSYS": ("cat-redes", "Redes Mercusys"),
    "ROUTERS": ("cat-redes", "Routers"),
    "REDES": ("cat-redes", "Redes y Conectividad"),
    "CAMARAS": ("cat-camaras", "Cámaras de Seguridad"),
    "CAMARAS WEB": ("cat-webcams", "Cámaras Web"),
    "TABLETS": ("cat-tablets", "Tablets"),
    "CPU REFURBISHED": ("cat-cpu", "CPU Refurbished"),
    "CPU CLON": ("cat-cpu", "CPU Clon"),
    "CPU": ("cat-cpu", "Computadoras CPU"),
    "RAM": ("cat-ram", "Memorias RAM"),
    "DISCOS": ("cat-discos", "Discos Duros y SSD"),
    "MONITOR": ("cat-monitores", "Monitores"),
    "AUDIFONO": ("cat-audifonos", "Audífonos"),
    "MOUSE": ("cat-mouse", "Mouse"),
    "TECLADO": ("cat-teclados", "Teclados"),
    "CORNETAS": ("cat-cornetas", "Cornetas / Parlantes PC"),
    "FUENTE": ("cat-fuentes", "Fuentes de Poder"),
    "BOARD": ("cat-boards", "Tarjetas Madre"),
    "VIDEO": ("cat-video", "Tarjetas de Video"),
    "CABLE": ("cat-cables", "Cables"),
    "ACCESORIOS": ("cat-accesorios", "Accesorios"),
    "CELULAR": ("cat-celulares", "Accesorios Celulares"),
    "CARGADOR": ("cat-cargadores", "Cargadores"),
    "BATERIA": ("cat-baterias", "Baterías"),
    "PARLANTE": ("cat-parlantes", "Parlantes"),
    "BOCINA": ("cat-parlantes", "Bocinas"),
    "SOPORTE": ("cat-soportes", "Soportes"),
    "MICA": ("cat-micas", "Micas y Vidrios"),
    "FUNDAS": ("cat-fundas", "Fundas"),
    "IMPRESORA": ("cat-impresoras", "Impresoras"),
    "TONER": ("cat-toner", "Tóner y Tinta"),
    "UPS": ("cat-ups", "UPS y Estabilizadores"),
    "PROTECCION": ("cat-ups", "Protección Eléctrica"),
    "ESTABILIZADOR": ("cat-ups", "Estabilizadores"),
    "GAMER": ("cat-gamer", "Accesorios Gamer"),
    "SILLA": ("cat-sillas", "Sillas Gamer"),
    "COMBO": ("cat-combos", "Combos"),
    "VENTILADOR": ("cat-ventilacion", "Ventilación"),
    "COOLER": ("cat-ventilacion", "Coolers y Ventilación"),
}

def detect_category(line, current_cat):
    """Detecta si una línea es header de categoría. Retorna (cat_id, cat_name) o None."""
    line_upper = line.upper().strip()
    if not line_upper or len(line_upper) > 50:
        return None
    for key, (cat_id, cat_name) in CATEGORIES_MAP.items():
        if key in line_upper:
            return (cat_id, cat_name)
    return None

def extract_price(text):
    """Extrae un precio de un texto. Retorna float o None."""
    if not text:
        return None
    # Patrones: "Ref 105$", "15.93$", "Ref 105", "105$", "Ref 6.80", "1.234,56"
    # Limpiar
    text = text.replace("Ref", "").replace("REF", "").strip()
    # Quitar $ y separadores
    text = text.replace("$", "").strip()
    # Caso "105" (entero)
    if re.match(r'^\d+\.?\d*$', text):
        try:
            return float(text)
        except:
            return None
    # Caso decimal
    m = re.search(r'(\d+(?:[.,]\d+)?)', text)
    if m:
        try:
            val = m.group(1).replace(",", ".")
            return float(val)
        except:
            return None
    return None

def normalize_name(name):
    """Limpia el nombre del producto."""
    if not name:
        return ""
    name = re.sub(r'\s+', ' ', name).strip()
    # Title case para consistencia
    return name

def is_price_line(line):
    """Determina si una línea parece ser de precios."""
    if not line.strip():
        return False
    # Debe tener al menos un $ o "Ref"
    if "$" in line or "Ref" in line or "ref" in line:
        return True
    # O tener múltiples números decimals separados por espacios
    nums = re.findall(r'\d+\.\d+', line)
    if len(nums) >= 2:
        return True
    return False

def extract_products_from_lines(lines):
    """Extrae productos del texto con su categoría."""
    products = []
    current_cat_id = "cat-general"
    current_cat_name = "General"

    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line.strip():
            i += 1
            continue

        # Detectar header de categoría
        detected = detect_category(line, None)
        if detected:
            current_cat_id, current_cat_name = detected
            i += 1
            continue

        # Si es línea de precios, procesar
        if is_price_line(line):
            # Extraer todos los precios de la línea
            # Patrón: "Ref 105$  Ref 42$  Ref 21$" o "15.93$  21.88$  53$  17.63$"
            # Buscar todos los precios
            price_matches = re.findall(r'(?:Ref\s*)?(\d+(?:[.,]\d+)?)\s*\$?', line)
            prices = []
            for p in price_matches:
                try:
                    prices.append(float(p.replace(",", ".")))
                except:
                    pass

            # Buscar los nombres en las líneas siguientes (saltar líneas vacías y "AGOTADO")
            name_lines = []
            j = i + 1
            while j < len(lines) and j < i + 8:
                nl = lines[j].rstrip()
                if not nl.strip():
                    j += 1
                    continue
                if "AGOTADO" in nl.upper():
                    j += 1
                    continue
                if is_price_line(nl):
                    break
                if nl.strip() in ["www.Telemaxca.com", "@Telemaxca.com", "www.Telemaxca.com @Telemaxca.com"]:
                    j += 1
                    continue
                name_lines.append(nl.strip())
                if len(name_lines) >= 2:  # máximo 2 líneas de nombre
                    break
                j += 1

            # Los nombres suelen estar en columnas separadas por 2+ espacios
            if name_lines:
                # Combinar líneas de nombre
                combined_name = " ".join(name_lines)
                # Split por 2+ espacios
                parts = re.split(r'\s{2,}|\t', combined_name)
                parts = [p.strip() for p in parts if p.strip()]

                # Match precios con nombres
                for idx, price in enumerate(prices):
                    if idx < len(parts):
                        name = normalize_name(parts[idx])
                        if name and len(name) > 2 and price and price > 0:
                            # Filtro anti-ruido
                            if not re.match(r'^[A-ZÁÉÍÓÚÑ\s]+$', name) or len(name) > 5:
                                # Evitar URLs
                                if "www." not in name.lower() and "telemax" not in name.lower():
                                    products.append({
                                        "name": name,
                                        "price": price,
                                        "category_id": current_cat_id,
                                        "category_name": current_cat_name,
                                    })
        i += 1

    return products

def dedupe_and_clean(products):
    """Elimina duplicados y limpia productos."""
    seen = set()
    cleaned = []
    for p in products:
        key = (p["name"].lower(), p["price"])
        if key not in seen:
            seen.add(key)
            cleaned.append(p)
    return cleaned

def categorize_final(products):
    """Reasigna categoría basándose en el nombre del producto."""
    for p in products:
        name_lower = p["name"].lower()
        # Cámaras de seguridad
        if "camara" in name_lower and ("seguridad" in name_lower or "tapo" in name_lower or "v380" in name_lower or "inalambrica" in name_lower or "panel solar" in name_lower or "bomba" in name_lower or "bombillo" in name_lower):
            p["category_id"] = "cat-camaras"
            p["category_name"] = "Cámaras de Seguridad"
        elif "camara web" in name_lower or "webcam" in name_lower:
            p["category_id"] = "cat-webcams"
            p["category_name"] = "Cámaras Web"
        elif "mouse" in name_lower:
            p["category_id"] = "cat-mouse"
            p["category_name"] = "Mouse"
        elif "teclado" in name_lower or "keyboard" in name_lower:
            p["category_id"] = "cat-teclados"
            p["category_name"] = "Teclados"
        elif "audifono" in name_lower or "auricular" in name_lower or "headphone" in name_lower:
            p["category_id"] = "cat-audifonos"
            p["category_name"] = "Audífonos"
        elif "monitor" in name_lower:
            p["category_id"] = "cat-monitores"
            p["category_name"] = "Monitores"
        elif "router" in name_lower or "deco" in name_lower or "switch" in name_lower or "access point" in name_lower or "adaptador de red" in name_lower or "repetidor" in name_lower:
            p["category_id"] = "cat-redes"
            p["category_name"] = "Redes y Conectividad"
        elif "cable utp" in name_lower:
            p["category_id"] = "cat-redes"
            p["category_name"] = "Redes y Conectividad"
        elif "tablet" in name_lower:
            p["category_id"] = "cat-tablets"
            p["category_name"] = "Tablets"
        elif "cpu" in name_lower or "ryzen" in name_lower or "i5" in name_lower or "i7" in name_lower or "i3" in name_lower:
            p["category_id"] = "cat-cpu"
            p["category_name"] = "Computadoras CPU"
        elif "ram" in name_lower or "ddr" in name_lower:
            p["category_id"] = "cat-ram"
            p["category_name"] = "Memorias RAM"
        elif "disco" in name_lower or "ssd" in name_lower or "hdd" in name_lower:
            p["category_id"] = "cat-discos"
            p["category_name"] = "Discos y SSD"
        elif "corneta" in name_lower or "parlante" in name_lower or "bocina" in name_lower:
            p["category_id"] = "cat-parlantes"
            p["category_name"] = "Parlantes y Bocinas"
        elif "fuente" in name_lower:
            p["category_id"] = "cat-fuentes"
            p["category_name"] = "Fuentes de Poder"
        elif "board" in name_lower or "tarjeta madre" in name_lower or "motherboard" in name_lower:
            p["category_id"] = "cat-boards"
            p["category_name"] = "Tarjetas Madre"
        elif "video" in name_lower and ("tarjeta" in name_lower or "nvidia" in name_lower or "radeon" in name_lower or "gtx" in name_lower or "rtx" in name_lower):
            p["category_id"] = "cat-video"
            p["category_name"] = "Tarjetas de Video"
        elif "cargador" in name_lower:
            p["category_id"] = "cat-cargadores"
            p["category_name"] = "Cargadores"
        elif "bateria" in name_lower:
            p["category_id"] = "cat-baterias"
            p["category_name"] = "Baterías"
        elif "silla" in name_lower:
            p["category_id"] = "cat-sillas"
            p["category_name"] = "Sillas Gamer"
        elif "ups" in name_lower or "estabilizador" in name_lower:
            p["category_id"] = "cat-ups"
            p["category_name"] = "UPS y Estabilizadores"
        elif "impresora" in name_lower:
            p["category_id"] = "cat-impresoras"
            p["category_name"] = "Impresoras"
        elif "ventilador" in name_lower or "cooler" in name_lower:
            p["category_id"] = "cat-ventilacion"
            p["category_name"] = "Ventilación"
        elif "cable" in name_lower:
            p["category_id"] = "cat-cables"
            p["category_name"] = "Cables"
        elif "mica" in name_lower or "vidrio" in name_lower:
            p["category_id"] = "cat-micas"
            p["category_name"] = "Micas y Vidrios"
        elif "funda" in name_lower:
            p["category_id"] = "cat-fundas"
            p["category_name"] = "Fundas"
        elif "soporte" in name_lower:
            p["category_id"] = "cat-soportes"
            p["category_name"] = "Soportes"
    return products

def make_slug(name, idx):
    """Genera un slug único."""
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    slug = slug[:50]
    return f"{slug}-{idx}"

def make_sku(idx, cat_id):
    """Genera un SKU."""
    prefix = cat_id.replace("cat-", "").upper()[:4]
    return f"IVMN-{prefix}-{idx:04d}"

def generate_emoji(category_id):
    """Asigna un emoji según la categoría."""
    emojis = {
        "cat-camaras": "📷",
        "cat-webcams": "📹",
        "cat-redes": "📡",
        "cat-mouse": "🖱️",
        "cat-teclados": "⌨️",
        "cat-audifonos": "🎧",
        "cat-monitores": "🖥️",
        "cat-tablets": "📱",
        "cat-cpu": "💻",
        "cat-ram": "🔀",
        "cat-discos": "💾",
        "cat-parlantes": "🔊",
        "cat-fuentes": "⚡",
        "cat-boards": "🔧",
        "cat-video": "🎮",
        "cat-cargadores": "🔌",
        "cat-baterias": "🔋",
        "cat-sillas": "🪑",
        "cat-ups": "🛡️",
        "cat-impresoras": "🖨️",
        "cat-ventilacion": "❄️",
        "cat-cables": "🔌",
        "cat-micas": "🛡️",
        "cat-fundas": "📱",
        "cat-soportes": "🏗️",
        "cat-general": "📦",
    }
    return emojis.get(category_id, "📦")

def make_color(category_id, idx):
    """Genera un color de fondo para el placeholder del producto."""
    colors = ["#4CAF50", "#2E7D32", "#1B5E20", "#388E3C", "#5CB85C", "#66BB6A", "#43A047", "#00897B"]
    return colors[idx % len(colors)]

def make_short_desc(name, category):
    """Genera una descripción corta."""
    return f"{name} — producto disponible para venta al mayor y detal."

def make_long_desc(name, category):
    """Genera una descripción larga."""
    return (f"{name}. Producto del catálogo de Inversiones Valencia Mundo Net, "
            f"categoría: {category}. Disponibilidad sujeta a stock. "
            f"Para conocer especificaciones detalladas, consultar por WhatsApp.")

def main():
    print("=== Leyendo texto extraído del PDF ===")
    text = INPUT.read_text(encoding='utf-8', errors='ignore')
    lines = text.split('\n')
    print(f"Total de líneas: {len(lines)}")

    print("\n=== Extrayendo productos ===")
    products = extract_products_from_lines(lines)
    print(f"Productos extraídos (raw): {len(products)}")

    print("\n=== Deduplicando ===")
    products = dedupe_and_clean(products)
    print(f"Productos únicos: {len(products)}")

    print("\n=== Recategorizando por nombre ===")
    products = categorize_final(products)

    # Generar IDs, slugs, SKUs
    for idx, p in enumerate(products, 1):
        p["id"] = f"prod-tl-{idx:04d}"
        p["slug"] = make_slug(p["name"], idx)
        p["sku"] = make_sku(idx, p["category_id"])
        p["emoji"] = generate_emoji(p["category_id"])
        p["color"] = make_color(p["category_id"], idx)
        p["short_desc"] = make_short_desc(p["name"], p["category_name"])
        p["long_desc"] = make_long_desc(p["name"], p["category_name"])

    # Estadísticas por categoría
    print("\n=== Productos por categoría ===")
    cat_counts = {}
    for p in products:
        cat_counts[p["category_id"]] = cat_counts.get(p["category_id"], 0) + 1
    for cat_id, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
        cat_name = next((p["category_name"] for p in products if p["category_id"] == cat_id), cat_id)
        print(f"  {cat_name}: {count}")

    # Guardar JSON
    OUTPUT_JSON.write_text(json.dumps(products, indent=2, ensure_ascii=False))
    print(f"\n✓ JSON guardado: {OUTPUT_JSON}")

    # Generar TypeScript
    print("\n=== Generando catálogo TypeScript ===")
    generate_ts(products)
    print(f"✓ TypeScript guardado: {OUTPUT_TS}")

    print(f"\n=== RESUMEN FINAL ===")
    print(f"Total productos: {len(products)}")
    print(f"Categorías: {len(cat_counts)}")

def generate_ts(products):
    """Genera el archivo TypeScript con el catálogo."""
    # Primero, generar lista de categorías únicas
    cats = {}
    for p in products:
        if p["category_id"] not in cats:
            cats[p["category_id"]] = {
                "id": p["category_id"],
                "name": p["category_name"],
                "slug": p["category_id"].replace("cat-", "").replace("_", "-"),
                "description": f"Catálogo de {p['category_name'].lower()} disponibles para venta al mayor y detal.",
                "icon": "package",
                "sortOrder": len(cats) + 1,
            }

    categories_list = list(cats.values())

    # Mapear iconos específicos
    icon_map = {
        "cat-camaras": "camera",
        "cat-webcams": "camera",
        "cat-redes": "wifi",
        "cat-mouse": "mouse",
        "cat-teclados": "keyboard",
        "cat-audifonos": "headphones",
        "cat-monitores": "monitor",
        "cat-tablets": "tablet",
        "cat-cpu": "monitor",
        "cat-ram": "memory",
        "cat-discos": "hard-drive",
        "cat-parlantes": "speaker",
        "cat-fuentes": "zap",
        "cat-boards": "circuit-board",
        "cat-video": "cpu",
        "cat-cargadores": "plug",
        "cat-baterias": "battery",
        "cat-sillas": "chair",
        "cat-ups": "shield",
        "cat-impresoras": "printer",
        "cat-ventilacion": "fan",
        "cat-cables": "cable",
        "cat-micas": "shield",
        "cat-fundas": "smartphone",
        "cat-soportes": "package",
        "cat-general": "package",
    }
    for cat in categories_list:
        cat["icon"] = icon_map.get(cat["id"], "package")

    # Generar archivo TS
    out = []
    out.append("// ============================================================")
    out.append("// Catálogo REAL extraído del PDF de Telemaxca")
    out.append("// Para Inversiones Valencia Mundo Net")
    out.append("// ============================================================")
    out.append("")
    out.append("export type Category = {")
    out.append("  id: string;")
    out.append("  name: string;")
    out.append("  slug: string;")
    out.append("  description: string;")
    out.append("  icon: string;")
    out.append("  sortOrder: number;")
    out.append("};")
    out.append("")
    out.append("export type Product = {")
    out.append("  id: string;")
    out.append("  categoryId: string;")
    out.append("  sku: string;")
    out.append("  name: string;")
    out.append("  slug: string;")
    out.append("  shortDescription: string;")
    out.append("  longDescription: string;")
    out.append("  price: number;")
    out.append("  compareAtPrice?: number;")
    out.append("  currency: string;")
    out.append("  stock: number;")
    out.append("  isFeatured: boolean;")
    out.append("  brand: string;")
    out.append("  model: string;")
    out.append("  imageColor: string;")
    out.append("  imageEmoji: string;")
    out.append("  specs: { label: string; value: string }[];")
    out.append("  tags: string[];")
    out.append("  rating: number;")
    out.append("  reviewCount: number;")
    out.append("};")
    out.append("")
    out.append("export const CATEGORIES: Category[] = [")
    for cat in categories_list:
        out.append(f"  {{")
        out.append(f"    id: {json.dumps(cat['id'])},")
        out.append(f"    name: {json.dumps(cat['name'])},")
        out.append(f"    slug: {json.dumps(cat['slug'])},")
        out.append(f"    description: {json.dumps(cat['description'])},")
        out.append(f"    icon: {json.dumps(cat['icon'])},")
        out.append(f"    sortOrder: {cat['sortOrder']},")
        out.append(f"  }},")
    out.append("];")
    out.append("")
    out.append("export const PRODUCTS: Product[] = [")
    for p in products:
        is_featured = "true" if p["price"] > 50 else "false"
        stock = 20 if p["price"] < 30 else (15 if p["price"] < 100 else 8)
        out.append(f"  {{")
        out.append(f"    id: {json.dumps(p['id'])},")
        out.append(f"    categoryId: {json.dumps(p['category_id'])},")
        out.append(f"    sku: {json.dumps(p['sku'])},")
        out.append(f"    name: {json.dumps(p['name'])},")
        out.append(f"    slug: {json.dumps(p['slug'])},")
        out.append(f"    shortDescription: {json.dumps(p['short_desc'])},")
        out.append(f"    longDescription: {json.dumps(p['long_desc'])},")
        out.append(f"    price: {p['price']},")
        out.append(f"    currency: 'USD',")
        out.append(f"    stock: {stock},")
        out.append(f"    isFeatured: {is_featured},")
        out.append(f"    brand: 'Telemaxca',")
        out.append(f"    model: '',")
        out.append(f"    imageColor: {json.dumps(p['color'])},")
        out.append(f"    imageEmoji: {json.dumps(p['emoji'])},")
        out.append(f"    specs: [")
        out.append(f"      {{ label: 'Precio', value: '${p['price']:.2f} USD' }},")
        out.append(f"      {{ label: 'Categoría', value: {json.dumps(p['category_name'])} }},")
        out.append(f"      {{ label: 'SKU', value: {json.dumps(p['sku'])} }},")
        out.append(f"      {{ label: 'Disponibilidad', value: 'Consultar stock' }},")
        out.append(f"    ],")
        out.append(f"    tags: ['al mayor', 'catalogo', {json.dumps(p['category_name'].lower())}],")
        out.append(f"    rating: 4.5,")
        out.append(f"    reviewCount: 0,")
        out.append(f"  }},")
    out.append("];")
    out.append("")
    # Helpers requeridos por los componentes existentes
    out.append("export const WHATSAPP_NUMBER = '584169726126';")
    out.append("export const WHATSAPP_DISPLAY = '+58 416-9726126';")
    out.append("")
    out.append("export function getProductsByCategory(categoryId: string): Product[] {")
    out.append("  return PRODUCTS.filter((p) => p.categoryId === categoryId);")
    out.append("}")
    out.append("")
    out.append("export function getFeaturedProducts(limit = 8): Product[] {")
    out.append("  return PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);")
    out.append("}")
    out.append("")
    out.append("export function getCategoryById(id: string): Category | undefined {")
    out.append("  return CATEGORIES.find((c) => c.id === id);")
    out.append("}")
    out.append("")
    out.append("export function getCategoryBySlug(slug: string): Category | undefined {")
    out.append("  return CATEGORIES.find((c) => c.slug === slug);")
    out.append("}")
    out.append("")
    out.append("export function buildWhatsAppLink(message: string): string {")
    out.append("  const encoded = encodeURIComponent(message);")
    out.append("  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;")
    out.append("}")
    out.append("")
    out.append("export function buildProductWhatsAppLink(product: Product): string {")
    out.append("  const msg = `Hola *Inversiones Valencia Mundo Net*, estoy interesado en el producto:")
    out.append("")
    out.append("📦 *${product.name}*")
    out.append("SKU: ${product.sku}")
    out.append("Precio: $${product.price} ${product.currency}")
    out.append("")
    out.append("¿Tienen disponibilidad? Quisiera más información y cotización. ¡Gracias!`;")
    out.append("  return buildWhatsAppLink(msg);")
    out.append("}")
    out.append("")
    out.append("export type CartItem = { product: Product; quantity: number };")
    out.append("")
    out.append("export function buildCartWhatsAppLink(items: { product: Product; quantity: number }[]): string {")
    out.append("  if (items.length === 0) {")
    out.append("    return buildWhatsAppLink(")
    out.append("      'Hola *Inversiones Valencia Mundo Net*, quisiera información sobre sus productos y servicios. ¡Gracias!'")
    out.append("    );")
    out.append("  }")
    out.append("  let msg = `Hola *Inversiones Valencia Mundo Net*, quisiera cotizar los siguientes productos:\\n\\n`;")
    out.append("  let subtotal = 0;")
    out.append("  items.forEach((item, idx) => {")
    out.append("    const lineTotal = item.product.price * item.quantity;")
    out.append("    subtotal += lineTotal;")
    out.append("    msg += `${idx + 1}. *${item.product.name}*\\n`;")
    out.append("    msg += `   Cantidad: ${item.quantity}\\n`;")
    out.append("    msg += `   Precio: $${item.product.price} ${item.product.currency}\\n`;")
    out.append("    msg += `   Subtotal: $${lineTotal.toFixed(2)} ${item.product.currency}\\n\\n`;")
    out.append("  });")
    out.append("  msg += `🧾 *TOTAL ESTIMADO: $${subtotal.toFixed(2)} USD*\\n\\n`;")
    out.append("  msg += `¿Tienen disponibilidad? ¿Cuál sería el costo de envío a Valencia? ¡Gracias!`;")
    out.append("  return buildWhatsAppLink(msg);")
    out.append("}")
    out.append("")

    OUTPUT_TS.write_text("\n".join(out), encoding='utf-8')

if __name__ == "__main__":
    main()
