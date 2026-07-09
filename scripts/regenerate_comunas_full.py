#!/usr/bin/env python3
"""
Regenera las 20 páginas de comunas con TODO el contenido de la index:
- Banner con nombre de comuna
- Todos los 21 servicios completos
- Galería de productos destacados
- Categorías
- Definiciones SEO adaptadas
- FAQ adaptado
- CTA
Es básicamente una copia de la index pero con el nombre de la comuna.
"""
from pathlib import Path

BASE = Path("/home/z/my-project/polerones/comunas")

COMUNAS = [
    ("santiago", "Santiago", "Región Metropolitana"),
    ("conchali", "Conchalí", "Región Metropolitana"),
    ("el-bosque", "El Bosque", "Región Metropolitana"),
    ("la-granja", "La Granja", "Región Metropolitana"),
    ("huechuraba", "Huechuraba", "Región Metropolitana"),
    ("cerro-navia", "Cerro Navia", "Región Metropolitana"),
    ("san-bernardo", "San Bernardo", "Región Metropolitana"),
    ("san-joaquin", "San Joaquín", "Región Metropolitana"),
    ("independencia", "Independencia", "Región Metropolitana"),
    ("padre-hurtado", "Padre Hurtado", "Región Metropolitana"),
    ("buin", "Buin", "Región Metropolitana"),
    ("lampa", "Lampa", "Región Metropolitana"),
    ("paine", "Paine", "Región Metropolitana"),
    ("colina", "Colina", "Región Metropolitana"),
    ("pirque", "Pirque", "Región Metropolitana"),
    ("tiltil", "Tiltil", "Región Metropolitana"),
    ("san-pedro-de-la-paz", "San Pedro de la Paz", "Bío Bío"),
    ("melipilla", "Melipilla", "Región Metropolitana"),
    ("alhue", "Alhué", "Región Metropolitana"),
    ("san-pedro-de-atacama", "San Pedro de Atacama", "Antofagasta"),
]

