#!/usr/bin/env python3
"""
Segunda pasada: limpieza fina de los productos extraídos.
- Filtra productos con nombres muy cortos o truncados
- Mejora la categorización
- Combina nombres partidos en múltiples líneas
"""
import json
import re
from pathlib import Path

INPUT = Path("/home/z/my-project/products_extracted.json")
OUTPUT = Path("/home/z/my-project/products_clean.json")

def main():
    products = json.loads(INPUT.read_text())
    print(f"Productos originales: {len(products)}")

    cleaned = []
    for p in products:
        name = p["name"].strip()
        price = p["price"]

        # Filtros de calidad
        if len(name) < 4:
            continue
        if price <= 0 or price > 5000:
            continue
        # Filtro de ruido: solo números o muy corto
        if re.match(r'^[\d\s\.\,\$]+$', name):
            continue
        # Quitar "AGOTADO" del nombre
        if "AGOTADO" in name.upper():
            continue
        # Quitar nombres que son solo números con una letra
        if re.match(r'^[A-Z]\d+\s*\d*$', name):
            continue
        # Quitar URLs
        if "www." in name.lower() or "http" in name.lower():
            continue
        # Quitar nombres con "PRECIO"
        if name.upper().startswith("PRECIO"):
            continue
        # Quitar refs incompletas tipo "1", "2", "3"
        if re.match(r'^\d{1,2}$', name):
            continue

        # Limpiar el nombre
        name = re.sub(r'\s+', ' ', name).strip()
        # Quitar prefijos numéricos sueltos
        name = re.sub(r'^\d+\s+', '', name)
        # Quitar sufijos numéricos soltos al final
        name = re.sub(r'\s+\d+$', '', name)
        # Quitar el nombre "MOUSE MOUSE" duplicado
        name = re.sub(r'\b(\w+)\s+\1\b', r'\1', name, flags=re.IGNORECASE)

        if len(name) < 4:
            continue

        p["name"] = name
        cleaned.append(p)

    print(f"Productos tras limpieza: {len(cleaned)}")

    # Recategorizar basándose en el nombre limpio
    for p in cleaned:
        name_lower = p["name"].lower()

        # Reglas más estrictas
        if "camara web" in name_lower or "webcam" in name_lower or "cam 1080" in name_lower or "streamplify" in name_lower or "facecam" in name_lower:
            p["category_id"] = "cat-webcams"
            p["category_name"] = "Cámaras Web"
        elif "camara" in name_lower and ("seguridad" in name_lower or "tapo" in name_lower or "v380" in name_lower or "inalambrica" in name_lower or "panel solar" in name_lower or "bomba" in name_lower or "bombillo" in name_lower or "antena" in name_lower):
            p["category_id"] = "cat-camaras"
            p["category_name"] = "Cámaras de Seguridad"
        elif "cámara" in name_lower and ("seguridad" in name_lower or "inalambrica" in name_lower):
            p["category_id"] = "cat-camaras"
            p["category_name"] = "Cámaras de Seguridad"
        elif "router" in name_lower or "deco" in name_lower or "switch" in name_lower or "access point" in name_lower or "omada" in name_lower or "repetidor" in name_lower or "mercusys" in name_lower or "tplink" in name_lower or "tp-link" in name_lower or "linksys" in name_lower:
            p["category_id"] = "cat-redes"
            p["category_name"] = "Redes y Conectividad"
        elif "adaptador de red" in name_lower or "adaptador ub" in name_lower or "cable utp" in name_lower:
            p["category_id"] = "cat-redes"
            p["category_name"] = "Redes y Conectividad"
        elif "mouse" in name_lower:
            p["category_id"] = "cat-mouse"
            p["category_name"] = "Mouse"
        elif "teclado" in name_lower or "keyboard" in name_lower:
            p["category_id"] = "cat-teclados"
            p["category_name"] = "Teclados"
        elif "audifono" in name_lower or "auricular" in name_lower or "headphone" in name_lower or "audífonos" in name_lower:
            p["category_id"] = "cat-audifonos"
            p["category_name"] = "Audífonos"
        elif "monitor" in name_lower:
            p["category_id"] = "cat-monitores"
            p["category_name"] = "Monitores"
        elif "tablet" in name_lower or "swift" in name_lower or "j-force" in name_lower or "skypad" in name_lower or "xmoxee" in name_lower or "xmoxee" in name_lower or "moxee" in name_lower:
            p["category_id"] = "cat-tablets"
            p["category_name"] = "Tablets"
        elif "cpu" in name_lower or "ryzen" in name_lower or ("i5" in name_lower and "ram" in name_lower) or ("i7" in name_lower and "ram" in name_lower) or "i3 de" in name_lower:
            p["category_id"] = "cat-cpu"
            p["category_name"] = "Computadoras CPU"
        elif "ram" in name_lower or "ddr" in name_lower:
            p["category_id"] = "cat-ram"
            p["category_name"] = "Memorias RAM"
        elif "disco" in name_lower or " ssd" in name_lower or " hdd" in name_lower:
            p["category_id"] = "cat-discos"
            p["category_name"] = "Discos y SSD"
        elif "corneta" in name_lower:
            p["category_id"] = "cat-parlantes"
            p["category_name"] = "Parlantes y Cornetas"
        elif "parlante" in name_lower or "bocina" in name_lower:
            p["category_id"] = "cat-parlantes"
            p["category_name"] = "Parlantes y Bocinas"
        elif "fuente" in name_lower and ("550" in name_lower or "700" in name_lower or "600" in name_lower or "500" in name_lower or "650" in name_lower or "certificada" in name_lower or "w" in name_lower):
            p["category_id"] = "cat-fuentes"
            p["category_name"] = "Fuentes de Poder"
        elif "board" in name_lower or "tarjeta madre" in name_lower or "motherboard" in name_lower or "h410" in name_lower or "h81" in name_lower or "b450" in name_lower or "a320" in name_lower:
            p["category_id"] = "cat-boards"
            p["category_name"] = "Tarjetas Madre"
        elif "nvidia" in name_lower or "radeon" in name_lower or " gtx" in name_lower or " rtx" in name_lower or "gt 710" in name_lower or "gt 730" in name_lower or "gt 1030" in name_lower:
            p["category_id"] = "cat-video"
            p["category_name"] = "Tarjetas de Video"
        elif "cargador" in name_lower or "cable usbc" in name_lower or "cable lightning" in name_lower or "cable iphone" in name_lower:
            p["category_id"] = "cat-cargadores"
            p["category_name"] = "Cargadores y Cables Celular"
        elif "bateria" in name_lower or "power bank" in name_lower or "powerbank" in name_lower:
            p["category_id"] = "cat-baterias"
            p["category_name"] = "Baterías y Power Banks"
        elif "silla" in name_lower:
            p["category_id"] = "cat-sillas"
            p["category_name"] = "Sillas Gamer"
        elif "ups" in name_lower or "estabilizador" in name_lower:
            p["category_id"] = "cat-ups"
            p["category_name"] = "UPS y Estabilizadores"
        elif "impresora" in name_lower or "toner" in name_lower or "tinta" in name_lower:
            p["category_id"] = "cat-impresoras"
            p["category_name"] = "Impresoras y Tinta"
        elif "ventilador" in name_lower or "cooler" in name_lower or "fan " in name_lower:
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
        else:
            p["category_id"] = "cat-accesorios"
            p["category_name"] = "Accesorios"

    # Reasignar IDs secuenciales por categoría
    cat_counter = {}
    for p in cleaned:
        cid = p["category_id"]
        cat_counter[cid] = cat_counter.get(cid, 0) + 1
        p["id"] = f"{cid}-{cat_counter[cid]:04d}"
        prefix = cid.replace("cat-", "").upper()[:4]
        p["sku"] = f"IVMN-{prefix}-{cat_counter[cid]:04d}"
        # Slug
        slug = re.sub(r'[^a-z0-9]+', '-', p["name"].lower()).strip('-')[:50]
        p["slug"] = f"{slug}-{cat_counter[cid]}"
        # Emoji
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
            "cat-accesorios": "📦",
        }
        p["emoji"] = emojis.get(cid, "📦")
        # Color
        colors = ["#4CAF50", "#2E7D32", "#1B5E20", "#388E3C", "#5CB85C", "#66BB6A", "#43A047", "#00897B"]
        p["color"] = colors[cat_counter[cid] % len(colors)]
        # Descripciones
        p["short_desc"] = f"{p['name']} — disponible para venta al mayor y detal con stock sujeto a disponibilidad."
        p["long_desc"] = (
            f"{p['name']}. Producto del catálogo de Inversiones Valencia Mundo Net, "
            f"categoría: {p['category_name']}. Disponibilidad sujeta a stock, "
            f"consultar por WhatsApp para confirmar y conocer especificaciones detalladas."
        )

    OUTPUT.write_text(json.dumps(cleaned, indent=2, ensure_ascii=False))
    print(f"Productos finales: {len(cleaned)}")

    # Estadísticas
    print("\n=== Productos por categoría ===")
    cat_counts = {}
    for p in cleaned:
        cat_counts[p["category_id"]] = cat_counts.get(p["category_id"], 0) + 1
    for cid, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
        cat_name = next((p["category_name"] for p in cleaned if p["category_id"] == cid), cid)
        print(f"  {cat_name}: {count}")

if __name__ == "__main__":
    main()
