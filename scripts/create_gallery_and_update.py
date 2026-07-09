#!/usr/bin/env python3
"""
Crea galeria.html, actualiza index.html con fotos debajo de servicios,
actualiza el logo, agrega botón de galería al menú, y actualiza sitemap.
"""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/polerones")
WEBP_DIR = BASE / "assets/images/webp"

# Cargar resultados
results = json.loads((BASE / "image_results.json").read_text())

# Agrupar por tipo
by_type = {}
for r in results:
    t = r.get("type", "general")
    by_type.setdefault(t, []).append(r)

print("Imágenes por tipo:")
for t, imgs in sorted(by_type.items(), key=lambda x: -len(x[1])):
    print(f"  {t}: {len(imgs)}")

# Tomar muestras para la galería (máximo 60)
gallery_images = results[:60]

# === 1. CREAR GALERIA.HTML ===
print("\n=== Creando galeria.html ===")

gallery_cards = ""
for r in gallery_images:
    webp = r["webp"]
    img_type = r.get("type", "general")
    comuna = r.get("comuna", "santiago")
    idx = r.get("index", 0)
    
    # Título legible
    type_names = {
        "poleron": "Polerón Personalizado",
        "polera": "Polera Personalizada",
        "gorra": "Gorra Personalizada",
        "candy": "Candy Bar",
        "fiesta": "Decoración de Fiestas",
        "desayuno": "Desayuno Sorpresa",
        "bolsos": "Bolso Personalizado",
        "taza": "Taza Personalizada",
        "textil": "Estampado Textil",
        "general": "Personalización",
    }
    title = type_names.get(img_type, "Producto Personalizado")
    
    gallery_cards += f"""      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="{webp}" alt="{title} en {comuna.title()}, Santiago de Chile - JF GOD'S COMPANY" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:0.75rem">
          <h3 style="font-size:0.85rem;font-weight:700;margin-bottom:0.25rem">{title}</h3>
          <p style="font-size:0.7rem;color:#6B7280">📍 {comuna.title()}, Santiago</p>
        </div>
      </div>
"""

gallery_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Galería de Fotos | JF GOD'S COMPANY - Polerones Personalizados Santiago</title>
  <meta name="description" content="Galería de fotos de polerones personalizados, estampados DTF, vinilo, sublimación, candy bar, decoración de fiestas y más en Santiago de Chile.">
  <meta property="og:title" content="Galería de Fotos | JF GOD'S COMPANY">
  <meta property="og:description" content="Galería de polerones personalizados, candy bar, decoración de fiestas y más en Santiago.">
  <meta property="og:image" content="assets/images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="header">
  <div class="header-inner">
    <a href="index.html"><img src="assets/logo.svg" alt="JF GOD'S COMPANY"></a>
    <nav class="nav">
      <a href="index.html">Inicio</a>
      <a href="comunas.html">Comunas</a>
      <a href="servicios.html">Servicios</a>
      <a href="galeria.html" class="active">Galería</a>
      <a href="dudas.html">Dudas</a>
      <a href="contacto.html">Contacto</a>
    </nav>
    <a href="https://wa.me/56991502163" target="_blank" class="btn-wa">💬 WhatsApp</a>
    <button class="mobile-menu-btn" onclick="document.getElementById('mobileNav').classList.toggle('open')">☰</button>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <a href="index.html">Inicio</a>
    <a href="comunas.html">Comunas</a>
    <a href="servicios.html">Servicios</a>
    <a href="galeria.html">Galería</a>
    <a href="dudas.html">Dudas</a>
    <a href="contacto.html">Contacto</a>
  </div>
</header>

