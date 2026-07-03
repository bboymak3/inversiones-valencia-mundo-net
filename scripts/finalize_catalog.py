#!/usr/bin/env python3
"""
Pasada final de categorización + generación del catálogo TS con R2.
- Recategoriza productos que quedaron en "Accesorios"
- Asigna imageR2Key: inversiones-valencia/products/{sku}.jpg
- Genera src/data/catalog.ts final
"""
import json
import re
from pathlib import Path

INPUT = Path("/home/z/my-project/products_clean.json")
OUTPUT_TS = Path("/home/z/my-project/src/data/catalog.ts")

# Reglas adicionales para recategorizar
def recategorize(p):
    name = p["name"].upper()
    n = p["name"].lower()

    # Categorías extra
    if "LAPTOP" in name or "NOTEBOOK" in name or "ACER" in name or "MSI THIN" in name or "ASPIRE" in name or "JEMIP ZENA" in name:
        return ("cat-laptops", "Laptops")
    if "CASE " in name or "GABINETE" in name or "CASE GAMEMAX" in name or "CASE AZZA" in name or "CASE MSI" in name or "CASE AEROCOOL" in name or "CASE JEMIP" in name:
        return ("cat-cases", "Gabinetes / Cases")
    if "ADAPTADOR" in name and ("RJ45" in name or "RED" in name or "TIPO C" in name or "USB RJ" in name or "USB 3.0" in name or "HAVIT" in name):
        return ("cat-redes", "Redes y Conectividad")
    if "CONECTOR" in name and "RJ45" in name:
        return ("cat-redes", "Redes y Conectividad")
    if "KEYSTON" in name or "COUPLER" in name:
        return ("cat-redes", "Redes y Conectividad")
    if "TESTER" in name and ("RJ45" in name or "RJ11" in name):
        return ("cat-redes", "Redes y Conectividad")
    if "PONCHADORA" in name:
        return ("cat-redes", "Redes y Conectividad")
    if "WEB" in name and "CAM" in name and "1080" in name:
        return ("cat-webcams", "Cámaras Web")
    if "WEBCAM" in name:
        return ("cat-webcams", "Cámaras Web")
    if "STREAMPLIFY" in name:
        return ("cat-webcams", "Cámaras Web")
    if "FACECAM" in name:
        return ("cat-webcams", "Cámaras Web")
    if "75HZ" in name or "144HZ" in name or "60HZ" in name or "100HZ" in name or "240HZ" in name:
        # Monitores con frecuencia
        return ("cat-monitores", "Monitores")
    if "MONITOR" in name or "ZETA ONE" in name or "ZETA GAMING" in name or "SUPREME" in name or "JEMIP ZETA" in name:
        return ("cat-monitores", "Monitores")
    if "I5 DE" in name or "I7 DE" in name or "I3 DE" in name or "RYZEN" in name:
        # CPU / Laptop
        if "LAPTOP" in name or "MSI" in name or "ACER" in name:
            return ("cat-laptops", "Laptops")
        return ("cat-cpu", "Computadoras CPU")
    if "CPU" in name:
        return ("cat-cpu", "Computadoras CPU")
    if "INTERCOMUNICADOR" in name:
        return ("cat-accesorios", "Intercomunicadores")
    if "PARLANTE" in name or "BOCINA" in name:
        return ("cat-parlantes", "Parlantes y Bocinas")
    if "CORNETA" in name:
        return ("cat-parlantes", "Parlantes y Cornetas")
    if "MARVO PULZ" in name or "INALAMBRICOS JEMIP" in name:
        return ("cat-parlantes", "Parlantes y Bocinas")
    if "TECLADO" in name or "KEYBOARD" in name:
        return ("cat-teclados", "Teclados")
    if "MOUSE" in name:
        return ("cat-mouse", "Mouse")
    if "AUDIFONO" in name or "AUDÍFONO" in name or "AURICULAR" in name:
        return ("cat-audifonos", "Audífonos")
    if "SILLA" in name:
        return ("cat-sillas", "Sillas Gamer")
    if "TABLET" in name or "SWIFT" in name or "SKYPAD" in name or "XMOBILE" in name or "MOXEE" in name or "J-FORCE" in name:
        return ("cat-tablets", "Tablets")
    if "RAM" in name and ("DDR" in name or "GB" in name):
        return ("cat-ram", "Memorias RAM")
    if "DISCO" in name or " SSD" in name or "SSD " in name:
        return ("cat-discos", "Discos y SSD")
    if "FUENTE" in name:
        return ("cat-fuentes", "Fuentes de Poder")
    if "BOARD" in name or "H410" in name or "H81" in name or "B450" in name or "A320" in name:
        return ("cat-boards", "Tarjetas Madre")
    if "NVIDIA" in name or "RADEON" in name or "GTX" in name or "RTX" in name or "GT 7" in name or "GT 10" in name:
        return ("cat-video", "Tarjetas de Video")
    if "CARGADOR" in name:
        return ("cat-cargadores", "Cargadores y Cables Celular")
    if "CABLE USB" in name or "CABLE USBC" in name or "CABLE LIGHTNING" in name or "CABLE IPHONE" in name or "CABLE AUX" in name:
        return ("cat-cables", "Cables")
    if "BATERIA" in name or "POWER BANK" in name or "POWERBANK" in name:
        return ("cat-baterias", "Baterías y Power Banks")
    if "UPS" in name or "ESTABILIZADOR" in name:
        return ("cat-ups", "UPS y Estabilizadores")
    if "IMPRESORA" in name or "TONER" in name or "TINTA" in name:
        return ("cat-impresoras", "Impresoras y Tinta")
    if "VENTILADOR" in name or "COOLER" in name or "FAN" in name:
        return ("cat-ventilacion", "Ventilación")
    if "MICA" in name or "VIDRIO" in name:
        return ("cat-micas", "Micas y Vidrios")
    if "FUNDA" in name:
        return ("cat-fundas", "Fundas")
    if "SOPORTE" in name:
        return ("cat-soportes", "Soportes")
    if "CAMARA" in name or "CÁMARA" in name:
        if "SEGURIDAD" in name or "TAPOL" in name or "TAPO" in name or "V380" in name or "INALAMBRICA" in name or "PANEL SOLAR" in name:
            return ("cat-camaras", "Cámaras de Seguridad")
        if "WEB" in name:
            return ("cat-webcams", "Cámaras Web")
        return ("cat-camaras", "Cámaras de Seguridad")
    if "ROUTER" in name or "DECO" in name or "SWITCH" in name or "OMADA" in name or "REPETIDOR" in name or "MERCUSYS" in name or "TPLINK" in name or "TP-LINK" in name or "LINKSYS" in name or "ACCESS POINT" in name:
        return ("cat-redes", "Redes y Conectividad")
    if "CABLE UTP" in name:
        return ("cat-redes", "Redes y Conectividad")
    if "HUB" in name or "USB-C" in name:
        return ("cat-cables", "Cables y Adaptadores")
    # Default
    return ("cat-accesorios", "Accesorios Varios")

