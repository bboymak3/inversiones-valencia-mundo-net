#!/usr/bin/env python3
"""
Arregla TODOS los problemas:
1. Nav bar inferior: solo Galería (rosado) + WhatsApp (verde con onda)
2. Logo: usar assets/logo.jpeg (el correcto del repo)
3. Galería: grid responsive + lightbox funcional
4. Servicios: fotos de 80x80 al lado de cada icono
"""
from pathlib import Path
import re
import json

BASE = Path("/home/z/my-project/polerones")
BASE_URL = "https://polerones-personalizados-santiago.pages.dev"

# Cargar fotos
results = json.loads((BASE / "image_results.json").read_text())
all_webps = [r["webp"] for r in results]
service_photos = all_webps[:20]
js_array = ",".join([f'"{w}"' for w in all_webps])

# Servicios
SERVICIOS = [
    ("👕", "Estampado DTF Textil", "Estampado DTF (Direct to Film) textil de máxima calidad para poleras, polerones, chaquetas, gorras y más. Técnica de vanguardia que permite diseños a todo color con alta durabilidad, lavables y resistentes. Ideal para diseños complejos, fotografías, gradientes y logos corporativos."),
    ("🎨", "Vinilo Textil", "Estampado en vinilo textil para polerones y poleras personalizados. El vinilo textil ofrece alta durabilidad, colores vibrantes y excelente adherencia. Perfecto para uniformes deportivos, regalos personalizados, polerones de empresas y eventos."),
    ("🔥", "Sublimación Textil", "Servicio de sublimación para poleras, polerones y prendas en poliéster. La sublimación permite diseños a todo color que se integran permanentemente en la tela. Ideal para uniformes deportivos, poleras promocionales y diseños fotográficos."),
    ("🚚", "Envíos a Nivel Nacional", "Realizamos envíos a nivel nacional a todas las regiones de Chile, desde Arica hasta Magallanes. Despachamos el mismo día vía Starken, Chilexpress, BlueExpress o el courier de tu preferencia. Incluye seguimiento."),
    ("🏠", "Domicilios en Sitio", "Servicio de domicilios para clientes en Santiago. Nos desplazamos a tu ubicación para tomar medidas, mostrar muestras y coordinar el diseño. Cobertura en toda la Región Metropolitana."),
    ("🧢", "Estampados en Gorras y Yoker", "Estampados personalizados en gorras, yoker y accesorios con DTF, vinilo y sublimación. Trabajamos con diferentes modelos: planas, curvas, trucker, snapback, new era y más."),
    ("👜", "Estampados en Bolsos y Accesorios", "Personalización de bolsos, mochilas, tote bags y accesorios con estampados DTF, vinilo y sublimación. Perfectos para regalos corporativos, eventos, ferias y merchandising."),
    ("👕", "Poleras y Polerones Personalizados", "Poleras y polerones personalizados para damas y caballeros. DTF, vinilo y sublimación. Algodón premium, dry-fit, poliéster. Tallas XS hasta XXL. Tu diseño, tu regla."),
    ("🎉", "Decoración de Fiestas", "Servicio completo de decoración de fiestas y eventos en Santiago. Cumpleaños, bautizos, matrimonios, graduaciones y eventos corporativos. Incluye globos, centros de mesa, fondos fotográficos y mesas de dulces."),
    ("👶", "Baby Shower", "Organización y decoración de baby shower personalizado. Decoraciones temáticas, centros de mesa, banners personalizados, mesa de dulces y souvenirs. Diferentes temáticas disponibles."),
    ("🥐", "Desayunos Sorpresas", "Desayunos sorpresas personalizados. Incluye polera o polerón con mensaje, desayuno completo, decoración y entrega a domicilio. Perfecto para cumpleaños, aniversarios, San Valentín."),
    ("🍭", "Arriendo de Candy Bar", "Arriendo de candy bar completo para fiestas y eventos. Mesa de dulces profesional con golosinas, chocolates, cupcakes y más. Incluye decoración temática, contenedores y servicio de montaje."),
    ("👕", "Polerones para Empresas", "Polerones personalizados para empresas y eventos corporativos. Estampamos tu logo con DTF, vinilo y sublimación. Ideales para uniformes, regalos corporativos y promociones. Precios especiales por volumen."),
    ("⚽", "Poleras Deportivas Personalizadas", "Poleras deportivas personalizadas para equipos, clubes y grupos. Sublimación y DTF con diseños únicos. Telas técnicas transpirables: dry-fit, poliéster. Para fútbol, básquet, vóley y más."),
    ("🎁", "Regalos Personalizados", "Regalos personalizados únicos para toda ocasión. Poleras, polerones y prendas con diseños personalizados. Perfecto para cumpleaños, aniversarios, día de la madre, día del padre, San Valentín y Navidad."),
    ("🏆", "Polerones para Eventos y Grupos", "Polerones personalizados para eventos, grupos, peñas y reuniones. Diseños a todo color con DTF y sublimación. Ideales para peñas, festivales, viajes grupales y despedidas. Precios especiales por cantidad."),
    ("🖨️", "Estampados de Camisetas", "Estampados de camisetas personalizadas con DTF, vinilo y sublimación. Diseños a todo color, resistentes al lavado. Ideales para eventos, regalos, empresas y uso personal."),
    ("🎈", "Arreglo de Fiestas Infantiles", "Arreglo de fiestas infantiles completo. Decoración temática con personajes, globos, centros de mesa, mesa de dulces, banner personalizado y souvenirs. Todas las temáticas disponibles."),
    ("💝", "Regalos Empresariales", "Regalos empresariales personalizados. Souvenirs corporativos: polerones con logo, gorras, bolsos, tote bags. Ideales para cajas navideñas, ferias, promociones y regalos a clientes."),
    ("📦", "Regalos a Domicilio", "Servicio de regalos a domicilio en Santiago y envíos a nivel nacional. Polerón personalizado, empaquetado especial y tarjeta de mensaje. Perfecto para cumpleaños, aniversarios y San Valentín."),
]