# Todos los servicios con descripciones completas
SERVICIOS = [
    ("👕", "Estampado DTF Textil", "Estampado DTF (Direct to Film) textil de máxima calidad para poleras, polerones, chaquetas, gorras y más. Técnica de vanguardia que permite diseños a todo color con alta durabilidad, lavables y resistentes al lavado. Ideal para diseños complejos, fotografías, gradientes y logos corporativos. Trabajamos con todas las telas: algodón, poliéster, mezclas y materiales técnicos. Resultados profesionales garantizados con colores vibrantes que no se desvanecen."),
    ("🎨", "Vinilo Textil", "Estampado en vinilo textil para polerones y poleras personalizados. El vinilo textil ofrece alta durabilidad, colores vibrantes y excelente adherencia. Perfecto para uniformes deportivos, regalos personalizados, polerones de empresas, eventos y números de deportistas. Disponible en variedad de colores incluyendo efectos especiales como glitter, reflectante, metalizado y holográfico. Aplicación profesional con prensa térmica de alta temperatura."),
    ("🔥", "Sublimación Textil", "Servicio de sublimación para poleras, polerones y prendas en poliéster. La sublimación permite diseños a todo color que se integran permanentemente en la tela, sin alterar la textura ni la transpirabilidad. Ideal para uniformes deportivos, poleras promocionales, regalos corporativos y diseños fotográficos. Los colores no se desvanecen con el lavado. Trabajamos con telas de alta calidad importadas. Resultados profesionales de larga duración."),
    ("🚚", "Envíos a Nivel Nacional", "Realizamos envíos a nivel nacional a todas las regiones de Chile, desde Arica hasta Magallanes. Despachamos el mismo día de confirmado el pago vía Starken, Chilexpress, BlueExpress o el courier de tu preferencia. Incluye seguimiento de envío para que sepas dónde está tu pedido en todo momento. Cobertura completa del país con entregas rápidas y seguras. Coordinación inmediata al confirmar tu compra."),
    ("🏠", "Domicilios y Arreglos en Sitio", "Servicio de domicilios y arreglos en sitio para clientes en Santiago. Nos desplazamos a tu ubicación para tomar medidas, mostrar muestras de telas y colores, y coordinar el diseño de tu polerón o polera personalizada. También realizamos arreglos y modificaciones en el lugar cuando es posible. Ideal para empresas, equipos deportivos, grupos grandes y eventos. Cobertura en toda la Región Metropolitana con atención profesional."),
    ("🧢", "Estampados en Gorras y Yoker", "Estampados personalizados en gorras, yoker y accesorios. Personalizamos gorras con tu logo, nombre o diseño utilizando técnicas de DTF, vinilo y sublimación. Trabajamos con diferentes modelos: gorras planas, curvas, trucker, snapback, new era y más. Ideales para regalos promocionales, uniformes de empresa, eventos deportivos, equipos y merchandising. Calidad premium y acabados profesionales."),
    ("👜", "Estampados en Bolsos y Accesorios", "Personalización de bolsos, mochilas, tote bags y accesorios con estampados DTF, vinilo y sublimación. Los bolsos personalizados son perfectos para regalos corporativos, eventos, ferias y merchandising. Trabajamos con diferentes materiales: tela, lona, poliéster y más. Diseños a todo color, resistentes al lavado y de alta durabilidad. Haz que tu marca destaque con accesorios únicos y personalizados."),
    ("👕", "Poleras y Polerones Personalizados", "Poleras y polerones personalizados para damas y caballeros con la mejor calidad de Santiago. Utilizamos técnicas de DTF, vinilo y sublimación para crear diseños únicos. Trabajamos con diferentes tipos de telas: algodón premium, dry-fit, poliéster y mezclas. Tallas desde XS hasta XXL. Ideales para uso personal, regalos, empresas, eventos deportivos, grupos y cualquier ocasión. Tu diseño, tu regla."),
    ("🎉", "Decoración de Fiestas", "Servicio completo de decoración de fiestas y eventos en Santiago. Transformamos cualquier espacio con decoraciones temáticas personalizadas: cumpleaños, bautizos, matrimonios, graduaciones y eventos corporativos. Incluye globos, centros de mesa, fondos fotográficos, banner personalizado, mesas de dulces y más. Coordinamos contigo cada detalle para que tu evento sea único e inolvidable. Atención personalizada y presupuestos a tu medida."),
    ("👶", "Baby Shower", "Organización y decoración de baby shower personalizado en Santiago. Creamos ambientes mágicos para celebrar la llegada de tu bebé con decoraciones temáticas, centros de mesa, banners personalizados, mesa de dulces y souvenirs. Trabajamos con diferentes temáticas: clásico, moderno, norteño, animalitos y más. Incluye polerones personalizados para la mamá y los invitados. Haremos de tu baby shower un momento inolvidable."),
    ("🥐", "Desayunos Sorpresas", "Desayunos sorpresas personalizados en Santiago. Sorprende a esa persona especial con un desayuno único que incluye polera o polerón con mensaje personalizado, desayuno completo, decoración y entrega a domicilio. Perfecto para cumpleaños, aniversarios, día de la madre, día del padre, San Valentín y cualquier ocasión especial. Coordinamos la entrega a la hora que nos indiques para que la sorpresa sea perfecta."),
    ("🍭", "Arriendo de Candy Bar", "Arriendo de candy bar completo para fiestas y eventos en Santiago. Mesa de dulces profesional con variedad de golosinas, chocolates, cupcakes, cake pops y más. Incluye decoración temática, contenedores, etiquetas personalizadas y servicio de montaje. El candy bar es el centro de atracción de cualquier evento. Ideal para cumpleaños, matrimonios, bautizos, eventos corporativos y celebraciones."),
    ("✂️", "Arreglos y Modificaciones Textiles", "Servicio de arreglos y modificaciones textiles en Santiago. Realizamos ajustes, parches, refuerzos y reparaciones en polerones, poleras, chaquetas y prendas en general. Si tu polerón favorito necesita un arreglo o quieres transformar una prenda, nosotros te ayudamos. También aplicamos parchces personalizados, cierres, broches y modificaciones de diseño. Servicio rápido y profesional con garantía de calidad."),
    ("👕", "Polerones para Empresas", "Polerones personalizados para empresas, equipos de trabajo y eventos corporativos en Santiago. Estampamos tu logo empresarial con técnicas DTF, vinilo y sublimación. Ideales para uniformes, regalos corporativos, eventos de team building, ferias, cajas navideñas y promociones. Trabajamos con diferentes calidades de polerones: algodón premium, poliéster, canguro, con capucha y más. Precios especiales por volumen."),
    ("⚽", "Poleras Deportivas Personalizadas", "Poleras deportivas personalizadas para equipos, clubes y grupos en Santiago. Utilizamos técnicas de sublimación y DTF para crear diseños únicos con números, nombres, logos y patrones a todo color. Trabajamos con telas técnicas transpirables de alta calidad: dry-fit, poliéster y mezclas. Ideales para fútbol, básquet, vóley, running, ciclismo y cualquier disciplina. Tallas para adultos y niños."),
    ("🎁", "Regalos Personalizados", "Regalos personalizados únicos para toda ocasión en Santiago. Creamos poleras, polerones y prendas personalizadas que son el regalo perfecto para cumpleaños, aniversarios, día de la madre, día del padre, San Valentín, graduaciones, Navidad y más. Diseñamos contigo cada detalle: mensaje, foto, fecha, nombre o cualquier elemento que haga especial tu regalo. Entrega rápida y empaquetado especial disponible."),
    ("🏆", "Polerones para Eventos y Grupos", "Polerones personalizados para eventos, grupos, peñas y reuniones en Santiago. Ya sea para un evento deportivo, musical, familiar o empresarial, creamos polerones únicos que identifican a tu grupo. Diseños a todo color con DTF y sublimación, diferentes tallas y colores. Ideales para peñas, festivales, conciertos, viajes grupales, despedidas de soltero/a y eventos masivos. Precios especiales por cantidad."),
    ("🖨️", "Estampados de Camisetas", "Estampados de camisetas personalizadas con técnicas DTF, vinilo y sublimación. Personalizamos camisetas con tu diseño, logo, foto o texto. Ideales para eventos, regalos, empresas, grupos deportivos y uso personal. Trabajamos con camisetas de alta calidad en algodón y mezclas. Diseños a todo color, resistentes al lavado y de alta durabilidad. Tu camiseta única con acabado profesional."),
    ("🎈", "Arreglo de Fiestas Infantiles", "Arreglo de fiestas infantiles completo en Santiago. Incluye decoración temática con personajes infantiles, globos, centros de mesa, mesa de dulces, banner personalizado y souvenirs. Trabajamos con todas las temáticas: princesas, superhéroes, animalitos, payasos y más. También personalizamos polerones para el cumpleañero y los invitados. Hacemos que la fiesta de tu hijo sea mágica e inolvidable."),
    ("💝", "Regalos Empresariales", "Regalos empresariales personalizados para empresas en Santiago. Creamos souvenirs corporativos únicos: polerones con logo, gorras personalizadas, bolsos de marca, tote bags y más. Ideales para cajas navideñas, eventos corporativos, ferias, promociones y regalos a clientes. Trabajamos con productos de alta calidad y acabados premium. Precios especiales por volumen. Haz que tu marca destaque con regalos que tus clientes usarán con orgullo."),
    ("📦", "Regalos a Domicilio", "Servicio de regalos a domicilio en Santiago y envíos a nivel nacional. Sorprende a esa persona especial con un regalo personalizado entregado directamente en su puerta. Incluye polerón personalizado, empaquetado especial y tarjeta de mensaje. Perfecto para cumpleaños, aniversarios, San Valentín, día de la madre y cualquier ocasión especial. Coordinamos la entrega a la hora que nos indiques. También envíos sorpresa a todas las regiones de Chile."),
]

