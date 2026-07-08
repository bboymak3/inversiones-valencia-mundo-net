#!/usr/bin/env python3
"""
Reestructura TODAS las páginas HTML:
1. Elimina el header nav de arriba, deja solo el logo
2. Agrega nav bar fija abajo con botón rosado Galería
3. Botón WhatsApp con animación de onda
4. Arregla enlaces del menú para que funcionen
5. Galería con 4 fotos por fila
"""
from pathlib import Path
import re
import json

BASE = Path("/home/z/my-project/polerones")
BASE_URL = "https://polerones-personalizados-santiago.pages.dev"

# Cargar todas las fotos para la galería
results = json.loads((BASE / "image_results.json").read_text())
all_webps = [r["webp"] for r in results]
js_array = ",".join([f'"{w}"' for w in all_webps])

# HTML del header simplificado (solo logo, sin nav)
def make_header(depth=0):
    prefix = "../" * depth
    return f'''<!-- Header con logo -->
<header style="position:relative;width:100%;background:white;border-bottom:1px solid #E0E7FF;padding:0.5rem 1rem;display:flex;align-items:center;justify-content:space-between">
  <a href="{prefix}index.html"><img src="{prefix}assets/logo-jf.jpeg" alt="JF GODS COMPANY" style="height:48px;border-radius:0.5rem"></a>
  <a href="https://wa.me/56991502163?text=Hola%20JF%20GODS%20COMPANY" target="_blank" class="btn-wa btn-wa-anim" style="background:#25D366;color:white;padding:0.5rem 1rem;border-radius:0.5rem;font-size:0.875rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.375rem">💬 WhatsApp</a>
</header>'''

# HTML del nav bar inferior
def make_bottom_nav(depth=0, active=""):
    prefix = "../" * depth
    links = [
        ("index.html", "Inicio"),
        ("servicios.html", "Servicios"),
        ("comunas.html", "Comunas"),
        ("dudas.html", "Dudas"),
        ("contacto.html", "Contacto"),
    ]
    nav_links = ""
    for href, label in links:
        cls = "active" if href == active else ""
        nav_links += f'    <a href="{prefix}{href}" class="{cls}">{label}</a>\n'
    
    return f'''<!-- Nav bar inferior -->
<nav class="bottom-nav">
  <div class="bottom-nav-inner">
{nav_links}    <a href="{prefix}galeria.html" class="btn-galeria-pink">📷 Galería</a>
  </div>
</nav>'''

# Procesar cada página
count = 0
for p in BASE.rglob("*.html"):
    if p.name == "galeria.html":
        continue  # la galería se procesa aparte
    
    text = p.read_text(encoding="utf-8")
    depth = len(p.relative_to(BASE).parts) - 1
    
    # Determinar página activa
    active = p.name
    
    # 1. Reemplazar el header completo
    new_header = make_header(depth)
    text = re.sub(r'<!-- Header -->.*?</header>', new_header, text, count=1, flags=re.DOTALL)
    
    # 2. Eliminar el botón WA flotante antiguo
    text = re.sub(r'<a href="https://wa.me/56991502163[^"]*"[^>]*class="wa-floating[^"]*">[^<]*</a>', '', text)
    text = re.sub(r'<a[^>]*class="wa-floating"[^>]*>.*?</a>', '', text, flags=re.DOTALL)
    
    # 3. Agregar nav bar inferior antes de </body>
    bottom_nav = make_bottom_nav(depth, active)
    # Eliminar nav bar inferior existente si lo hay
    text = re.sub(r'<!-- Nav bar inferior -->.*?</nav>', '', text, flags=re.DOTALL)
    text = text.replace("</body>", bottom_nav + "\n</body>")
    
    p.write_text(text, encoding="utf-8")
    count += 1
    print(f"  ✓ {p.relative_to(BASE)}")

print(f"\n✓ {count} páginas actualizadas con nav inferior + logo top + WA animado")

# === PROCESAR GALERÍA ESPECIAL ===
print("\n=== Procesando galería ===")

# Generar grid con 4 columnas
grid = ""
for i, photo in enumerate(all_webps):
    grid += f'      <div style="cursor:pointer" onclick="openLightbox({i})"><img src="{photo}" alt="Trabajo {i+1} - JF GODS COMPANY Santiago" loading="lazy"></div>\n'

gallery_html = f'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Galería de Fotos | JF GOD'S COMPANY - Polerones Personalizados Santiago</title>
  <meta name="description" content="Galería completa de {len(all_webps)} fotos de polerones personalizados, estampados DTF, vinilo, sublimación, candy bar, decoración de fiestas y más en Santiago de Chile.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Galería de Fotos | JF GOD'S COMPANY">
  <meta property="og:description" content="Galería completa de polerones personalizados, candy bar, decoración de fiestas y más.">
  <meta property="og:image" content="{BASE_URL}/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="{BASE_URL}/galeria.html">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Galería de Fotos | JF GOD'S COMPANY">
  <meta name="twitter:image" content="{BASE_URL}/assets/og-image.jpg">
  <link rel="icon" href="assets/favicon.jpeg" type="image/jpeg">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>