# Definiciones
DEFINICIONES = [
    ("Polerones Personalizados Santiago", "Los polerones personalizados en Santiago son prendas únicas diseñadas a tu medida con estampados DTF, vinilo textil y sublimación. Ofrecemos polerones de alta calidad para damas y caballeros. Envíos a nivel nacional."),
    ("Estampados DTF Textil", "El estampado DTF (Direct to Film) permite imprimir diseños a todo color sobre una película que se transfiere a la tela. Ofrece máxima durabilidad, colores vibrantes y es lavable."),
    ("Vinilo Textil", "El vinilo textil utiliza láminas cortadas a medida aplicadas con calor. Ideal para textos, números, logos y colores sólidos. Alta durabilidad y colores vibrantes."),
    ("Sublimación Textil", "La sublimación transfiere diseños a todo color permanentemente sobre poliéster. La tinta se integra en la fibra sin alterar la textura. Los colores no se desvanecen."),
    ("Poleras Estampadas", "Poleras personalizadas con DTF, vinilo o sublimación. Alta calidad para hombre y mujer. Diferentes colores, tallas y materiales."),
    ("Gorras Personalizadas", "Gorras estampadas con DTF, vinilo y sublimación. Ideales para regalos promocionales, uniformes y merchandising."),
    ("Envíos a Nivel Nacional", "Envíos a todas las regiones de Chile desde Arica hasta Magallanes. Despacho mismo día vía Starken, Chilexpress o BlueExpress."),
    ("Decoración de Fiestas", "Transformación completa de espacios con temáticas personalizadas. Globos, centros de mesa, fondos fotográficos y mesas de dulces."),
    ("Desayunos Sorpresas", "Desayuno con polerón personalizado, comida, decoración y entrega a domicilio. Perfecto para cumpleaños y aniversarios."),
    ("Candy Bar", "Mesa de dulces profesional con golosinas, cupcakes y decoración temática. Para cumpleaños, matrimonios y eventos."),
]