# Definiciones SEO
DEFINICIONES = [
    ("Polerones Personalizados", "Los polerones personalizados son prendas únicas diseñadas a tu medida con estampados DTF, vinilo textil y sublimación. Ofrecemos polerones de alta calidad para damas y caballeros, con diseños personalizados que reflejan tu estilo, empresa o evento. Trabajamos con las mejores telas y técnicas de estampado de vanguardia. Envíos a nivel nacional."),
    ("Estampados DTF Textil", "El estampado DTF (Direct to Film) textil es una técnica de estampación de vanguardia que permite imprimir diseños a todo color sobre una película especial que luego se transfiere a la tela. Ofrece máxima durabilidad, colores vibrantes y es lavable. Ideal para poleras, polerones, gorras y accesorios con diseños complejos, fotografías y gradientes en cualquier tipo de tela."),
    ("Vinilo Textil", "El vinilo textil es una técnica de estampado que utiliza láminas de vinilo cortadas a medida y aplicadas con calor sobre la tela. Es ideal para textos, números, logos y diseños de colores sólidos. Ofrece alta durabilidad, colores vibrantes y excelente adherencia. Perfecto para uniformes deportivos, regalos personalizados, polerones de empresas y eventos."),
    ("Sublimación Textil", "La sublimación textil es una técnica que permite transferir diseños a todo color permanentemente sobre telas de poliéster. A diferencia de otros métodos, la tinta se integra en la fibra sin alterar la textura ni la transpirabilidad. Los colores no se desvanecen con el lavado. Ideal para uniformes deportivos, poleras promocionales y diseños fotográficos de alta calidad."),
    ("Poleras Estampadas", "Las poleras estampadas son prendas personalizadas con diseños únicos aplicados mediante técnicas de DTF, vinilo o sublimación. Ofrecemos poleras de alta calidad para hombre y mujer, con diseños que van desde logos corporativos hasta arte personalizado. Disponibles en diferentes colores, tallas y materiales. Ideales para regalo, uso personal, eventos y empresas."),
    ("Gorras Personalizadas", "Las gorras personalizadas son accesorios únicos estampados con tu logo, nombre o diseño. Utilizamos técnicas de DTF, vinilo y sublimación para crear gorras a tu medida. Ideales para regalos promocionales, uniformes de empresa, eventos deportivos, equipos y merchandising. Trabajamos con diferentes modelos: planas, curvas, trucker, snapback, new era y más."),
    ("Envíos a Nivel Nacional", "Los envíos a nivel nacional permiten que recibas tus polerones y poleras personalizadas en cualquier región de Chile, desde Arica hasta Magallanes. Despachamos el mismo día de confirmado el pago vía Starken, Chilexpress, BlueExpress o el courier de tu preferencia. Incluye seguimiento de envío. Entregas rápidas, seguras y confiables a todo el país."),
    ("Decoración de Fiestas", "La decoración de fiestas y eventos incluye transformación completa de espacios con temáticas personalizadas: globos, centros de mesa, fondos fotográficos, banner personalizado y mesas de dulces. Servicios para cumpleaños, bautizos, matrimonios, graduaciones y eventos corporativos. Coordinación de cada detalle para que tu evento sea único, especial e inolvidable."),
    ("Desayunos Sorpresas", "Los desayunos sorpresas incluyen polera o polerón personalizado con mensaje, desayuno completo con waffles, frutas y jugos, decoración temática y entrega a domicilio. Perfecto para cumpleaños, aniversarios, día de la madre, San Valentín. Coordinamos la entrega a la hora exacta. También envíos a nivel nacional."),
    ("Candy Bar", "El arriendo de candy bar incluye mesa de dulces profesional con golosinas, cupcakes y decoración temática. Los desayunos sorpresas incluyen polera personalizada, desayuno completo y entrega a domicilio. Perfectos para cumpleaños, aniversarios, baby shower y ocasiones especiales."),
]

