#!/usr/bin/env python3
"""
Actualiza el index.html de polerones agregando:
- Galería de imágenes del repositorio
- Enlaces a las 12 páginas de categorías
- Sección de productos destacados con fotos
Mantiene todo el contenido existente (servicios, FAQ, definiciones, etc.)
"""
from pathlib import Path
import re

INDEX = Path("/home/z/my-project/polerones/index.html")
text = INDEX.read_text(encoding="utf-8")

# Buscar el cierre de la sección de servicios (antes de "Definiciones SEO")
# para insertar la galería de productos después de los servicios

GALLERY_SECTION = """
<!-- Galería de productos con imágenes del repositorio -->
<section class="section section-white" id="productos">
  <div class="section-inner">
    <h2>Productos <span>Destacados</span></h2>
    <p>Mira algunos de nuestros polerones y poleras personalizadas. Diseños únicos, alta calidad y máxima durabilidad.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.5rem;margin-top:2rem">
      
      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/poleron-hombre-personalizado-estampado-santiago-urbano.jpg" alt="Polerón Hombre Personalizado Estampado Santiago Urbano" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Polerón Hombre Urbano</h3><p style="font-size:0.75rem;color:#6B7280">Personalizado con estampado DTF</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/poleron-mujer-personalizado-crop-top-santiago-fashion.jpg" alt="Polerón Mujer Personalizado Crop Top Santiago Fashion" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Polerón Mujer Fashion</h3><p style="font-size:0.75rem;color:#6B7280">Crop top personalizado</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/poleron-oversize-mujer-algodon-estampado-chile-style.jpg" alt="Polerón Oversize Mujer Algodón Estampado Chile Style" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Polerón Oversize Style</h3><p style="font-size:0.75rem;color:#6B7280">Algodón premium oversize</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/poleron-canguro-algodon-hombre-deportivo-chile-premium.jpg" alt="Polerón Canguro Algodón Hombre Deportivo Chile Premium" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Polerón Canguro Premium</h3><p style="font-size:0.75rem;color:#6B7280">Deportivo, algodón premium</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/sudadera-caballero-negra-con-gorro-san-joaquin-exclusive.jpg" alt="Sudadera Caballero Negra con Gorro San Joaquin Exclusive" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Sudadera Caballero</h3><p style="font-size:0.75rem;color:#6B7280">Negra con gorro, exclusive</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/sudadera-dama-rosada-con-cierre-san-joaquin-trendy.jpg" alt="Sudadera Dama Rosada con Cierre San Joaquin Trendy" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Sudadera Dama Trendy</h3><p style="font-size:0.75rem;color:#6B7280">Rosada con cierre</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/polerones-parejas-personalizados-aniversario-santiago-love.jpg" alt="Polerones Parejas Personalizados Aniversario Santiago Love" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Polerones de Parejas</h3><p style="font-size:0.75rem;color:#6B7280">Aniversario, love match</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/sudaderas-novios-king-queen-san-joaquin-together.jpg" alt="Sudaderas Novios King Queen San Joaquin Together" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Sudaderas King & Queen</h3><p style="font-size:0.75rem;color:#6B7280">Novios together</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/poleron-anime-naruto-personalizado-otaku-santiago-geek.jpg" alt="Polerón Anime Naruto Personalizado Otaku Santiago Geek" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Polerón Anime Geek</h3><p style="font-size:0.75rem;color:#6B7280">Naruto, otaku personalizado</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/poleron-4to-medio-generacion-2026-escolar-chile-class.jpg" alt="Polerón 4to Medio Generación 2026 Escolar Chile Class" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Polerón 4to Medio 2026</h3><p style="font-size:0.75rem;color:#6B7280">Generación escolar class</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/poleron-corporativo-empresa-bordado-san-joaquin-work.jpg" alt="Polerón Corporativo Empresa Bordado San Joaquin Work" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Polerón Corporativo</h3><p style="font-size:0.75rem;color:#6B7280">Empresa, bordado, work</p></div>
      </div>

      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="images/conjunto-polerones-duo-amor-14-febrero-chile-match.jpg" alt="Conjunto Polerones Duo Amor 14 Febrero Chile Match" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">Conjunto Dúo Amor</h3><p style="font-size:0.75rem;color:#6B7280">14 febrero, match</p></div>
      </div>

    </div>
  </div>
</section>

<!-- Categorías del repositorio -->
<section class="section section-alt" id="categorias">
  <div class="section-inner">
    <h2>Nuestras <span>Categorías</span></h2>
    <p>Explora nuestras categorías de polerones y poleras personalizadas. Diseños únicos para cada ocasión.</p>
    <div class="services-grid">
      <a href="polerones-personalizados/hombre.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">👨</div>
        <h3>Polerones para Hombre</h3>
        <p>Polerones y sudaderas personalizadas para caballero. Diseños urbanos, deportivos y casuales.</p>
      </a>
      <a href="polerones-personalizados/mujer.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">👩</div>
        <h3>Polerones para Mujer</h3>
        <p>Polerones, crop tops y sudaderas personalizadas para dama. Diseños fashion y oversize.</p>
      </a>
      <a href="polerones-personalizados/parejas.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">💑</div>
        <h3>Polerones de Parejas</h3>
        <p>Conjuntos de polerones para parejas. King & Queen, dúo amor, aniversarios y más.</p>
      </a>
      <a href="polerones-personalizados/anime.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">🎮</div>
        <h3>Polerones Anime</h3>
        <p>Polerones con diseños de anime: Naruto, Dragon Ball, One Piece y más. Otaku geek.</p>
      </a>
      <a href="polerones-personalizados/escolares.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">🎓</div>
        <h3>Polerones Escolares</h3>
        <p>Polerones de graduación, 4to medio, generaciones y grupos escolares. Calidad class.</p>
      </a>
      <a href="polerones-personalizados/corporativos.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">🏢</div>
        <h3>Polerones Corporativos</h3>
        <p>Polerones para empresas con logo, bordado y estampado. Uniformes y regalos work.</p>
      </a>
      <a href="polerones-personalizados/deportes.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">⚽</div>
        <h3>Polerones Deportivos</h3>
        <p>Polerones para equipos deportivos, clubes y grupos. Diseños a todo color.</p>
      </a>
      <a href="polerones-personalizados/san-valentin.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">💝</div>
        <h3>San Valentín</h3>
        <p>Polerones personalizados para San Valentín. Dúo amor, match, love y anniversary.</p>
      </a>
      <a href="polerones-personalizados/cumpleanos.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">🎂</div>
        <h3>Cumpleaños</h3>
        <p>Polerones personalizados para cumpleaños. Diseños únicos para el cumpleañero.</p>
      </a>
      <a href="polerones-personalizados/familia.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">👨‍👩‍👧‍👦</div>
        <h3>Familia</h3>
        <p>Polerones personalizados para toda la familia. Conjuntos familiares únicos.</p>
      </a>
      <a href="polerones-personalizados/marcas.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">🏷️</div>
        <h3>Marcas</h3>
        <p>Polerones con diseños de tus marcas favoritas. Nike, Adidas, Champion y más.</p>
      </a>
      <a href="polerones-personalizados/especiales.html" class="service-card" style="text-decoration:none;color:inherit;display:block">
        <div class="service-icon">✨</div>
        <h3>Diseños Especiales</h3>
        <p>Polerones con diseños especiales y personalizados totalmente a tu medida.</p>
      </a>
    </div>
  </div>
</section>

<!-- Banner promocional -->
<section style="background:linear-gradient(135deg,#4CAF50,#2E7D32);padding:2rem 1rem;text-align:center;color:white">
  <div style="max-width:800px;margin:0 auto">
    <h2 style="color:white;font-size:1.5rem;margin-bottom:0.5rem">¡Diseños Exclusivos en Santiago! 🎨</h2>
    <p style="color:rgba(255,255,255,0.85);margin-bottom:1rem">Tu polerón personalizado con la mejor calidad de estampado DTF, vinilo y sublimación.</p>
    <a href="https://wa.me/56991502163?text=Hola,%20quisiera%20cotizar%20un%20polerón%20personalizado" target="_blank" style="background:white;color:#2E7D32;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem">💬 Cotizar por WhatsApp</a>
  </div>
</section>
"""