# FAQ
FAQS = [
    ("¿Hacen polerones personalizados en Santiago de Chile?", "Sí, hacemos polerones y poleras personalizadas en Santiago de Chile. Estamos ubicados en Lo Prado, Milton Rossel 7196. Cotiza por WhatsApp +56 9 9150 2163."),
    ("¿Qué técnicas de estampado utilizan?", "Utilizamos DTF textil para diseños a todo color, vinilo textil para colores sólidos y logos, y sublimación para telas de poliéster."),
    ("¿Hacen envíos a nivel nacional?", "Sí, enviamos a todas las regiones de Chile, desde Arica hasta Magallanes. Despachamos el mismo día de confirmado el pago."),
    ("¿Cuánto demora un polerón personalizado?", "Generalmente entre 2 y 5 días hábiles para pedidos individuales. Para pedidos grandes coordinamos un plazo según el volumen."),
    ("¿Puedo llevar mi propio diseño?", "¡Por supuesto! Puedes llevar tu diseño en formato digital (PNG, JPG, PDF, AI). También podemos diseñar contigo."),
    ("¿Qué prendas personalizan?", "Personalizamos poleras, polerones, chaquetas, gorras, yoker, bolsos, mochilas, tote bags, tazas y más."),
    ("¿Hacen domicilios en Santiago?", "Sí, realizamos domicilios para clientes en Santiago. Cobertura en toda la Región Metropolitana."),
    ("¿Ofrecen decoración de fiestas?", "Sí, ofrecemos decoración de fiestas, baby shower, desayunos sorpresas y arriendo de candy bar."),
    ("¿Cuáles son las formas de pago?", "Aceptamos transferencia bancaria, efectivo y Mercado Pago. Para pedidos grandes: 50% adelanto y resto al entrega."),
    ("¿Cómo cotizo mi polerón personalizado?", "Escríbenos por WhatsApp al +56 9 9150 2163 indicando: tipo de prenda, cantidad, técnica, diseño y fecha."),
]

# Categorías
CATEGORIAS = [
    ("hombre.html", "👨", "Polerones para Hombre", "Diseños urbanos, deportivos y casuales"),
    ("mujer.html", "👩", "Polerones para Mujer", "Diseños fashion y oversize"),
    ("parejas.html", "💑", "Polerones de Parejas", "King & Queen, dúo amor, aniversarios"),
    ("anime.html", "🎮", "Polerones Anime", "Naruto, Dragon Ball, One Piece y más"),
    ("escolares.html", "🎓", "Polerones Escolares", "Graduación, 4to medio, generaciones"),
    ("corporativos.html", "🏢", "Polerones Corporativos", "Logo, bordado, uniformes empresariales"),
    ("deportes.html", "⚽", "Polerones Deportivos", "Equipos, clubes y grupos deportivos"),
    ("san-valentin.html", "💝", "San Valentín", "Dúo amor, match, love y anniversary"),
    ("cumpleanos.html", "🎂", "Cumpleaños", "Diseños únicos para el cumpleañero"),
    ("familia.html", "👨‍👩‍👧‍👦", "Familia", "Conjuntos familiares únicos"),
    ("marcas.html", "🏷️", "Marcas", "Nike, Adidas, Champion y más"),
    ("especiales.html", "✨", "Diseños Especiales", "Personalizados totalmente a tu medida"),
]

# HTML del header (logo + WA animado)
HEADER_TPL = """<!-- Header con logo -->
<header style="position:sticky;top:0;z-index:50;width:100%;background:rgba(255,255,255,0.98);backdrop-filter:blur(10px);border-bottom:1px solid #E0E7FF;padding:0.5rem 1rem;display:flex;align-items:center;justify-content:space-between">
  <a href="{prefix}index.html"><img src="{prefix}assets/logo.jpeg" alt="JF GODS COMPANY" style="height:52px;border-radius:0.5rem"></a>
  <a href="https://wa.me/56991502163?text=Hola%20JF%20GODS%20COMPANY" target="_blank" class="btn-wa-anim" style="background:#25D366;color:white;padding:0.5rem 1rem;border-radius:0.5rem;font-size:0.875rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.375rem">💬 WhatsApp</a>
</header>"""

# Nav bar inferior: SOLO Galería + WhatsApp
BOTTOM_NAV_TPL = """<!-- Nav bar inferior -->
<nav class="bottom-nav">
  <div class="bottom-nav-inner">
    <a href="{prefix}galeria.html" class="btn-galeria-pink">📷 Galería</a>
    <a href="https://wa.me/56991502163?text=Hola%20JF%20GODS%20COMPANY" target="_blank" class="btn-wa-anim" style="background:#25D366;color:white;padding:0.6rem 1.5rem;border-radius:0.5rem;font-weight:700;font-size:0.9rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.375rem">💬 WhatsApp</a>
  </div>
</nav>"""