# FAQ adaptado
FAQS = [
    ("¿Hacen polerones personalizados en {comuna}?", "Sí, hacemos polerones y poleras personalizadas en {comuna}, {region}. Realizamos envíos a esta comuna y también ofrecemos domicilios. Cotiza por WhatsApp +56 9 9150 2163."),
    ("¿Qué técnicas de estampado utilizan en {comuna}?", "Utilizamos DTF textil para diseños a todo color, vinilo textil para colores sólidos y logos, y sublimación para telas de poliéster. Te asesoramos para elegir la mejor opción según tu diseño y tela."),
    ("¿Hacen envíos a {comuna}?", "Sí, hacemos envíos a {comuna}, {region}. Despachamos vía Starken, Chilexpress o BlueExpress el mismo día de confirmado el pago. Entrega rápida con seguimiento incluido."),
    ("¿Cuánto demora un polerón personalizado para {comuna}?", "Generalmente entre 2 y 5 días hábiles para pedidos individuales. Para pedidos grandes coordinamos un plazo según el volumen. Los envíos a {comuna} adicionan 1-3 días hábiles."),
    ("¿Puedo llevar mi propio diseño para {comuna}?", "¡Sí! Puedes llevar tu diseño en formato digital (PNG, JPG, PDF, AI). También podemos diseñar contigo si tienes una idea. Trabajamos con logos, fotos, textos e ilustraciones."),
    ("¿Qué prendas personalizan en {comuna}?", "Personalizamos poleras, polerones, chaquetas, gorras, yoker, bolsos, mochilas y tote bags. También hacemos arreglos y modificaciones textiles en {comuna}."),
    ("¿Hacen domicilios en {comuna}?", "Sí, realizamos domicilios y arreglos en sitio para clientes en {comuna}. Nos desplazamos a tu ubicación para tomar medidas, mostrar muestras y coordinar diseños. Coordina tu visita por WhatsApp."),
    ("¿Ofrecen decoración de fiestas en {comuna}?", "Sí, ofrecemos decoración de fiestas, baby shower, desayunos sorpresas y arriendo de candy bar en {comuna}. Incluye decoración temática personalizada para tu evento."),
    ("¿Cuáles son las formas de pago para pedidos en {comuna}?", "Aceptamos transferencia bancaria, efectivo y Mercado Pago. Para pedidos grandes: 50% adelanto y resto al momento de entrega. Envíos a {comuna}: 100% anticipado."),
    ("¿Cómo cotizo mi polerón personalizado para {comuna}?", "Escríbenos por WhatsApp al +56 9 9150 2163 indicando: tipo de prenda, cantidad, técnica de estampado, diseño y fecha. Te responderemos con un presupuesto en minutos."),
]