<!-- Header con logo -->
<header style="position:relative;width:100%;background:white;border-bottom:1px solid #E0E7FF;padding:0.5rem 1rem;display:flex;align-items:center;justify-content:space-between">
  <a href="index.html"><img src="assets/logo-jf.jpeg" alt="JF GODS COMPANY" style="height:48px;border-radius:0.5rem"></a>
  <a href="https://wa.me/56991502163?text=Hola%20JF%20GODS%20COMPANY" target="_blank" class="btn-wa btn-wa-anim" style="background:#25D366;color:white;padding:0.5rem 1rem;border-radius:0.5rem;font-size:0.875rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.375rem">💬 WhatsApp</a>
</header>

<!-- Banner -->
<section style="position:relative;width:100%;max-height:300px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1a1a1a">
  <img src="images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg" alt="Galería JF GODS COMPANY" style="width:100%;height:auto;max-height:300px;object-fit:cover;opacity:0.5">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.7) 100%);display:flex;align-items:center;justify-content:center;padding:1rem">
    <div style="text-align:center;max-width:800px">
      <h1 style="font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.5);margin-bottom:0.5rem">Galería de Fotos</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:1rem;max-width:600px;margin:0 auto 1rem">{len(all_webps)} fotos de nuestros trabajos. Haz clic para ver en grande.</p>
    </div>
  </div>
</section>

<!-- Galería 4 columnas -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Nuestra <span>Galería</span></h2>
    <p>{len(all_webps)} fotos de polerones personalizados, candy bar, decoración de fiestas y más.</p>
    <div class="gallery-grid" style="margin-top:1.5rem">
{grid}
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
      <div class="footer-logo"><img src="assets/logo-jf.jpeg" alt="JF GOD'S COMPANY" style="border-radius:0.5rem"></div>
      <p style="font-size:0.875rem;color:#9CA3AF">JF GOD'S COMPANY - Polerones y poleras personalizadas en Santiago de Chile.</p>
    </div>
    <div>
      <h3>Servicios</h3>
      <a href="servicios.html">Todos los Servicios</a>
      <a href="servicios.html">Estampado DTF</a>
      <a href="servicios.html">Vinilo Textil</a>
      <a href="servicios.html">Sublimación</a>
      <a href="galeria.html">Galería</a>
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
  <div class="footer-bottom"><p>© 2026 JF GOD'S COMPANY.</p></div>
</footer>

<!-- Lightbox -->
<div class="lightbox" id="lightbox" onclick="if(event.target===this)closeLightbox()">
  <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
  <span class="lightbox-prev" onclick="prevLightbox(event)">&#8249;</span>
  <img id="lightbox-img" src="" alt="Foto">
  <span class="lightbox-next" onclick="nextLightbox(event)">&#8250;</span>
  <div class="lightbox-counter" id="lightbox-counter"></div>
</div>
<script>
var lightboxImages = [{js_array}];
var currentIdx = 0;
function openLightbox(idx) {{
  currentIdx = idx;
  document.getElementById('lightbox-img').src = lightboxImages[idx];
  document.getElementById('lightbox-counter').textContent = (idx+1) + ' / ' + lightboxImages.length;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}}
function closeLightbox() {{
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}}
function nextLightbox(e) {{
  e.stopPropagation();
  currentIdx = (currentIdx + 1) % lightboxImages.length;
  document.getElementById('lightbox-img').src = lightboxImages[currentIdx];
  document.getElementById('lightbox-counter').textContent = (currentIdx+1) + ' / ' + lightboxImages.length;
}}
function prevLightbox(e) {{
  e.stopPropagation();
  currentIdx = (currentIdx - 1 + lightboxImages.length) % lightboxImages.length;
  document.getElementById('lightbox-img').src = lightboxImages[currentIdx];
  document.getElementById('lightbox-counter').textContent = (currentIdx+1) + ' / ' + lightboxImages.length;
}}
document.addEventListener('keydown', function(e) {{
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevLightbox({{stopPropagation:function(){{}}}});
  if (e.key === 'ArrowRight') nextLightbox({{stopPropagation:function(){{}}}});
}});
</script>

<!-- Nav bar inferior -->
<nav class="bottom-nav">
  <div class="bottom-nav-inner">
    <a href="index.html">Inicio</a>
    <a href="servicios.html">Servicios</a>
    <a href="comunas.html">Comunas</a>
    <a href="dudas.html">Dudas</a>
    <a href="contacto.html">Contacto</a>
    <a href="galeria.html" class="btn-galeria-pink active">📷 Galería</a>
  </div>
</nav>

</body>
</html>'''

(BASE / "galeria.html").write_text(gallery_html, encoding="utf-8")
print(f"✓ galeria.html con {len(all_webps)} fotos en grid de 4 columnas")