# Lightbox JS (común para todas las páginas)
LIGHTBOX_JS = """
<!-- Lightbox -->
<div class="lightbox" id="lightbox" onclick="if(event.target===this)closeLightbox()">
  <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
  <span class="lightbox-prev" onclick="prevLightbox(event)">&#8249;</span>
  <img id="lightbox-img" src="" alt="Foto">
  <span class="lightbox-next" onclick="nextLightbox(event)">&#8250;</span>
  <div class="lightbox-counter" id="lightbox-counter"></div>
</div>
<script>
var lightboxImages = [""" + js_array + """];
var currentIdx = 0;
function openLightbox(idx) {
  currentIdx = idx;
  document.getElementById('lightbox-img').src = lightboxImages[idx];
  document.getElementById('lightbox-counter').textContent = (idx+1) + ' / ' + lightboxImages.length;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function nextLightbox(e) {
  e.stopPropagation();
  currentIdx = (currentIdx + 1) % lightboxImages.length;
  document.getElementById('lightbox-img').src = lightboxImages[currentIdx];
  document.getElementById('lightbox-counter').textContent = (currentIdx+1) + ' / ' + lightboxImages.length;
}
function prevLightbox(e) {
  e.stopPropagation();
  currentIdx = (currentIdx - 1 + lightboxImages.length) % lightboxImages.length;
  document.getElementById('lightbox-img').src = lightboxImages[currentIdx];
  document.getElementById('lightbox-counter').textContent = (currentIdx+1) + ' / ' + lightboxImages.length;
}
document.addEventListener('keydown', function(e) {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevLightbox({stopPropagation:function(){}});
  if (e.key === 'ArrowRight') nextLightbox({stopPropagation:function(){}});
});
document.querySelectorAll('img').forEach(function(img) {
  if (img.src.includes('webp') && !img.hasAttribute('data-nolightbox')) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      var src = img.getAttribute('src');
      var idx = lightboxImages.indexOf(src);
      if (idx === -1) idx = 0;
      openLightbox(idx);
    });
  }
});
</script>
"""

# Footer común
def make_footer(depth=0):
    prefix = "../" * depth
    return f"""<!-- Footer -->
<footer class="footer">
  <div class="footer-inner">
    <div>
      <div class="footer-logo"><img src="{prefix}assets/logo.jpeg" alt="JF GODS COMPANY" style="height:40px;border-radius:0.5rem"></div>
      <p style="font-size:0.875rem;color:#9CA3AF">JF GODS COMPANY - Polerones y poleras personalizadas en Santiago de Chile. Estampados DTF, vinilo textil y sublimación. Envíos a nivel nacional.</p>
    </div>
    <div>
      <h3>Servicios</h3>
      <a href="{prefix}servicios.html">Todos los Servicios</a>
      <a href="{prefix}servicios.html">Estampado DTF</a>
      <a href="{prefix}servicios.html">Vinilo Textil</a>
      <a href="{prefix}servicios.html">Sublimación</a>
      <a href="{prefix}galeria.html">Galería de Fotos</a>
    </div>
    <div>
      <h3>Navegación</h3>
      <a href="{prefix}index.html">Inicio</a>
      <a href="{prefix}comunas.html">Comunas</a>
      <a href="{prefix}servicios.html">Servicios</a>
      <a href="{prefix}galeria.html">Galería</a>
      <a href="{prefix}quienes-somos.html">Quiénes Somos</a>
      <a href="{prefix}dudas.html">Dudas</a>
      <a href="{prefix}contacto.html">Contacto</a>
    </div>
    <div>
      <h3>Contacto</h3>
      <a href="https://wa.me/56991502163" target="_blank">💬 +56 9 9150 2163</a>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">📍 Lo Prado, Milton Rossel 7196<br>Santiago de Chile</p>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">🕒 Lun a Sáb: 9:00 AM - 6:00 PM</p>
    </div>
  </div>
  <div class="footer-bottom"><p>© 2026 JF GOD'S COMPANY.</p></div>
</footer>"""


