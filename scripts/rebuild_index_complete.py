#!/usr/bin/env python3
"""
Reconstruye index.html COMPLETA con TODO el contenido:
- Banner
- 20 servicios con fotos WebP debajo de cada uno
- Galería de productos (12 fotos de polerones)
- Categorías
- Definiciones SEO
- FAQ
- CTA
"""
import json
from pathlib import Path

BASE = Path("/home/z/my-project/polerones")
photo_lists = json.loads((BASE / "photo_lists.json").read_text())

# Servicios completos
SERVICIOS = [
    ("👕", "Estampado DTF Textil", "Estampado DTF (Direct to Film) textil de máxima calidad para poleras, polerones, chaquetas, gorras y más. Técnica de vanguardia que permite diseños a todo color con alta durabilidad, lavables y resistentes al lavado. Ideal para diseños complejos, fotografías, gradientes y logos corporativos. Trabajamos con todas las telas: algodón, poliéster, mezclas y materiales técnicos. Resultados profesionales garantizados con colores vibrantes que no se desvanecen."),
    ("🎨", "Vinilo Textil", "Estampado en vinilo textil para polerones y poleras personalizados. El vinilo textil ofrece alta durabilidad, colores vibrantes y excelente adherencia. Perfecto para uniformes deportivos, regalos personalizados, polerones de empresas, eventos y números de deportistas. Disponible en variedad de colores incluyendo efectos especiales como glitter, reflectante, metalizado y holográfico."),
    ("🔥", "Sublimación Textil", "Servicio de sublimación para poleras, polerones y prendas en poliéster. La sublimación permite diseños a todo color que se integran permanentemente en la tela, sin alterar la textura ni la transpirabilidad. Ideal para uniformes deportivos, poleras promocionales, regalos corporativos y diseños fotográficos. Los colores no se desvanecen con el lavado."),
    ("🚚", "Envíos a Nivel Nacional", "Realizamos envíos a nivel nacional a todas las regiones de Chile, desde Arica hasta Magallanes. Despachamos el mismo día de confirmado el pago vía Starken, Chilexpress, BlueExpress o el courier de tu preferencia. Incluye seguimiento de envío para que sepas dónde está tu pedido en todo momento. Coordinación inmediata al confirmar tu compra."),
    ("🏠", "Domicilios en Sitio", "Servicio de domicilios para clientes en Santiago. Nos desplazamos a tu ubicación para tomar medidas, mostrar muestras de telas y colores, y coordinar el diseño de tu polerón o polera personalizada. Ideal para empresas, equipos deportivos, grupos grandes y eventos. Cobertura en toda la Región Metropolitana con atención profesional."),
    ("🧢", "Estampados en Gorras y Yoker", "Estampados personalizados en gorras, yoker y accesorios. Personalizamos gorras con tu logo, nombre o diseño utilizando técnicas de DTF, vinilo y sublimación. Trabajamos con diferentes modelos: gorras planas, curvas, trucker, snapback, new era y más. Ideales para regalos promocionales, uniformes de empresa, eventos deportivos y merchandising."),
    ("👜", "Estampados en Bolsos y Accesorios", "Personalización de bolsos, mochilas, tote bags y accesorios con estampados DTF, vinilo y sublimación. Los bolsos personalizados son perfectos para regalos corporativos, eventos, ferias y merchandising. Trabajamos con diferentes materiales: tela, lona, poliéster y más. Diseños a todo color, resistentes al lavado y de alta durabilidad."),
    ("👕", "Poleras y Polerones Personalizados", "Poleras y polerones personalizados para damas y caballeros con la mejor calidad de Santiago. Utilizamos técnicas de DTF, vinilo y sublimación para crear diseños únicos. Trabajamos con diferentes tipos de telas: algodón premium, dry-fit, poliéster y mezclas. Tallas desde XS hasta XXL. Tu diseño, tu regla. Máxima durabilidad y comodidad garantizada."),
    ("🎉", "Decoración de Fiestas", "Servicio completo de decoración de fiestas y eventos en Santiago. Transformamos cualquier espacio con decoraciones temáticas personalizadas: cumpleaños, bautizos, matrimonios, graduaciones y eventos corporativos. Incluye globos, centros de mesa, fondos fotográficos, banner personalizado, mesas de dulces y más. Atención personalizada y presupuestos a tu medida."),
    ("👶", "Baby Shower", "Organización y decoración de baby shower personalizado en Santiago. Creamos ambientes mágicos para celebrar la llegada de tu bebé con decoraciones temáticas, centros de mesa, banners personalizados, mesa de dulces y souvenirs. Trabajamos con diferentes temáticas: clásico, moderno, norteño, animalitos y más. Incluye polerones personalizados para la mamá y los invitados."),
    ("🥐", "Desayunos Sorpresas", "Desayunos sorpresas personalizados en Santiago. Sorprende a esa persona especial con un desayuno único que incluye polera o polerón con mensaje personalizado, desayuno completo, decoración y entrega a domicilio. Perfecto para cumpleaños, aniversarios, día de la madre, día del padre, San Valentín y cualquier ocasión especial."),
    ("🍭", "Arriendo de Candy Bar", "Arriendo de candy bar completo para fiestas y eventos en Santiago. Mesa de dulces profesional con variedad de golosinas, chocolates, cupcakes, cake pops y más. Incluye decoración temática, contenedores, etiquetas personalizadas y servicio de montaje. El candy bar es el centro de atracción de cualquier evento. Personalizamos según tu temática y colores."),
    ("👕", "Polerones para Empresas", "Polerones personalizados para empresas, equipos de trabajo y eventos corporativos en Santiago. Estampamos tu logo empresarial con técnicas DTF, vinilo y sublimación. Ideales para uniformes, regalos corporativos, eventos de team building, ferias, cajas navideñas y promociones. Trabajamos con diferentes calidades de polerones. Precios especiales por volumen."),
    ("⚽", "Poleras Deportivas Personalizadas", "Poleras deportivas personalizadas para equipos, clubes y grupos en Santiago. Utilizamos técnicas de sublimación y DTF para crear diseños únicos con números, nombres, logos y patrones a todo color. Trabajamos con telas técnicas transpirables de alta calidad: dry-fit, poliéster y mezclas. Ideales para fútbol, básquet, vóley, running, ciclismo y cualquier disciplina."),
    ("🎁", "Regalos Personalizados", "Regalos personalizados únicos para toda ocasión en Santiago. Creamos poleras, polerones y prendas personalizadas que son el regalo perfecto para cumpleaños, aniversarios, día de la madre, día del padre, San Valentín, graduaciones, Navidad y más. Diseñamos contigo cada detalle: mensaje, foto, fecha, nombre o cualquier elemento que haga especial tu regalo."),
    ("🏆", "Polerones para Eventos y Grupos", "Polerones personalizados para eventos, grupos, peñas y reuniones en Santiago. Ya sea para un evento deportivo, musical, familiar o empresarial, creamos polerones únicos que identifican a tu grupo. Diseños a todo color con DTF y sublimación, diferentes tallas y colores. Precios especiales por cantidad."),
    ("🖨️", "Estampados de Camisetas", "Estampados de camisetas personalizadas con técnicas DTF, vinilo y sublimación. Personalizamos camisetas con tu diseño, logo, foto o texto. Ideales para eventos, regalos, empresas, grupos deportivos y uso personal. Trabajamos con camisetas de alta calidad en algodón y mezclas. Diseños a todo color, resistentes al lavado y de alta durabilidad."),
    ("🎈", "Arreglo de Fiestas Infantiles", "Arreglo de fiestas infantiles completo en Santiago. Incluye decoración temática con personajes infantiles, globos, centros de mesa, mesa de dulces, banner personalizado y souvenirs. Trabajamos con todas las temáticas: princesas, superhéroes, animalitos, payasos y más. También personalizamos polerones para el cumpleañero y los invitados."),
    ("💝", "Regalos Empresariales", "Regalos empresariales personalizados para empresas en Santiago. Creamos souvenirs corporativos únicos: polerones con logo, gorras personalizadas, bolsos de marca, tote bags y más. Ideales para cajas navideñas, eventos corporativos, ferias, promociones y regalos a clientes. Trabajamos con productos de alta calidad y acabados premium."),
    ("📦", "Regalos a Domicilio", "Servicio de regalos a domicilio en Santiago y envíos a nivel nacional. Sorprende a esa persona especial con un regalo personalizado entregado directamente en su puerta. Incluye polerón personalizado, empaquetado especial y tarjeta de mensaje. Perfecto para cumpleaños, aniversarios, San Valentín, día de la madre y cualquier ocasión especial."),
]