def generate_comuna_page(slug, name, region):
    # Generar cards de servicios
    servicios_html = ""
    for icon, title, desc in SERVICIOS:
        # Adaptar descripción con el nombre de la comuna
        desc_adapted = desc.replace("en Santiago", f"en {name}")
        servicios_html += f'      <div class="service-card">\n        <div class="service-icon">{icon}</div>\n        <h3>{title}</h3>\n        <p>{desc_adapted}</p>\n      </div>\n'

    # Galería de productos
    productos = [
        ("poleron-hombre-personalizado-estampado-santiago-urbano.jpg", "Polerón Hombre Urbano", "Personalizado con estampado DTF"),
        ("poleron-mujer-personalizado-crop-top-santiago-fashion.jpg", "Polerón Mujer Fashion", "Crop top personalizado"),
        ("poleron-oversize-mujer-algodon-estampado-chile-style.jpg", "Polerón Oversize Style", "Algodón premium oversize"),
        ("poleron-canguro-algodon-hombre-deportivo-chile-premium.jpg", "Polerón Canguro Premium", "Deportivo, algodón premium"),
        ("sudadera-caballero-negra-con-gorro-san-joaquin-exclusive.jpg", "Sudadera Caballero", "Negra con gorro, exclusive"),
        ("sudadera-dama-rosada-con-cierre-san-joaquin-trendy.jpg", "Sudadera Dama Trendy", "Rosada con cierre"),
        ("polerones-parejas-personalizados-aniversario-santiago-love.jpg", "Polerones de Parejas", "Aniversario, love match"),
        ("sudaderas-novios-king-queen-san-joaquin-together.jpg", "Sudaderas King & Queen", "Novios together"),
        ("poleron-anime-naruto-personalizado-otaku-santiago-geek.jpg", "Polerón Anime Geek", "Naruto, otaku personalizado"),
        ("poleron-4to-medio-generacion-2026-escolar-chile-class.jpg", "Polerón 4to Medio 2026", "Generación escolar class"),
        ("poleron-corporativo-empresa-bordado-san-joaquin-work.jpg", "Polerón Corporativo", "Empresa, bordado, work"),
        ("conjunto-polerones-duo-amor-14-febrero-chile-match.jpg", "Conjunto Dúo Amor", "14 febrero, match"),
    ]

    galeria_html = ""
    for img, titulo, desc in productos:
        galeria_html += f"""      <div style="background:white;border:1px solid #E0E7FF;border-radius:1rem;overflow:hidden;transition:all 0.3s" onmouseover="this.style.boxShadow='0 10px 30px rgba(76,175,80,0.15)'" onmouseout="this.style.boxShadow='none'">
        <img src="../images/{img}" alt="{titulo} en {name}" style="width:100%;height:250px;object-fit:cover" loading="lazy">
        <div style="padding:1rem"><h3 style="font-size:0.9rem;font-weight:700;margin-bottom:0.25rem">{titulo}</h3><p style="font-size:0.75rem;color:#6B7280">{desc}</p></div>
      </div>
"""

    # Definiciones SEO
    defs_html = ""
    for title, desc in DEFINICIONES:
        defs_html += f'      <div class="def-card"><h3>{title}</h3><p>{desc}</p></div>\n'

    # FAQ
    faq_html = ""
    for i, (q, a) in enumerate(FAQS):
        q_adapted = q.replace("{comuna}", name).replace("{region}", region)
        a_adapted = a.replace("{comuna}", name).replace("{region}", region)
        faq_html += f'    <details class="faq-item"><summary>{q_adapted}</summary><p>{a_adapted}</p></details>\n'

    # Categorías
    categorias = [
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

    cats_html = ""
    for href, icon, title, desc in categorias:
        cats_html += f'      <a href="../polerones-personalizados/{href}" class="service-card" style="text-decoration:none;color:inherit;display:block"><div class="service-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></a>\n'

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polerones Personalizados en {name} | JF GOD'S COMPANY - Estampados {region}</title>
  <meta name="description" content="JF GOD'S COMPANY - Polerones y poleras personalizadas en {name}, {region}. Estampados DTF, vinilo y sublimación. Envíos a {name}. WhatsApp +56 9 9150 2163.">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header class="header">
  <div class="header-inner">
    <a href="../index.html"><img src="../assets/logo.svg" alt="JF GOD'S COMPANY"></a>
    <nav class="nav">
      <a href="../index.html">Inicio</a>
      <a href="../comunas.html">Comunas</a>
      <a href="../servicios.html">Servicios</a>
      <a href="../quienes-somos.html">Quiénes Somos</a>
      <a href="../dudas.html">Dudas</a>
      <a href="../contacto.html">Contacto</a>
    </nav>
    <a href="https://wa.me/56991502163" target="_blank" class="btn-wa">💬 WhatsApp</a>
    <button class="mobile-menu-btn" onclick="document.getElementById('mobileNav').classList.toggle('open')">☰</button>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <a href="../index.html">Inicio</a>
    <a href="../comunas.html">Comunas</a>
    <a href="../servicios.html">Servicios</a>
    <a href="../quienes-somos.html">Quiénes Somos</a>
    <a href="../dudas.html">Dudas</a>
    <a href="../contacto.html">Contacto</a>
  </div>
</header>

<!-- Banner con nombre de comuna -->
<section style="position:relative;width:100%;max-height:400px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1a1a1a">
  <img src="../images/banner-tienda-polerones-personalizados-chile-disenos-exclusivos.jpg" alt="Polerones Personalizados en {name}" style="width:100%;height:auto;max-height:400px;object-fit:cover;opacity:0.5">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.7) 100%);display:flex;align-items:center;justify-content:center;padding:1rem">
    <div style="text-align:center;max-width:800px">
      <div style="display:inline-flex;align-items:center;gap:0.375rem;background:rgba(76,175,80,0.9);color:white;padding:0.375rem 0.875rem;border-radius:9999px;font-size:0.75rem;font-weight:600;margin-bottom:1rem">📍 {region}, Chile</div>
      <h1 style="font-family:'Poppins',sans-serif;font-size:2rem;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.5);margin-bottom:0.5rem">Polerones Personalizados en {name}</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:0.95rem;max-width:600px;margin:0 auto 1.5rem;text-shadow:0 1px 5px rgba(0,0,0,0.5)">JF GOD'S COMPANY - Estampados DTF, vinilo textil y sublimación en {name}. Envíos rápidos a {name}, {region}. Cotiza por WhatsApp +56 9 9150 2163.</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
        <a href="https://wa.me/56991502163?text=Hola%20JF%20GOD'S%20COMPANY,%20quisiera%20polerones%20personalizados%20en%20{name}" target="_blank" style="background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;box-shadow:0 4px 14px rgba(76,175,80,0.4)">💬 Cotizar por WhatsApp</a>
      </div>
    </div>
  </div>