# === GENERAR INDEX.HTML ===
print("=== Generando index.html ===")

# Servicios con foto 80x80
servicios_html = ""
for i, (icon, title, desc) in enumerate(SERVICIOS):
    photo = service_photos[i] if i < len(service_photos) else service_photos[0]
    servicios_html += f"""      <div class="service-card">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
          <img src="{photo}" alt="Trabajo" style="width:80px;height:80px;object-fit:cover;border-radius:0.5rem;flex-shrink:0" loading="lazy">
          <div class="service-icon" style="margin-bottom:0;width:48px;height:48px;font-size:1.5rem">{icon}</div>
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
"""

# Trabajos en grid (60 fotos)
trabajos_grid = ""
for i, photo in enumerate(all_webps[:60]):
    trabajos_grid += f'      <div style="background:white;border:1px solid #E0E7FF;border-radius:0.5rem;overflow:hidden"><img src="{photo}" alt="Trabajo {i+1}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block" loading="lazy"></div>\n'

# Definiciones
defs_html = ""
for title, desc in DEFINICIONES:
    defs_html += f'      <div class="def-card"><h3>{title}</h3><p>{desc}</p></div>\n'

# FAQ
faq_html = ""
for q, a in FAQS:
    faq_html += f'    <details class="faq-item"><summary>{q}</summary><p>{a}</p></details>\n'

# Categorías
cats_html = ""
for href, icon, title, desc in CATEGORIAS:
    cats_html += f'      <a href="polerones-personalizados/{href}" class="service-card" style="text-decoration:none;color:inherit;display:block"><div class="service-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></a>\n'

index_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-site-verification" content="AO8x2D5digAhJVNmj0wVdeJx60EpOc56vELa9rh_CmY" />
  <title>JF GOD'S COMPANY | Polerones y Poleras Personalizadas Santiago Chile</title>
  <meta name="description" content="JF GOD'S COMPANY - Polerones y poleras personalizadas en Santiago de Chile. Estampados DTF, vinilo textil y sublimación. Envíos a nivel nacional. Cotiza por WhatsApp +56 9 9150 2163.">
  <meta name="keywords" content="polerones personalizados, poleras personalizadas, estampados Santiago, DTF textil, vinilo textil, sublimación, envíos nacionales">
  <link rel="icon" href="assets/logo.jpeg" type="image/jpeg">
  <meta property="og:type" content="website">
  <meta property="og:title" content="JF GOD'S COMPANY - Polerones Personalizados Santiago">
  <meta property="og:description" content="Estampados DTF, vinilo textil y sublimación en Santiago de Chile. Envíos a nivel nacional.">
  <meta property="og:image" content="{BASE_URL}/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="{BASE_URL}/">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="JF GOD'S COMPANY - Polerones Personalizados Santiago">
  <meta name="twitter:image" content="{BASE_URL}/assets/og-image.jpg">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>

{HEADER_TPL.format(prefix="")}

<!-- Banner -->
<section style="position:relative;width:100%;max-height:500px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1a1a1a">
  <img src="images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg" alt="JF GOD'S COMPANY" style="width:100%;height:auto;max-height:500px;object-fit:cover;opacity:0.7">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.6) 100%);display:flex;align-items:center;justify-content:center;padding:1rem">
    <div style="text-align:center;max-width:800px">
      <div style="display:inline-flex;align-items:center;gap:0.375rem;background:rgba(76,175,80,0.9);color:white;padding:0.375rem 0.875rem;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">📍 Santiago de Chile · Envíos a Nivel Nacional</div>
      <h1 style="font-family:'Poppins',sans-serif;font-size:2.5rem;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.5);margin-bottom:0.5rem">JF GOD'S COMPANY</h1>
      <h2 style="font-family:'Poppins',sans-serif;font-size:1.25rem;font-weight:600;color:#A5D6A7;margin-bottom:1rem">Poleras y Polerones Personalizados en Santiago</h2>
      <p style="color:rgba(255,255,255,0.9);font-size:0.95rem;max-width:600px;margin:0 auto 1.5rem">Estampados DTF, vinilo textil y sublimación. Envíos a toda Chile. 🇨🇱</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
        <a href="https://wa.me/56991502163" target="_blank" style="background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem">💬 Cotizar</a>
        <a href="galeria.html" style="border:2px solid white;color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;background:rgba(255,255,255,0.1)">📷 Galería</a>
      </div>
    </div>
  </div>