# Definiciones SEO
DEFINICIONES = [
    ("Polerones Personalizados Santiago", "Los polerones personalizados en Santiago son prendas únicas diseñadas a tu medida con estampados DTF, vinilo textil y sublimación. Ofrecemos polerones de alta calidad para damas y caballeros, con diseños personalizados que reflejan tu estilo, empresa o evento. Trabajamos con las mejores telas y técnicas de estampado de vanguardia. Envíos a nivel nacional."),
    ("Estampados DTF Textil", "El estampado DTF (Direct to Film) textil es una técnica de estampación de vanguardia que permite imprimir diseños a todo color sobre una película especial que luego se transfiere a la tela. Ofrece máxima durabilidad, colores vibrantes y es lavable. Ideal para poleras, polerones, gorras y accesorios con diseños complejos, fotografías y gradientes."),
    ("Vinilo Textil", "El vinilo textil es una técnica de estampado que utiliza láminas de vinilo cortadas a medida y aplicadas con calor sobre la tela. Es ideal para textos, números, logos y diseños de colores sólidos. Ofrece alta durabilidad, colores vibrantes y excelente adherencia. Perfecto para uniformes deportivos, regalos personalizados y polerones de empresas."),
    ("Sublimación Textil", "La sublimación textil es una técnica que permite transferir diseños a todo color permanentemente sobre telas de poliéster. A diferencia de otros métodos, la tinta se integra en la fibra sin alterar la textura ni la transpirabilidad. Los colores no se desvanecen con el lavado. Ideal para uniformes deportivos y diseños fotográficos."),
    ("Poleras Estampadas", "Las poleras estampadas son prendas personalizadas con diseños únicos aplicados mediante técnicas de DTF, vinilo o sublimación. Ofrecemos poleras de alta calidad para hombre y mujer, con diseños que van desde logos corporativos hasta arte personalizado. Disponibles en diferentes colores, tallas y materiales."),
    ("Gorras Personalizadas", "Las gorras personalizadas son accesorios únicos estampados con tu logo, nombre o diseño. Utilizamos técnicas de DTF, vinilo y sublimación. Ideales para regalos promocionales, uniformes de empresa, eventos deportivos y merchandising. Trabajamos con diferentes modelos: planas, curvas, trucker, snapback y más."),
    ("Envíos a Nivel Nacional", "Los envíos a nivel nacional permiten que recibas tus polerones y poleras personalizadas en cualquier región de Chile, desde Arica hasta Magallanes. Despachamos el mismo día de confirmado el pago vía Starken, Chilexpress, BlueExpress o el courier de tu preferencia. Incluye seguimiento de envío."),
    ("Decoración de Fiestas", "La decoración de fiestas y eventos incluye transformación completa de espacios con temáticas personalizadas: globos, centros de mesa, fondos fotográficos, banner personalizado y mesas de dulces. Servicios para cumpleaños, bautizos, matrimonios, graduaciones y eventos corporativos."),
    ("Desayunos Sorpresas", "Los desayunos sorpresa incluyen polera o polerón personalizado con mensaje, desayuno completo con waffles, frutas y jugos, decoración temática y entrega a domicilio. Perfecto para cumpleaños, aniversarios, día de la madre, San Valentín. También envíos a nivel nacional."),
    ("Candy Bar", "El arriendo de candy bar incluye mesa de dulces profesional con golosinas, cupcakes y decoración temática. Perfectos para cumpleaños, aniversarios, baby shower y ocasiones especiales en Santiago."),
]