def main():
    products = json.loads(INPUT.read_text())
    print(f"Productos originales: {len(products)}")

    # Recategorizar
    cat_map = {}
    for p in products:
        new_cat = recategorize(p)
        p["category_id"] = new_cat[0]
        p["category_name"] = new_cat[1]
        cat_map[new_cat[0]] = new_cat[1]

    # Reasignar IDs secuenciales por categoría
    cat_counter = {}
    for p in products:
        cid = p["category_id"]
        cat_counter[cid] = cat_counter.get(cid, 0) + 1
        idx = cat_counter[cid]
        p["id"] = f"{cid}-{idx:04d}"
        prefix = cid.replace("cat-", "").upper()[:4]
        p["sku"] = f"IVMN-{prefix}-{idx:04d}"
        # R2 key - esto es lo importante!
        p["r2_key"] = f"inversiones-valencia/products/{p['sku']}.jpg"
        # Slug
        slug = re.sub(r'[^a-z0-9]+', '-', p["name"].lower()).strip('-')[:50]
        p["slug"] = f"{slug}-{idx}"

    # Estadísticas
    print("\n=== Productos por categoría ===")
    cat_counts = {}
    for p in products:
        cat_counts[p["category_id"]] = cat_counts.get(p["category_id"], 0) + 1
    for cid, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat_map[cid]}: {count}")

    # Generar TypeScript
    print("\n=== Generando catalog.ts final con R2 ===")
    generate_ts(products, cat_map)
    print(f"✓ Guardado: {OUTPUT_TS}")
    print(f"\nTotal productos finales: {len(products)}")