</section>

<!-- Servicios -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Nuestros <span>Servicios</span></h2>
    <p>Especialistas en estampados de polerones y poleras personalizados, envíos a nivel nacional y más.</p>
    <div class="services-grid">
{servicios_html}
    </div>
  </div>
</section>

<!-- Nuestros Trabajos -->
<section class="section section-alt">
  <div class="section-inner">
    <h2>Nuestros <span>Trabajos</span></h2>
    <p>Candy bar, decoración de fiestas, baby shower, desayunos sorpresas, polerones y más en Santiago.</p>
    <div class="gallery-grid" style="margin-top:1.5rem">
{trabajos_grid}
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <a href="galeria.html" class="btn-primary">📷 Ver más</a>
    </div>
  </div>
</section>

<!-- Categorías -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Nuestras <span>Categorías</span></h2>
    <p>Explora nuestras categorías de polerones y poleras personalizadas.</p>
    <div class="services-grid">
{cats_html}
    </div>
  </div>
</section>

<!-- Comunas -->
<section class="section section-alt">
  <div class="section-inner">
    <h2>Comunas que <span>Cubrimos</span></h2>
    <p>Realizamos entregas en comunas de la Región Metropolitana y otras regiones de Chile.</p>
    <div class="comunas-grid">
      <a href="comunas/santiago.html" class="comuna-card"><h3>Santiago</h3><p>RM</p></a>
      <a href="comunas/conchali.html" class="comuna-card"><h3>Conchalí</h3><p>RM</p></a>
      <a href="comunas/el-bosque.html" class="comuna-card"><h3>El Bosque</h3><p>RM</p></a>
      <a href="comunas/la-granja.html" class="comuna-card"><h3>La Granja</h3><p>RM</p></a>
      <a href="comunas/huechuraba.html" class="comuna-card"><h3>Huechuraba</h3><p>RM</p></a>
      <a href="comunas/cerro-navia.html" class="comuna-card"><h3>Cerro Navia</h3><p>RM</p></a>
      <a href="comunas/san-bernardo.html" class="comuna-card"><h3>San Bernardo</h3><p>RM</p></a>
      <a href="comunas/san-joaquin.html" class="comuna-card"><h3>San Joaquín</h3><p>RM</p></a>
      <a href="comunas/independencia.html" class="comuna-card"><h3>Independencia</h3><p>RM</p></a>
      <a href="comunas/padre-hurtado.html" class="comuna-card"><h3>Padre Hurtado</h3><p>RM</p></a>
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <a href="comunas.html" class="btn-outline">📍 Ver todas</a>
    </div>
  </div>
</section>

<!-- Definiciones -->
<section class="section section-white">
  <div class="section-inner" style="max-width:800px">
    <h2>Todo sobre <span>Polerones Personalizados</span></h2>
    <p>Conoce todo sobre estampados textiles y servicios en Santiago de Chile.</p>
{defs_html}
  </div>
</section>

<!-- FAQ -->
<section class="section section-alt">
  <div class="section-inner" style="max-width:800px">
    <h2>Preguntas <span>Frecuentes</span></h2>
    <p>Resolvemos las dudas más comunes sobre polerones personalizados.</p>
{faq_html}
    <div style="text-align:center;margin-top:1.5rem">
      <a href="dudas.html" style="color:#2E7D32;font-weight:600">Ver todas las preguntas</a>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <h2>¿Listo para tu polerón personalizado?</h2>
  <p>Cotiza por WhatsApp. Envíos a nivel nacional, diseños únicos.</p>
  <a href="https://wa.me/56991502163" target="_blank" class="btn-white">💬 Cotizar por WhatsApp</a>
</section>

{make_footer(0)}

{LIGHTBOX_JS}

{BOTTOM_NAV_TPL.format(prefix="")}