# FAQ
FAQS = [
    ("¿Hacen polerones personalizados en Santiago de Chile?", "Sí, hacemos polerones y poleras personalizadas en Santiago de Chile. Estamos ubicados en Lo Prado, Milton Rossel 7196. Realizamos envíos a nivel nacional. Cotiza por WhatsApp +56 9 9150 2163."),
    ("¿Qué técnicas de estampado utilizan?", "Utilizamos DTF textil para diseños a todo color, vinilo textil para colores sólidos y logos, y sublimación para telas de poliéster. Te asesoramos para elegir la mejor opción."),
    ("¿Hacen envíos a nivel nacional?", "Sí, enviamos a todas las regiones de Chile, desde Arica hasta Magallanes. Despachamos vía Starken, Chilexpress o BlueExpress el mismo día de confirmado el pago."),
    ("¿Cuánto demora un polerón personalizado?", "Generalmente entre 2 y 5 días hábiles para pedidos individuales. Para pedidos grandes coordinamos un plazo según el volumen. Los envíos adicionan 1-3 días hábiles."),
    ("¿Puedo llevar mi propio diseño?", "¡Por supuesto! Puedes llevar tu diseño en formato digital (PNG, JPG, PDF, AI). También podemos diseñar contigo si tienes una idea. Trabajamos con logos, fotos, textos e ilustraciones."),
    ("¿Qué prendas personalizan?", "Personalizamos poleras, polerones, chaquetas, gorras, yoker, bolsos, mochilas, tote bags, tazas y más. Trabajamos con DTF, vinilo y sublimación."),
    ("¿Hacen domicilios en Santiago?", "Sí, realizamos domicilios para clientes en Santiago. Nos desplazamos a tu ubicación para tomar medidas, mostrar muestras y coordinar diseños. Cobertura en toda la Región Metropolitana."),
    ("¿Ofrecen decoración de fiestas?", "Sí, ofrecemos decoración de fiestas, baby shower, desayunos sorpresas y arriendo de candy bar. Incluye decoración temática personalizada para tu evento."),
    ("¿Cuáles son las formas de pago?", "Aceptamos transferencia bancaria, efectivo y Mercado Pago. Para pedidos grandes: 50% adelanto y resto al momento de entrega. Envíos nacionales: 100% anticipado."),
    ("¿Cómo cotizo mi polerón personalizado?", "Escríbenos por WhatsApp al +56 9 9150 2163 indicando: tipo de prenda, cantidad, técnica de estampado, diseño y fecha. Te responderemos con un presupuesto en minutos."),
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

# Generar HTML de servicios con foto debajo de cada uno
servicios_html = ""
for i, (icon, title, desc) in enumerate(SERVICIOS):
    servicios_html += f"""      <div class="service-card">
        <div class="service-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
"""
    # Agregar foto cada 4 servicios
    if (i + 1) % 4 == 0 and i < len(SERVICIOS) - 1:
        photo_idx = min(i // 4, len(photo_lists["service_photos"]) - 1)
        photo = photo_lists["service_photos"][photo_idx]
        servicios_html += f'      <div style="grid-column:1/-1"><img src="{photo}" alt="Trabajo de JF GODS COMPANY Santiago" style="width:100%;max-height:200px;object-fit:cover;border-radius:0.75rem" loading="lazy"></div>\n'

# Galería de polerones
poleron_gallery = ""
for photo in photo_lists["poleron_photos"]:
    poleron_gallery += f'      <div style="background:white;border:1px solid #E0E7FF;border-radius:0.75rem;overflow:hidden"><img src="{photo}" alt="Polerón personalizado JF GODS COMPANY Santiago" style="width:100%;height:200px;object-fit:cover" loading="lazy"></div>\n'

# Galería mixta (candy bar, fiestas, etc)
mixed_gallery = ""
for photo in photo_lists["gallery_photos"][:12]:
    mixed_gallery += f'      <div style="background:white;border:1px solid #E0E7FF;border-radius:0.75rem;overflow:hidden"><img src="{photo}" alt="Trabajo personalizado JF GODS COMPANY Santiago" style="width:100%;height:200px;object-fit:cover" loading="lazy"></div>\n'

# Categorías
cats_html = ""
for href, icon, title, desc in CATEGORIAS:
    cats_html += f'      <a href="polerones-personalizados/{href}" class="service-card" style="text-decoration:none;color:inherit;display:block"><div class="service-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></a>\n'

# Definiciones
defs_html = ""
for title, desc in DEFINICIONES:
    defs_html += f'      <div class="def-card"><h3>{title}</h3><p>{desc}</p></div>\n'

# FAQ
faq_html = ""
for q, a in FAQS:
    faq_html += f'    <details class="faq-item"><summary>{q}</summary><p>{a}</p></details>\n'

# INDEX COMPLETA
html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-site-verification" content="AO8x2D5digAhJVNmj0wVdeJx60EpOc56vELa9rh_CmY" />
  <title>JF GOD'S COMPANY | Polerones y Poleras Personalizadas Santiago Chile</title>
  <meta name="description" content="JF GOD'S COMPANY - Polerones y poleras personalizadas en Santiago de Chile 🇨🇱. Estampados DTF, vinilo textil y sublimación. Envíos a nivel nacional. Cotiza por WhatsApp +56 9 9150 2163.">
  <meta name="keywords" content="polerones personalizados, poleras personalizadas, estampados Santiago, DTF textil, vinilo textil, sublimación, poleras estampadas, polerones personalizados Santiago, estampados Chile, envíos nacionales">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="assets/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:title" content="JF GOD'S COMPANY - Polerones Personalizados Santiago 🇨🇱">
  <meta property="og:description" content="Estampados DTF, vinilo textil y sublimación en Santiago de Chile. Envíos a nivel nacional. Cotiza por WhatsApp +56 9 9150 2163.">
  <meta property="og:image" content="images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg">
  <meta property="og:locale" content="es_CL">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="JF GOD'S COMPANY - Polerones Personalizados Santiago 🇨🇱">
  <meta name="twitter:description" content="Estampados DTF, vinilo textil y sublimación. Envíos a toda Chile. +56 9 9150 2163.">
  <meta name="twitter:image" content="images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>

<!-- Header -->
<header class="header">
  <div class="header-inner">
    <a href="index.html"><img src="assets/logo.svg" alt="JF GOD'S COMPANY - Polerones Personalizados Santiago"></a>
    <nav class="nav">
      <a href="index.html" class="active">Inicio</a>
      <a href="comunas.html">Comunas</a>
      <a href="servicios.html">Servicios</a>
      <a href="galeria.html">Galería</a>
      <a href="quienes-somos.html">Quiénes Somos</a>
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
    <a href="quienes-somos.html">Quiénes Somos</a>
    <a href="dudas.html">Dudas</a>
    <a href="contacto.html">Contacto</a>
    <a href="https://wa.me/56991502163" target="_blank">💬 WhatsApp</a>
  </div>
</header>

<!-- Banner -->
<section style="position:relative;width:100%;max-height:500px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1a1a1a">
  <img src="images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg" alt="JF GOD'S COMPANY - Polerones Personalizados Santiago Chile" style="width:100%;height:auto;max-height:500px;object-fit:cover;opacity:0.7">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.6) 100%);display:flex;align-items:center;justify-content:center;padding:1rem">
    <div style="text-align:center;max-width:800px">
      <div style="display:inline-flex;align-items:center;gap:0.375rem;background:rgba(76,175,80,0.9);color:white;padding:0.375rem 0.875rem;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">📍 Santiago de Chile · Envíos a Nivel Nacional</div>
      <h1 style="font-family:'Poppins',sans-serif;font-size:2.5rem;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.5);margin-bottom:0.5rem;line-height:1.1">JF GOD'S COMPANY</h1>
      <h2 style="font-family:'Poppins',sans-serif;font-size:1.25rem;font-weight:600;color:#A5D6A7;margin-bottom:1rem;text-shadow:0 2px 8px rgba(0,0,0,0.5)">Poleras y Polerones Personalizados en Santiago</h2>
      <p style="color:rgba(255,255,255,0.9);font-size:0.95rem;max-width:600px;margin:0 auto 1.5rem;text-shadow:0 1px 5px rgba(0,0,0,0.5)">Estampados DTF, vinilo textil y sublimación. Envíos a toda Chile. Tu diseño, tu regla. 🇨🇱</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
        <a href="https://wa.me/56991502163?text=Hola%20JF%20GODS%20COMPANY,%20quisiera%20cotizar%20polerones%20personalizados" target="_blank" style="background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;box-shadow:0 4px 14px rgba(76,175,80,0.4)">💬 Cotizar por WhatsApp</a>
        <a href="galeria.html" style="border:2px solid white;color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;background:rgba(255,255,255,0.1)">📷 Ver Galería</a>
      </div>
    </div>
  </div>