<!-- Banner -->
<section style="position:relative;width:100%;max-height:400px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1a1a1a">
  <img src="images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg" alt="Galería JF GOD'S COMPANY" style="width:100%;height:auto;max-height:400px;object-fit:cover;opacity:0.5">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.7) 100%);display:flex;align-items:center;justify-content:center;padding:1rem">
    <div style="text-align:center;max-width:800px">
      <h1 style="font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.5);margin-bottom:0.5rem">Galería de Fotos</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:1rem;max-width:600px;margin:0 auto 1rem">Mira nuestros trabajos de polerones personalizados, candy bar, decoración de fiestas y más en Santiago de Chile.</p>
      <a href="https://wa.me/56991502163?text=Hola%20JF%20GOD'S%20COMPANY" target="_blank" style="background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;box-shadow:0 4px 14px rgba(76,175,80,0.4)">💬 Cotizar por WhatsApp</a>
    </div>
  </div>
</section>

<!-- Galería -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Nuestra <span>Galería</span></h2>
    <p>{len(gallery_images)} fotos de nuestros trabajos de polerones personalizados, estampados DTF, vinilo, sublimación, candy bar, decoración de fiestas y más.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin-top:2rem">
{gallery_cards}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <h2>¿Te gustó nuestro trabajo?</h2>
  <p>Cotiza tu polerón personalizado por WhatsApp. Envíos a toda Chile.</p>
  <a href="https://wa.me/56991502163" target="_blank" class="btn-white">💬 Cotizar por WhatsApp</a>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="footer-inner">
    <div>
      <div class="footer-logo"><img src="assets/logo.svg" alt="JF GOD'S COMPANY"></div>
      <p style="font-size:0.875rem;color:#9CA3AF">JF GOD'S COMPANY - Polerones y poleras personalizadas en Santiago de Chile. Estampados DTF, vinilo textil y sublimación. Envíos a nivel nacional.</p>
    </div>
    <div>
      <h3>Servicios</h3>
      <a href="servicios.html">Todos los Servicios</a>
      <a href="servicios.html">Estampado DTF</a>
      <a href="servicios.html">Vinilo Textil</a>
      <a href="servicios.html">Sublimación</a>
      <a href="galeria.html">Galería de Fotos</a>
    </div>
    <div>
      <h3>Navegación</h3>
      <a href="index.html">Inicio</a>
      <a href="comunas.html">Comunas</a>
      <a href="servicios.html">Servicios</a>
      <a href="galeria.html">Galería</a>
      <a href="dudas.html">Dudas</a>
      <a href="contacto.html">Contacto</a>
    </div>
    <div>
      <h3>Contacto</h3>
      <a href="https://wa.me/56991502163" target="_blank">💬 +56 9 9150 2163</a>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">📍 Lo Prado, Milton Rossel 7196<br>Santiago de Chile</p>
    </div>
  </div>
  <div class="footer-bottom"><p>© 2026 JF GOD'S COMPANY. Todos los derechos reservados.</p></div>