def generate_ts(products, cat_map):
    # Categorías únicas con sort order
    cats_sorted = sorted(cat_map.items(), key=lambda x: -sum(1 for p in products if p["category_id"] == x[0]))

    icon_map = {
        "cat-camaras": "camera",
        "cat-webcams": "video",
        "cat-redes": "wifi",
        "cat-mouse": "mouse-pointer",
        "cat-teclados": "keyboard",
        "cat-audifonos": "headphones",
        "cat-monitores": "monitor",
        "cat-tablets": "tablet",
        "cat-cpu": "server",
        "cat-laptops": "laptop",
        "cat-cases": "box",
        "cat-ram": "memory-stick",
        "cat-discos": "hard-drive",
        "cat-parlantes": "volume-2",
        "cat-fuentes": "zap",
        "cat-boards": "circuit-board",
        "cat-video": "cpu",
        "cat-cargadores": "plug",
        "cat-baterias": "battery-charging",
        "cat-sillas": "armchair",
        "cat-ups": "shield",
        "cat-impresoras": "printer",
        "cat-ventilacion": "wind",
        "cat-cables": "cable",
        "cat-micas": "shield",
        "cat-fundas": "smartphone",
        "cat-soportes": "package",
        "cat-accesorios": "package",
    }

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
        "cat-laptops": "💻",
        "cat-cases": "📦",
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
        "cat-accesorios": "📦",
    }

    out = []
    out.append("// ============================================================")
    out.append("// Catálogo REAL extraído del PDF de Telemaxca")
    out.append("// Para Inversiones Valencia Mundo Net")
    out.append("// Las imágenes se sirven desde R2: ivmn-products bucket")
    out.append("// Ruta: inversiones-valencia/products/{SKU}.jpg")
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
    out.append("  imageR2Key: string; // ruta en R2: inversiones-valencia/products/{SKU}.jpg")
    out.append("  imageUrl?: string; // URL pública generada por R2 (se completa en runtime)")
    out.append("  specs: { label: string; value: string }[];")
    out.append("  tags: string[];")
    out.append("  rating: number;")
    out.append("  reviewCount: number;")
    out.append("};")
    out.append("")
    out.append("export const R2_BUCKET_NAME = 'ivmn-products';")
    out.append("export const R2_PRODUCTS_PREFIX = 'inversiones-valencia/products/';")
    out.append("")
    out.append("// Helper para construir la URL pública de una imagen en R2")
    out.append("// En desarrollo: /api/img/{sku}  (proxy local)")
    out.append("// En producción: https://pub-<hash>.r2.dev/inversiones-valencia/products/{sku}.jpg")
    out.append("//                o vía custom domain: https://img.inversionesvalencia.pages.dev/{sku}.jpg")
    out.append("export function getR2ImageUrl(r2Key: string | undefined, sku: string): string {")
    out.append("  if (!r2Key) {")
    out.append("    return `/api/img/${sku}`;")
    out.append("  }")
    out.append("  // Si la key ya viene con prefijo, usarla directamente vía proxy")
    out.append("  return `/api/img/${sku}`;")
    out.append("}")
    out.append("")
    out.append("export const CATEGORIES: Category[] = [")
    for i, (cid, cname) in enumerate(cats_sorted, 1):
        slug = cid.replace("cat-", "").replace("_", "-")
        desc = f"Catálogo de {cname.lower()} disponibles para venta al mayor y detal con stock sujeto a disponibilidad."
        out.append(f"  {{")
        out.append(f"    id: {json.dumps(cid)},")
        out.append(f"    name: {json.dumps(cname)},")
        out.append(f"    slug: {json.dumps(slug)},")
        out.append(f"    description: {json.dumps(desc)},")
        out.append(f"    icon: {json.dumps(icon_map.get(cid, 'package'))},")
        out.append(f"    sortOrder: {i},")
        out.append(f"  }},")
    out.append("];")
    out.append("")
    out.append("export const PRODUCTS: Product[] = [")
    colors = ["#4CAF50", "#2E7D32", "#1B5E20", "#388E3C", "#5CB85C", "#66BB6A", "#43A047", "#00897B"]
    for p in products:
        cid = p["category_id"]
        is_featured = "true" if p["price"] > 50 else "false"
        stock = 20 if p["price"] < 30 else (15 if p["price"] < 100 else 8)
        emoji = emojis.get(cid, "📦")
        color = colors[hash(p["sku"]) % len(colors)]
        short_desc = f"{p['name']} — disponible para venta al mayor y detal con stock sujeto a disponibilidad."
        long_desc = (
            f"{p['name']}. Producto del catálogo de Inversiones Valencia Mundo Net, "
            f"categoría: {p['category_name']}. Disponibilidad sujeta a stock, "
            f"consultar por WhatsApp para confirmar y conocer especificaciones detalladas."
        )
        out.append(f"  {{")
        out.append(f"    id: {json.dumps(p['id'])},")
        out.append(f"    categoryId: {json.dumps(cid)},")
        out.append(f"    sku: {json.dumps(p['sku'])},")
        out.append(f"    name: {json.dumps(p['name'])},")
        out.append(f"    slug: {json.dumps(p['slug'])},")
        out.append(f"    shortDescription: {json.dumps(short_desc)},")
        out.append(f"    longDescription: {json.dumps(long_desc)},")
        out.append(f"    price: {p['price']},")
        out.append(f"    currency: 'USD',")
        out.append(f"    stock: {stock},")
        out.append(f"    isFeatured: {is_featured},")
        out.append(f"    brand: 'Telemaxca',")
        out.append(f"    model: '',")
        out.append(f"    imageColor: {json.dumps(color)},")
        out.append(f"    imageEmoji: {json.dumps(emoji)},")
        out.append(f"    imageR2Key: {json.dumps(p['r2_key'])},")
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