</section>

<!-- Servicios -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Nuestros <span>Servicios</span></h2>
    <p>Especialistas en estampados de polerones y poleras personalizados, envíos a nivel nacional, domicilios y mucho más.</p>
    <div class="services-grid">
{servicios_html}
    </div>
  </div>
</section>

<!-- Galería de Polerones -->
<section class="section section-alt">
  <div class="section-inner">
    <h2>Polerones <span>Personalizados</span></h2>
    <p>Mira nuestros trabajos de polerones y poleras personalizados con DTF, vinilo y sublimación.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin-top:1.5rem">
{poleron_gallery}
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <a href="galeria.html" class="btn-outline">📷 Ver galería completa</a>
    </div>
  </div>
</section>

<!-- Trabajos (candy bar, fiestas, etc) -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Nuestros <span>Trabajos</span></h2>
    <p>Candy bar, decoración de fiestas, baby shower, desayunos sorpresas y más en Santiago de Chile.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin-top:1.5rem">
{mixed_gallery}
    </div>
  </div>
</section>

<!-- Categorías -->
<section class="section section-alt">
  <div class="section-inner">
    <h2>Nuestras <span>Categorías</span></h2>
    <p>Explora nuestras categorías de polerones y poleras personalizadas.</p>
    <div class="services-grid">
{cats_html}
    </div>
  </div>
