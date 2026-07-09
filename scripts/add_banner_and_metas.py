#!/usr/bin/env python3
"""
Agrega el banner a TODAS las páginas del sitio (excepto las comunas que ya lo tienen)
y optimiza los meta tags de cada página.
"""
from pathlib import Path
import re

BASE = Path("/home/z/my-project/polerones")

# Meta tags optimizados por página
META_TAGS = {
    "index.html": {
        "title": "JF GOD'S COMPANY | Polerones y Poleras Personalizadas Santiago Chile",
        "desc": "JF GOD'S COMPANY - Polerones y poleras personalizadas en Santiago de Chile 🇨🇱. Estampados DTF, vinilo textil y sublimación. Envíos a nivel nacional. Cotiza por WhatsApp +56 9 9150 2163.",
        "og_title": "JF GOD'S COMPANY - Polerones Personalizados Santiago 🇨🇱",
        "og_desc": "Estampados DTF, vinilo textil y sublimación en Santiago de Chile. Envíos a nivel nacional. Cotiza por WhatsApp +56 9 9150 2163.",
    },
    "servicios.html": {
        "title": "Servicios de Estampados y Personalización | JF GOD'S COMPANY Santiago",
        "desc": "Todos nuestros servicios: estampados DTF, vinilo, sublimación, polerones personalizados, gorras, bolsos, decoración de fiestas, candy bar, desayunos sorpresa y más en Santiago de Chile.",
        "og_title": "Servicios de Estampados y Personalización | JF GOD'S COMPANY",
        "og_desc": "21 servicios de estampados DTF, vinilo, sublimación, polerones, gorras, decoración de fiestas y más en Santiago.",
    },
    "comunas.html": {
        "title": "Comunas que Cubrimos | JF GOD'S COMPANY - Polerones Personalizados Santiago",
        "desc": "Listado de comunas donde realizamos envíos de polerones personalizados en Santiago y toda Chile. Buin, Lampa, Paine, Colina, Pirque, Conchalí, El Bosque y más.",
        "og_title": "Comunas que Cubrimos | JF GOD'S COMPANY Santiago",
        "og_desc": "Realizamos envíos de polerones personalizados a 20 comunas de Chile. Verifica si cubrimos tu zona.",
    },
    "quienes-somos.html": {
        "title": "Quiénes Somos | JF GOD'S COMPANY - Polerones Personalizados Santiago",
        "desc": "Conoce JF GOD'S COMPANY, tienda especializada en estampados DTF, vinilo y sublimación en Santiago de Chile. Ubicados en Lo Prado, Milton Rossel 7196.",
        "og_title": "Quiénes Somos | JF GOD'S COMPANY",
        "og_desc": "Tienda especializada en polerones personalizados y estampados textiles en Santiago de Chile.",
    },
    "dudas.html": {
        "title": "Preguntas Frecuentes | JF GOD'S COMPANY - Polerones Personalizados Santiago",
        "desc": "Preguntas frecuentes sobre polerones personalizados, estampados DTF, vinilo, sublimación y envíos en Chile. Resolvemos todas tus dudas.",
        "og_title": "Preguntas Frecuentes | JF GOD'S COMPANY",
        "og_desc": "10 preguntas y respuestas sobre polerones personalizados, técnicas de estampado y envíos en Chile.",
    },
    "contacto.html": {
        "title": "Contacto | JF GOD'S COMPANY - Polerones Personalizados Santiago",
        "desc": "Contacta con JF GOD'S COMPANY. WhatsApp +56 9 9150 2163. Ubicados en Lo Prado, Milton Rossel 7196, Santiago de Chile. Lun a Sáb 9AM-6PM.",
        "og_title": "Contacto | JF GOD'S COMPANY",
        "og_desc": "WhatsApp +56 9 9150 2163. Lo Prado, Milton Rossel 7196, Santiago de Chile.",
    },
    "informacion.html": {
        "title": "Guía de Estampados y Personalización | JF GOD'S COMPANY Santiago",
        "desc": "Guía completa sobre polerones personalizados, estampados DTF, vinilo, sublimación, gorras, regalos y más en Santiago de Chile.",
        "og_title": "Guía de Estampados y Personalización | JF GOD'S COMPANY",
        "og_desc": "Información completa sobre técnicas de estampado, personalización textil y servicios en Santiago.",
    },
    "politica-privacidad.html": {
        "title": "Política de Privacidad | JF GOD'S COMPANY",
        "desc": "Política de privacidad de JF GOD'S COMPANY - Polerones personalizados Santiago. Información sobre recopilación y uso de datos.",
        "og_title": "Política de Privacidad | JF GOD'S COMPANY",
        "og_desc": "Política de privacidad de JF GOD'S COMPANY.",
    },
}