</body>
</html>"""

(BASE / "index.html").write_text(index_html, encoding="utf-8")
print(f"✓ index.html ({len(index_html)} bytes)")
print(f"  - Logo: assets/logo.jpeg")
print(f"  - Servicios: fotos 80x80 al lado de iconos")
print(f"  - Trabajos: 60 fotos en gallery-grid (4 columnas)")
print(f"  - Nav inferior: solo Galería + WhatsApp")
print(f"  - Lightbox en todas las fotos WebP")


# === GENERAR GALERIA.HTML ===
print("\n=== Generando galeria.html ===")

gallery_grid = ""
for i, photo in enumerate(all_webps):
    gallery_grid += f'      <div style="cursor:pointer" onclick="openLightbox({i})"><img src="{photo}" alt="Trabajo {i+1}" loading="lazy" data-nolightbox></div>\n'

galeria_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Galería de Fotos | JF GOD'S COMPANY</title>
  <meta name="description" content="Galería completa de {len(all_webps)} fotos de polerones personalizados, candy bar, decoración de fiestas y más en Santiago.">
  <meta property="og:image" content="{BASE_URL}/assets/og-image.jpg">
  <link rel="icon" href="assets/logo.jpeg" type="image/jpeg">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>

{HEADER_TPL.format(prefix="")}

<!-- Banner -->
<section style="position:relative;width:100%;max-height:300px;overflow:hidden;background:#1a1a1a;display:flex;align-items:center;justify-content:center">
  <img src="images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg" alt="Galería" style="width:100%;height:auto;max-height:300px;object-fit:cover;opacity:0.5">
  <div style="position:absolute;text-align:center">
    <h1 style="font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.5)">Galería de Fotos</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:1rem;margin-top:0.5rem">{len(all_webps)} fotos · Haz clic para ver en grande</p>
  </div>
</section>

<!-- Galería -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Nuestra <span>Galería</span></h2>
    <p>{len(all_webps)} fotos de nuestros trabajos.</p>
    <div class="gallery-grid" style="margin-top:1.5rem">
{gallery_grid}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <h2>¿Te gustó nuestro trabajo?</h2>
  <p>Cotiza por WhatsApp. Envíos a toda Chile.</p>
  <a href="https://wa.me/56991502163" target="_blank" class="btn-white">💬 Cotizar</a>
</section>

{make_footer(0)}

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

{BOTTOM_NAV_TPL.format(prefix="")}

</body>
</html>"""

(BASE / "galeria.html").write_text(galeria_html, encoding="utf-8")
print(f"✓ galeria.html ({len(galeria_html)} bytes)")
print(f"  - {len(all_webps)} fotos en gallery-grid (4 columnas responsive)")
print(f"  - Lightbox funcional al hacer clic")


# === ACTUALIZAR TODAS LAS DEMÁS PÁGINAS ===
print("\n=== Actualizando demás páginas ===")
count = 0
for p in BASE.rglob("*.html"):
    if p.name in ("index.html", "galeria.html"):
        continue
    
    text = p.read_text(encoding="utf-8")
    depth = len(p.relative_to(BASE).parts) - 1
    prefix = "../" * depth
    
    # 1. Reemplazar header
    text = re.sub(r'<!-- Header.*?</header>', HEADER_TPL.format(prefix=prefix), text, count=1, flags=re.DOTALL)
    
    # 2. Eliminar nav bar inferior existente y agregar la nueva
    text = re.sub(r'<!-- Nav bar inferior -->.*?</nav>', '', text, flags=re.DOTALL)
    text = re.sub(r'<nav class="bottom-nav">.*?</nav>', '', text, flags=re.DOTALL)
    
    # 3. Eliminar wa-floating antiguo
    text = re.sub(r'<a[^>]*class="wa-floating[^"]*"[^>]*>.*?</a>', '', text, flags=re.DOTALL)
    
    # 4. Actualizar logo en footer
    text = re.sub(r'src="[^"]*logo[^"]*"', f'src="{prefix}assets/logo.jpeg"', text)
    
    # 5. Agregar nav bar + lightbox antes de </body>
    text = text.replace("</body>", BOTTOM_NAV_TPL.format(prefix=prefix) + "\n</body>")
    
    p.write_text(text, encoding="utf-8")
    count += 1

print(f"✓ {count} páginas actualizadas")
print(f"\n✅ TODO COMPLETADO")