</section>

<!-- Comunas destacadas -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Comunas que <span>Cubrimos</span></h2>
    <p>Realizamos entregas y servicios en las siguientes comunas de la Región Metropolitana y otras regiones de Chile.</p>
    <div class="comunas-grid">
      <a href="comunas/santiago.html" class="comuna-card"><h3>Santiago</h3><p>Región Metropolitana</p></a>
      <a href="comunas/conchali.html" class="comuna-card"><h3>Conchalí</h3><p>Región Metropolitana</p></a>
      <a href="comunas/el-bosque.html" class="comuna-card"><h3>El Bosque</h3><p>Región Metropolitana</p></a>
      <a href="comunas/la-granja.html" class="comuna-card"><h3>La Granja</h3><p>Región Metropolitana</p></a>
      <a href="comunas/huechuraba.html" class="comuna-card"><h3>Huechuraba</h3><p>Región Metropolitana</p></a>
      <a href="comunas/cerro-navia.html" class="comuna-card"><h3>Cerro Navia</h3><p>Región Metropolitana</p></a>
      <a href="comunas/san-bernardo.html" class="comuna-card"><h3>San Bernardo</h3><p>Región Metropolitana</p></a>
      <a href="comunas/san-joaquin.html" class="comuna-card"><h3>San Joaquín</h3><p>Región Metropolitana</p></a>
      <a href="comunas/independencia.html" class="comuna-card"><h3>Independencia</h3><p>Región Metropolitana</p></a>
      <a href="comunas/padre-hurtado.html" class="comuna-card"><h3>Padre Hurtado</h3><p>Región Metropolitana</p></a>
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <a href="comunas.html" class="btn-outline">📍 Ver todas las comunas</a>
    </div>
  </div>