</section>

<!-- Servicios -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Servicios en <span>{name}</span></h2>
    <p>Especialistas en estampados de polerones y poleras personalizados en {name}. Envíos a nivel nacional, domicilios, arreglos en sitio y mucho más.</p>
    <div class="services-grid">
{servicios_html}
    </div>
  </div>
</section>

<!-- Productos Destacados -->
<section class="section section-alt">
  <div class="section-inner">
    <h2>Productos <span>Destacados</span> en {name}</h2>
    <p>Mira algunos de nuestros polerones y poleras personalizadas disponibles para envío a {name}.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.5rem;margin-top:2rem">
{galeria_html}
    </div>
  </div>
</section>

<!-- Categorías -->
<section class="section section-white">
  <div class="section-inner">
    <h2>Categorías disponibles en <span>{name}</span></h2>
    <p>Explora nuestras categorías de polerones y poleras personalizadas para envío a {name}.</p>
    <div class="services-grid">
{cats_html}
    </div>
  </div>
</section>

<!-- Definiciones SEO -->
<section class="section section-alt">
  <div class="section-inner" style="max-width:800px">
    <h2>Todo sobre <span>Polerones Personalizados en {name}</span></h2>
    <p>Conoce todo sobre estampados textiles, técnicas y servicios que ofrecemos en {name}, {region}.</p>
{defs_html}
  </div>