# Meta tags para páginas de categorías
CATEGORIA_META = {
    "hombre.html": ("Polerones Personalizados para Hombre | JF GOD'S COMPANY Santiago", "Polerones y poleras personalizadas para hombre en Santiago. Diseños urbanos, deportivos y casuales. Estampados DTF, vinilo y sublimación. Envíos a toda Chile."),
    "mujer.html": ("Polerones Personalizados para Mujer | JF GOD'S COMPANY Santiago", "Polerones, crop tops y sudaderas personalizadas para mujer en Santiago. Diseños fashion y oversize. Estampados DTF, vinilo y sublimación."),
    "parejas.html": ("Polerones de Parejas Personalizados | JF GOD'S COMPANY Santiago", "Conjuntos de polerones para parejas en Santiago. King & Queen, dúo amor, aniversarios. Estampados personalizados con envíos a toda Chile."),
    "anime.html": ("Polerones Anime Personalizados | JF GOD'S COMPANY Santiago", "Polerones con diseños de anime: Naruto, Dragon Ball, One Piece y más. Otaku geek personalizado en Santiago. Envíos a toda Chile."),
    "escolares.html": ("Polerones Escolares Personalizados | JF GOD'S COMPANY Santiago", "Polerones de graduación, 4to medio, generaciones y grupos escolares en Santiago. Calidad class con envíos a toda Chile."),
    "corporativos.html": ("Polerones Corporativos para Empresas | JF GOD'S COMPANY Santiago", "Polerones para empresas con logo, bordado y estampado en Santiago. Uniformes y regalos corporativos. Precios por volumen."),
    "deportes.html": ("Polerones Deportivos Personalizados | JF GOD'S COMPANY Santiago", "Polerones para equipos deportivos, clubes y grupos en Santiago. Diseños a todo color con DTF y sublimación. Envíos nacionales."),
    "san-valentin.html": ("Polerones San Valentín Personalizados | JF GOD'S COMPANY Santiago", "Polerones personalizados para San Valentín en Santiago. Dúo amor, match, love y anniversary. Envíos a toda Chile."),
    "cumpleanos.html": ("Polerones de Cumpleaños Personalizados | JF GOD'S COMPANY Santiago", "Polerones personalizados para cumpleaños en Santiago. Diseños únicos para el cumpleañero. Estampados DTF y vinilo."),
    "familia.html": ("Polerones Familiares Personalizados | JF GOD'S COMPANY Santiago", "Polerones personalizados para toda la familia en Santiago. Conjuntos familiares únicos con envíos a toda Chile."),
    "marcas.html": ("Polerones de Marcas Personalizados | JF GOD'S COMPANY Santiago", "Polerones con diseños de tus marcas favoritas en Santiago. Nike, Adidas, Champion y más. Personalizados con DTF y vinilo."),
    "especiales.html": ("Polerones Diseños Especiales | JF GOD'S COMPANY Santiago", "Polerones con diseños especiales y personalizados totalmente a tu medida en Santiago. Estampados DTF, vinilo y sublimación."),
}

# HTML del banner
def banner_html(title, subtitle, asset_path=""):
    return f"""<!-- Banner -->
<section style="position:relative;width:100%;max-height:400px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1a1a1a">
  <img src="{asset_path}images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg" alt="{title}" style="width:100%;height:auto;max-height:400px;object-fit:cover;opacity:0.5">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.7) 100%);display:flex;align-items:center;justify-content:center;padding:1rem">
    <div style="text-align:center;max-width:800px">
      <h1 style="font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.5);margin-bottom:0.5rem">{title}</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:1rem;max-width:600px;margin:0 auto 1rem;text-shadow:0 1px 5px rgba(0,0,0,0.5)">{subtitle}</p>
      <a href="https://wa.me/56991502163?text=Hola%20JF%20GOD'S%20COMPANY" target="_blank" style="background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;box-shadow:0 4px 14px rgba(76,175,80,0.4)">💬 Cotizar por WhatsApp</a>
    </div>
  </div>
</section>"""