# Insertar la galería antes de las "Definiciones SEO"
# Buscar el comentario de definiciones SEO
marker = "<!-- Definiciones SEO H2 -->"
if marker in text:
    text = text.replace(marker, GALLERY_SECTION + "\n" + marker)
    INDEX.write_text(text, encoding="utf-8")
    print("✓ Galería de productos + categorías agregadas al index.html")
else:
    print("✗ No se encontró el marcador de definiciones SEO")
    # Buscar otra posición
    marker2 = '<!-- Definiciones SEO'
    if marker2 in text:
        text = text.replace(marker2, GALLERY_SECTION + "\n" + marker2)
        INDEX.write_text(text, encoding="utf-8")
        print("✓ Galería agregada (marker alternativo)")
    else:
        print("✗ No se pudo insertar")

# Actualizar las páginas de categorías para que usen rutas relativas correctas
# (las páginas del repo usan URLs absolutas a estampados.pages.dev)
import os
cat_dir = Path("/home/z/my-project/polerones/polerones-personalizados")
for f in cat_dir.glob("*.html"):
    content = f.read_text(encoding="utf-8")
    # Reemplazar URLs absolutas de imágenes por relativas
    content = content.replace("https://estampados.pages.dev/images/", "../images/")
    content = content.replace("https://estampados.pages.dev/", "../")
    # Reemplazar enlaces internos
    content = content.replace('href="index.html"', 'href="../index.html"')
    content = content.replace('href="contacto.html"', 'href="../contacto.html"')
    f.write_text(content, encoding="utf-8")

print(f"✓ {len(list(cat_dir.glob('*.html')))} páginas de categorías actualizadas con rutas correctas")