</section>

<!-- FAQ -->
<section class="section section-white">
  <div class="section-inner" style="max-width:800px">
    <h2>Preguntas Frecuentes sobre <span>{name}</span></h2>
    <p>Resolvemos las dudas más comunes sobre polerones personalizados y envíos a {name}.</p>
{faq_html}
    <div style="text-align:center;margin-top:2rem;padding:1.5rem;background:#E8F5E9;border-radius:1rem">
      <h3 style="margin-bottom:0.5rem">¿Tienes más dudas sobre {name}?</h3>
      <p style="margin-bottom:1rem">Escríbenos por WhatsApp y te asesoramos sin compromiso.</p>
      <a href="https://wa.me/56991502163?text=Hola,%20tengo%20una%20duda%20sobre%20polerones%20personalizados%20en%20{name}" target="_blank" class="btn-primary">💬 Consultar por WhatsApp</a>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <h2>¿Listo para tu polerón personalizado en {name}?</h2>
  <p>Cotiza por WhatsApp. Envíos rápidos a {name}, {region}. Atención inmediata.</p>
  <a href="https://wa.me/56991502163?text=Hola%20JF%20GOD'S%20COMPANY,%20quisiera%20cotizar%20polerones%20personalizados%20en%20{name}" target="_blank" class="btn-white">💬 Cotizar por WhatsApp</a>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="footer-inner">
    <div>
      <div class="footer-logo"><img src="../assets/logo.svg" alt="JF GOD'S COMPANY"></div>
      <p style="font-size:0.875rem;color:#9CA3AF">JF GOD'S COMPANY - Polerones y poleras personalizadas en Santiago de Chile. Estampados DTF, vinilo textil y sublimación. Envíos a nivel nacional.</p>
    </div>
    <div>
      <h3>Servicios</h3>
      <a href="../servicios.html">Todos los Servicios</a>
      <a href="../servicios.html">Estampado DTF</a>
      <a href="../servicios.html">Vinilo Textil</a>
      <a href="../servicios.html">Sublimación</a>
      <a href="../servicios.html">Decoración de Fiestas</a>
      <a href="../servicios.html">Candy Bar</a>
    </div>
    <div>
      <h3>Navegación</h3>
      <a href="../index.html">Inicio</a>
      <a href="../comunas.html">Comunas</a>
      <a href="../servicios.html">Servicios</a>
      <a href="../quienes-somos.html">Quiénes Somos</a>
      <a href="../dudas.html">Dudas</a>
      <a href="../contacto.html">Contacto</a>
      <a href="../politica-privacidad.html">Política de Privacidad</a>
    </div>
    <div>
      <h3>Contacto</h3>
      <a href="https://wa.me/56991502163" target="_blank">💬 +56 9 9150 2163</a>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">📍 Lo Prado, Milton Rossel 7196<br>Santiago de Chile</p>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">🕒 Lun a Sáb: 9:00 AM - 6:00 PM</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 JF GOD'S COMPANY. Todos los derechos reservados.</p>
  </div>
</footer>
<a href="https://wa.me/56991502163" target="_blank" class="wa-floating">💬</a>
</body>
</html>"""

    return html


# Generar todas las páginas
count = 0
for slug, name, region in COMUNAS:
    html = generate_comuna_page(slug, name, region)
    (BASE / f"{slug}.html").write_text(html, encoding="utf-8")
    count += 1
    print(f"  ✓ {slug}.html ({len(html)} bytes)")

print(f"\n✅ {count} páginas de comunas regeneradas con contenido completo")