</section>

<!-- Definiciones SEO -->
<section class="section section-alt">
  <div class="section-inner" style="max-width:800px">
    <h2>Todo sobre <span>Polerones Personalizados</span></h2>
    <p>Conoce todo sobre estampados textiles, técnicas y servicios que ofrecemos en Santiago de Chile.</p>
{defs_html}
  </div>
</section>

<!-- FAQ -->
<section class="section section-white">
  <div class="section-inner" style="max-width:800px">
    <h2>Preguntas <span>Frecuentes</span></h2>
    <p>Resolvemos las dudas más comunes sobre polerones personalizados y envíos.</p>
{faq_html}
    <div style="text-align:center;margin-top:1.5rem">
      <p style="margin-bottom:1rem">¿Tienes más dudas? Visita nuestra página de <a href="dudas.html" style="color:#2E7D32;font-weight:600">preguntas y respuestas completas</a></p>
      <a href="https://wa.me/56991502163?text=Hola,%20tengo%20una%20duda%20sobre%20polerones%20personalizados" target="_blank" class="btn-primary">💬 Contactar por WhatsApp</a>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <h2>¿Listo para tu polerón personalizado?</h2>
  <p>Cotiza por WhatsApp. Atención inmediata, envíos a nivel nacional, diseños únicos.</p>
  <a href="https://wa.me/56991502163?text=Hola%20JF%20GODS%20COMPANY,%20quisiera%20cotizar%20un%20polerón%20personalizado" target="_blank" class="btn-white">💬 Cotizar por WhatsApp</a>
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
      <a href="quienes-somos.html">Quiénes Somos</a>
      <a href="dudas.html">Dudas</a>
      <a href="contacto.html">Contacto</a>
      <a href="politica-privacidad.html">Política de Privacidad</a>
    </div>
    <div>
      <h3>Contacto</h3>
      <a href="https://wa.me/56991502163" target="_blank">💬 +56 9 9150 2163</a>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">📍 Lo Prado, Milton Rossel 7196<br>Santiago de Chile</p>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">🕒 Lun a Sáb: 9:00 AM - 6:00 PM</p>
    </div>
  </div>
  <div class="footer-bottom"><p>© 2026 JF GOD'S COMPANY. Todos los derechos reservados.</p></div>
</footer>
<a href="https://wa.me/56991502163" target="_blank" class="wa-floating">💬</a>

</body>
</html>"""

(BASE / "index.html").write_text(html, encoding="utf-8")
print(f"✓ index.html reconstruida ({len(html)} bytes)")
print(f"  - {len(SERVICIOS)} servicios con fotos")
print(f"  - {len(photo_lists['poleron_photos'])} fotos de polerones")
print(f"  - 12 fotos mixtas (candy bar, fiestas, etc)")
print(f"  - {len(CATEGORIAS)} categorías")
print(f"  - {len(DEFINICIONES)} definiciones SEO")
print(f"  - {len(FAQS)} preguntas frecuentes")
print(f"  - {10} comunas destacadas")