def update_page(filepath, meta_info, banner_title, banner_subtitle, asset_path=""):
    """Actualiza una página: meta tags + banner"""
    text = filepath.read_text(encoding="utf-8")
    
    # 1. Actualizar title
    old_title = re.search(r'<title>([^<]+)</title>', text)
    if old_title:
        text = text.replace(f'<title>{old_title.group(1)}</title>', f'<title>{meta_info["title"]}</title>')
    
    # 2. Actualizar meta description
    old_desc = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', text)
    if old_desc:
        text = text.replace(f'<meta name="description" content="{old_desc.group(1)}">', f'<meta name="description" content="{meta_info["desc"]}">')
    
    # 3. Agregar OG tags si no existen
    if 'og:title' not in text:
        og_tags = f"""  <meta property="og:type" content="website">
  <meta property="og:title" content="{meta_info.get('og_title', meta_info['title'])}">
  <meta property="og:description" content="{meta_info.get('og_desc', meta_info['desc'])}">
  <meta property="og:image" content="{asset_path}images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg">
  <meta property="og:locale" content="es_CL">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{meta_info.get('og_title', meta_info['title'])}">
  <meta name="twitter:description" content="{meta_info.get('og_desc', meta_info['desc'])}">
  <meta name="twitter:image" content="{asset_path}images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg">
"""
        # Insertar antes de </head>
        text = text.replace("</head>", og_tags + "</head>")
    else:
        # Actualizar OG existentes
        text = re.sub(r'<meta property="og:title" content="[^"]*"', f'<meta property="og:title" content="{meta_info.get("og_title", meta_info["title"])}"', text)
        text = re.sub(r'<meta property="og:description" content="[^"]*"', f'<meta property="og:description" content="{meta_info.get("og_desc", meta_info["desc"])}"', text)
    
    # 4. Agregar banner después del header (antes del primer section o breadcrumb)
    banner = banner_html(banner_title, banner_subtitle, asset_path)
    
    # Buscar el primer <section o <div class="breadcrumb
    if 'class="hero"' in text:
        # Ya tiene hero, reemplazarlo
        text = re.sub(r'<!-- Hero[^>]*-->.*?</section>', banner, text, count=1, flags=re.DOTALL)
    elif '<div class="breadcrumb">' in text:
        # Insertar antes del breadcrumb
        text = text.replace('<div class="breadcrumb">', banner + '\n<div class="breadcrumb">', 1)
    elif '<section' in text:
        # Insertar antes del primer section
        text = re.sub(r'(<section)', banner + r'\n\1', text, count=1)
    
    filepath.write_text(text, encoding="utf-8")


# === ACTUALIZAR PÁGINAS PRINCIPALES ===
print("=== Actualizando páginas principales ===")

# Index - no tocar el banner, solo metas
p = BASE / "index.html"
text = p.read_text(encoding="utf-8")
meta = META_TAGS["index.html"]
old_title = re.search(r'<title>([^<]+)</title>', text)
if old_title:
    text = text.replace(f'<title>{old_title.group(1)}</title>', f'<title>{meta["title"]}</title>')
old_desc = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', text)
if old_desc:
    text = text.replace(f'<meta name="description" content="{old_desc.group(1)}">', f'<meta name="description" content="{meta["desc"]}">')
p.write_text(text, encoding="utf-8")
print("  ✓ index.html (metas actualizados, banner ya existe)")

# Servicios
update_page(
    BASE / "servicios.html",
    META_TAGS["servicios.html"],
    "Nuestros Servicios",
    "Estampados DTF, vinilo, sublimación, polerones, gorras, decoración de fiestas y más en Santiago de Chile.",
)
print("  ✓ servicios.html")

# Comunas (listado)
update_page(
    BASE / "comunas.html",
    META_TAGS["comunas.html"],
    "Comunas que Cubrimos",
    "Realizamos envíos de polerones personalizados a 20 comunas de Chile. Verifica si cubrimos tu zona.",
)
print("  ✓ comunas.html")

# Quiénes somos
update_page(
    BASE / "quienes-somos.html",
    META_TAGS["quienes-somos.html"],
    "Quiénes Somos",
    "JF GOD'S COMPANY - Especialistas en polerones personalizados y estampados textiles en Santiago de Chile.",
)
print("  ✓ quienes-somos.html")

# Dudas
update_page(
    BASE / "dudas.html",
    META_TAGS["dudas.html"],
    "Preguntas Frecuentes",
    "Resolvemos las dudas más comunes sobre polerones personalizados, estampados y envíos en Chile.",
)
print("  ✓ dudas.html")

# Contacto
update_page(
    BASE / "contacto.html",
    META_TAGS["contacto.html"],
    "Contacto",
    "WhatsApp +56 9 9150 2163 · Lo Prado, Milton Rossel 7196, Santiago de Chile · Lun a Sáb 9AM-6PM",
)
print("  ✓ contacto.html")