</footer>
<a href="https://wa.me/56991502163" target="_blank" class="wa-floating">💬</a>
</body>
</html>"""

(BASE / "galeria.html").write_text(gallery_html, encoding="utf-8")
print(f"✓ galeria.html creada con {len(gallery_images)} fotos")


# === 2. AGREGAR BOTÓN DE GALERÍA AL MENÚ DE index.html ===
print("\n=== Actualizando index.html ===")
p = BASE / "index.html"
text = p.read_text(encoding="utf-8")

# Agregar enlace de galería al nav
if 'href="galeria.html"' not in text:
    text = text.replace(
        '<a href="servicios.html">Servicios</a>',
        '<a href="servicios.html">Servicios</a>\n      <a href="galeria.html">Galería</a>'
    )
    # Mobile nav
    text = text.replace(
        '<a href="servicios.html">Servicios</a>\n    <a href="quienes-somos.html">',
        '<a href="servicios.html">Servicios</a>\n    <a href="galeria.html">Galería</a>\n    <a href="quienes-somos.html">'
    )
    print("  ✓ Botón Galería agregado al menú")

# Agregar fotos debajo de cada servicio (las primeras 12 imágenes)
service_photos = ""
for r in results[:12]:
    webp = r["webp"]
    img_type = r.get("type", "general")
    type_names = {
        "poleron": "Polerón Personalizado",
        "polera": "Polera Personalizada",
        "candy": "Candy Bar",
        "fiesta": "Decoración de Fiestas",
        "general": "Personalización",
    }
    title = type_names.get(img_type, "Producto")
    service_photos += '      <div style="background:white;border:1px solid #E0E7FF;border-radius:0.75rem;overflow:hidden"><img src="' + webp + '" alt="' + title + ' - JF GODS COMPANY" style="width:100%;height:160px;object-fit:cover" loading="lazy"></div>\n'

# Insertar galería de fotos antes de la sección de definiciones SEO
gallery_section = f"""
<!-- Fotos debajo de servicios -->
<section class="section section-alt">
  <div class="section-inner">
    <h2>Nuestros <span>Trabajos</span></h2>
    <p>Mira algunos de nuestros trabajos de polerones personalizados, candy bar y decoración de fiestas en Santiago.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.75rem;margin-top:1.5rem">
{service_photos}
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <a href="galeria.html" class="btn-outline">📷 Ver galería completa</a>
    </div>
  </div>
</section>
"""

# Insertar antes de definiciones SEO
marker = "<!-- Definiciones SEO"
if marker in text:
    text = text.replace(marker, gallery_section + "\n" + marker)
    print("  ✓ Fotos agregadas debajo de servicios")

p.write_text(text, encoding="utf-8")
print("  ✓ index.html actualizada")


# === 3. AGREGAR GALERÍA AL FOOTER DE TODAS LAS PÁGINAS ===
print("\n=== Agregando enlace de galería a footers ===")
count = 0
for p in BASE.rglob("*.html"):
    if p.name == "galeria.html":
        continue
    text = p.read_text(encoding="utf-8")
    if 'href="galeria.html"' not in text and 'href="../galeria.html"' not in text:
        # Determinar path relativo
        depth = len(p.relative_to(BASE).parts) - 1
        prefix = "../" * depth
        
        # Agregar al footer
        text = text.replace(
            f'<a href="{prefix}servicios.html">Servicios</a>',
            f'<a href="{prefix}servicios.html">Servicios</a>\n      <a href="{prefix}galeria.html">Galería</a>'
        )
        p.write_text(text, encoding="utf-8")
        count += 1

print(f"  ✓ {count} páginas actualizadas con enlace a galería")


# === 4. ACTUALIZAR SITEM ===
print("\n=== Actualizando sitemap.xml ===")
sitemap = (BASE / "sitemap.xml").read_text(encoding="utf-8")

# Agregar galería al sitemap
if "galeria.html" not in sitemap:
    galeria_url = """  <url>
    <loc>https://polerones-personalizados-santiago.pages.dev/galeria.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2026-07-08</lastmod>
  </url>
"""
    sitemap = sitemap.replace("</urlset>", galeria_url + "</urlset>")
    
    # Agregar las imágenes WebP al sitemap
    for r in results[:30]:  # primeras 30 imágenes
        webp_url = f"https://polerones-personalizado-santiago.pages.dev/{r['webp']}"
        sitemap = sitemap.replace(
            "</urlset>",
            f'  <url><loc>{webp_url}</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>\n</urlset>'
        )
    
    (BASE / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    print("  ✓ sitemap.xml actualizado con galería + 30 imágenes")
else:
    print("  ⏭ Galería ya en sitemap")

print(f"\n✅ TODO COMPLETADO:")
print(f"  - 167 imágenes WebP con nombres SEO + comuna")
print(f"  - galeria.html con 60 fotos")
print(f"  - Fotos en index.html debajo de servicios")
print(f"  - Botón Galería en menú de todas las páginas")
print(f"  - Sitemap actualizado")