# Información
update_page(
    BASE / "informacion.html",
    META_TAGS["informacion.html"],
    "Guía de Estampados y Personalización",
    "Conoce todo sobre polerones personalizados, estampados textiles y técnicas de impresión en Santiago.",
)
print("  ✓ informacion.html")

# Política de privacidad
update_page(
    BASE / "politica-privacidad.html",
    META_TAGS["politica-privacidad.html"],
    "Política de Privacidad",
    "Política de privacidad de JF GOD'S COMPANY - Polerones personalizados Santiago.",
)
print("  ✓ politica-privacidad.html")


# === ACTUALIZAR PÁGINAS DE CATEGORÍAS ===
print("\n=== Actualizando páginas de categorías ===")
cat_dir = BASE / "polerones-personalizados"
for filename, (title, desc) in CATEGORIA_META.items():
    p = cat_dir / filename
    if not p.exists():
        continue
    
    meta_info = {
        "title": title,
        "desc": desc,
        "og_title": title,
        "og_desc": desc,
    }
    
    # Título del banner = nombre de la categoría sin el "|"
    banner_title = title.split("|")[0].strip()
    banner_subtitle = desc[:100] + "..."
    
    update_page(p, meta_info, banner_title, banner_subtitle, asset_path="../")
    print(f"  ✓ {filename}")


# === ACTUALIZAR PÁGINAS DE COMUNAS (solo metas, ya tienen banner) ===
print("\n=== Actualizando metas de comunas ===")
comunas_dir = BASE / "comunas"
COMUNAS_NAMES = {
    "santiago": ("Santiago", "Región Metropolitana"),
    "conchali": ("Conchalí", "Región Metropolitana"),
    "el-bosque": ("El Bosque", "Región Metropolitana"),
    "la-granja": ("La Granja", "Región Metropolitana"),
    "huechuraba": ("Huechuraba", "Región Metropolitana"),
    "cerro-navia": ("Cerro Navia", "Región Metropolitana"),
    "san-bernardo": ("San Bernardo", "Región Metropolitana"),
    "san-joaquin": ("San Joaquín", "Región Metropolitana"),
    "independencia": ("Independencia", "Región Metropolitana"),
    "padre-hurtado": ("Padre Hurtado", "Región Metropolitana"),
    "buin": ("Buin", "Región Metropolitana"),
    "lampa": ("Lampa", "Región Metropolitana"),
    "paine": ("Paine", "Región Metropolitana"),
    "colina": ("Colina", "Región Metropolitana"),
    "pirque": ("Pirque", "Región Metropolitana"),
    "tiltil": ("Tiltil", "Región Metropolitana"),
    "san-pedro-de-la-paz": ("San Pedro de la Paz", "Bío Bío"),
    "melipilla": ("Melipilla", "Región Metropolitana"),
    "alhue": ("Alhué", "Región Metropolitana"),
    "san-pedro-de-atacama": ("San Pedro de Atacama", "Antofagasta"),
}

for slug, (name, region) in COMUNAS_NAMES.items():
    p = comunas_dir / f"{slug}.html"
    if not p.exists():
        continue
    
    text = p.read_text(encoding="utf-8")
    
    title = f"Polerones Personalizados en {name} | JF GOD'S COMPANY - {region}"
    desc = f"JF GOD'S COMPANY - Polerones y poleras personalizadas en {name}, {region}. Estampados DTF, vinilo y sublimación. Envíos a {name}. WhatsApp +56 9 9150 2163."
    
    # Actualizar title
    old_title = re.search(r'<title>([^<]+)</title>', text)
    if old_title:
        text = text.replace(f'<title>{old_title.group(1)}</title>', f'<title>{title}</title>')
    
    # Actualizar meta description
    old_desc = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', text)
    if old_desc:
        text = text.replace(f'<meta name="description" content="{old_desc.group(1)}">', f'<meta name="description" content="{desc}">')
    
    # Agregar OG tags si no existen
    if 'og:title' not in text:
        og_tags = f"""  <meta property="og:type" content="website">
  <meta property="og:title" content="Polerones Personalizados en {name} | JF GOD'S COMPANY">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="../images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg">
  <meta property="og:locale" content="es_CL">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Polerones Personalizados en {name} | JF GOD'S COMPANY">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="../images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg">
"""
        text = text.replace("</head>", og_tags + "</head>")
    
    p.write_text(text, encoding="utf-8")
    print(f"  ✓ {slug}.html")

print(f"\n✅ Todas las páginas actualizadas con banner + meta tags optimizados")
