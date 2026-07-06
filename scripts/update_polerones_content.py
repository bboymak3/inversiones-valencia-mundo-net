#!/usr/bin/env python3
"""
Actualiza la web de polerones con más servicios y contenido SEO
basado en las 9965 palabras clave del archivo Excel.
Crea servicios-adicionales.html con contenido extenso.
"""
from pathlib import Path

BASE = Path("/home/z/my-project/polerones")

HEADER = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="icon" href="{asset_path}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="{asset_path}assets/style.css">
</head>
<body>
<header class="header">
  <div class="header-inner">
    <a href="{asset_path}index.html"><img src="{asset_path}assets/logo.svg" alt="Polerones Personalizados Santiago"></a>
    <nav class="nav">
      <a href="{asset_path}index.html">Inicio</a>
      <a href="{asset_path}comunas.html">Comunas</a>
      <a href="{asset_path}servicios.html" class="{servicios_active}">Servicios</a>
      <a href="{asset_path}quienes-somos.html">Quiénes Somos</a>
      <a href="{asset_path}dudas.html">Dudas</a>
      <a href="{asset_path}contacto.html">Contacto</a>
    </nav>
    <a href="https://wa.me/56991502163" target="_blank" class="btn-wa">💬 WhatsApp</a>
    <button class="mobile-menu-btn" onclick="document.getElementById('mobileNav').classList.toggle('open')">☰</button>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <a href="{asset_path}index.html">Inicio</a>
    <a href="{asset_path}comunas.html">Comunas</a>
    <a href="{asset_path}servicios.html">Servicios</a>
    <a href="{asset_path}quienes-somos.html">Quiénes Somos</a>
    <a href="{asset_path}dudas.html">Dudas</a>
    <a href="{asset_path}contacto.html">Contacto</a>
  </div>
</header>
"""

FOOTER = """
<footer class="footer">
  <div class="footer-inner">
    <div>
      <div class="footer-logo"><img src="{asset_path}assets/logo.svg" alt="Polerones Personalizados Santiago"></div>
      <p style="font-size:0.875rem;color:#9CA3AF">Polerones y poleras personalizadas en Santiago de Chile. Estampados DTF, vinilo textil y sublimación. Envíos a nivel nacional.</p>
    </div>
    <div>
      <h3>Servicios</h3>
      <a href="{asset_path}servicios.html">Todos los Servicios</a>
      <a href="{asset_path}servicios.html">Estampado DTF</a>
      <a href="{asset_path}servicios.html">Vinilo Textil</a>
      <a href="{asset_path}servicios.html">Sublimación</a>
      <a href="{asset_path}servicios.html">Decoración de Fiestas</a>
      <a href="{asset_path}servicios.html">Candy Bar</a>
      <a href="{asset_path}servicios.html">Desayunos Sorpresa</a>
    </div>
    <div>
      <h3>Navegación</h3>
      <a href="{asset_path}index.html">Inicio</a>
      <a href="{asset_path}comunas.html">Comunas</a>
      <a href="{asset_path}servicios.html">Servicios</a>
      <a href="{asset_path}quienes-somos.html">Quiénes Somos</a>
      <a href="{asset_path}dudas.html">Dudas</a>
      <a href="{asset_path}contacto.html">Contacto</a>
      <a href="{asset_path}politica-privacidad.html">Política de Privacidad</a>
    </div>
    <div>
      <h3>Contacto</h3>
      <a href="https://wa.me/56991502163" target="_blank">💬 +56 9 9150 2163</a>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">📍 Lo Prado, Milton Rossel 7196<br>Santiago de Chile</p>
      <p style="font-size:0.875rem;color:#9CA3AF;margin-top:0.5rem">🕒 Lun a Sáb: 9:00 AM - 6:00 PM</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 Polerones Personalizados Santiago. Todos los derechos reservados.</p>
  </div>
</footer>
<a href="https://wa.me/56991502163" target="_blank" class="wa-floating">💬</a>
</body>
</html>
"""

def page(content, title, desc, asset_path="", servicios_active=""):
    h = HEADER.format(title=title, desc=desc, asset_path=asset_path, servicios_active=servicios_active)
    f = FOOTER.format(asset_path=asset_path)
    return h + content + f


# === SERVICIOS PAGE (completa con todas las keywords) ===
SERVICIOS = [
    ("👕", "Estampado DTF Textil", "Estampado DTF (Direct to Film) textil de máxima calidad para poleras, polerones, chaquetas, gorras y más. Técnica de vanguardia que permite diseños a todo color con alta durabilidad, lavables y resistentes al lavado. Ideal para diseños complejos, fotografías, gradientes y logos corporativos. Trabajamos con todas las telas: algodón, poliéster, mezclas y materiales técnicos. Resultados profesionales garantizados con colores vibrantes que no se desvanecen."),
    ("🎨", "Vinilo Textil", "Estampado en vinilo textil para polerones y poleras personalizados. El vinilo textil ofrece alta durabilidad, colores vibrantes y excelente adherencia. Perfecto para uniformes deportivos, regalos personalizados, polerones de empresas, eventos y números de deportistas. Disponible en variedad de colores incluyendo efectos especiales como glitter, reflectante, metalizado y holográfico. Aplicación profesional con prensa térmica de alta temperatura."),
    ("🔥", "Sublimación Textil", "Servicio de sublimación para poleras, polerones y prendas en poliéster. La sublimación permite diseños a todo color que se integran permanentemente en la tela, sin alterar la textura ni la transpirabilidad. Ideal para uniformes deportivos, poleras promocionales, regalos corporativos y diseños fotográficos. Los colores no se desvanecen con el lavado. Trabajamos con telas de alta calidad importadas. Resultados profesionales de larga duración."),
    ("🚚", "Envíos a Nivel Nacional", "Realizamos envíos a nivel nacional a todas las regiones de Chile, desde Arica hasta Magallanes. Despachamos el mismo día de confirmado el pago vía Starken, Chilexpress, BlueExpress o el courier de tu preferencia. Incluye seguimiento de envío para que sepas dónde está tu pedido en todo momento. Cobertura completa del país con entregas rápidas y seguras. Coordinación inmediata al confirmar tu compra."),
    ("🏠", "Domicilios y Arreglos en Sitio", "Servicio de domicilios y arreglos en sitio para clientes en Santiago. Nos desplazamos a tu ubicación para tomar medidas, mostrar muestras de telas y colores, y coordinar el diseño de tu polerón o polera personalizada. También realizamos arreglos y modificaciones en el lugar cuando es posible. Ideal para empresas, equipos deportivos, grupos grandes y eventos. Cobertura en toda la Región Metropolitana con atención profesional."),
    ("🧢", "Estampados en Gorras y Yoker", "Estampados personalizados en gorras, yoker y accesorios. Personalizamos gorras con tu logo, nombre o diseño utilizando técnicas de DTF, vinilo y sublimación. Trabajamos con diferentes modelos: gorras planas, curvas, trucker, snapback, new era y más. Ideales para regalos promocionales, uniformes de empresa, eventos deportivos, equipos y merchandising. Calidad premium y acabados profesionales. Las gorras personalizadas son el complemento perfecto para tu equipo."),
    ("👜", "Estampados en Bolsos y Accesorios", "Personalización de bolsos, mochilas, tote bags y accesorios con estampados DTF, vinilo y sublimación. Los bolsos personalizados son perfectos para regalos corporativos, eventos, ferias y merchandising. Trabajamos con diferentes materiales: tela, lona, poliéster y más. Diseños a todo color, resistentes al lavado y de alta durabilidad. Haz que tu marca destaque con accesorios únicos y personalizados que tus clientes usarán a diario."),
    ("👕", "Poleras y Polerones Personalizados", "Poleras y polerones personalizados para damas y caballeros con la mejor calidad de Santiago. Utilizamos técnicas de DTF, vinilo y sublimación para crear diseños únicos. Trabajamos con diferentes tipos de telas: algodón premium, dry-fit, poliéster y mezclas. Tallas desde XS hasta XXL. Ideales para uso personal, regalos, empresas, eventos deportivos, grupos y cualquier ocasión. Tu diseño, tu regla. Máxima durabilidad y comodidad garantizada."),
    ("🎉", "Decoración de Fiestas", "Servicio completo de decoración de fiestas y eventos en Santiago. Transformamos cualquier espacio con decoraciones temáticas personalizadas: cumpleaños, bautizos, matrimonios, graduaciones y eventos corporativos. Incluye globos, centros de mesa, fondos fotográficos, banner personalizado, mesas de dulces y más. Coordinamos contigo cada detalle para que tu evento sea único e inolvidable. Atención personalizada y presupuestos a tu medida. Hacemos realidad la fiesta de tus sueños."),
    ("👶", "Baby Shower", "Organización y decoración de baby shower personalizado en Santiago. Creamos ambientes mágicos para celebrar la llegada de tu bebé con decoraciones temáticas, centros de mesa, banners personalizados, mesa de dulces y souvenirs. Trabajamos con diferentes temáticas: clásico, moderno, norteño, animalitos y más. Incluye polerones personalizados para la mamá y los invitados. Haremos de tu baby shower un momento inolvidable. Coordinación completa del evento."),
    ("🥐", "Desayunos Sorpresas", "Desayunos sorpresas personalizados en Santiago. Sorprende a esa persona especial con un desayuno único que incluye polera o polerón con mensaje personalizado, desayuno completo, decoración y entrega a domicilio. Perfecto para cumpleaños, aniversarios, día de la madre, día del padre, San Valentín y cualquier ocasión especial. Coordinamos la entrega a la hora que nos indiques para que la sorpresa sea perfecta. Incluye waffles, frutas, jugos y más."),
    ("🍭", "Arriendo de Candy Bar", "Arriendo de candy bar completo para fiestas y eventos en Santiago. Mesa de dulces profesional con variedad de golosinas, chocolates, cupcakes, cake pops y más. Incluye decoración temática, contenedores, etiquetas personalizadas y servicio de montaje. El candy bar es el centro de atracción de cualquier evento. Ideal para cumpleaños, matrimonios, bautizos, eventos corporativos y celebraciones. Personalizamos según tu temática y colores. Servicio completo llave en mano."),
    ("✂️", "Arreglos y Modificaciones Textiles", "Servicio de arreglos y modificaciones textiles en Santiago. Realizamos ajustes, parches, refuerzos y reparaciones en polerones, poleras, chaquetas y prendas en general. Si tu polerón favorito necesita un arreglo o quieres transformar una prenda, nosotros te ayudamos. También aplicamos parches personalizados, cierres, broches y modificaciones de diseño. Servicio rápido y profesional con garantía de calidad en cada trabajo. Tu prenda como nueva."),
    ("👕", "Polerones para Empresas", "Polerones personalizados para empresas, equipos de trabajo y eventos corporativos en Santiago. Estampamos tu logo empresarial con técnicas DTF, vinilo y sublimación. Ideales para uniformes, regalos corporativos, eventos de team building, ferias, cajas navideñas y promociones. Trabajamos con diferentes calidades de polerones: algodón premium, poliéster, canguro, con capucha y más. Precios especiales por volumen. Cotiza con nosotros y lleva la imagen de tu empresa al siguiente nivel."),
    ("⚽", "Poleras Deportivas Personalizadas", "Poleras deportivas personalizadas para equipos, clubes y grupos en Santiago. Utilizamos técnicas de sublimación y DTF para crear diseños únicos con números, nombres, logos y patrones a todo color. Trabajamos con telas técnicas transpirables de alta calidad: dry-fit, poliéster y mezclas. Ideales para fútbol, básquet, vóley, running, ciclismo y cualquier disciplina. Tallas para adultos y niños. Tu equipo con identidad propia y profesional."),
    ("🎁", "Regalos Personalizados", "Regalos personalizados únicos para toda ocasión en Santiago. Creamos poleras, polerones y prendas personalizadas que son el regalo perfecto para cumpleaños, aniversarios, día de la madre, día del padre, San Valentín, graduaciones, Navidad y más. Diseñamos contigo cada detalle: mensaje, foto, fecha, nombre o cualquier elemento que haga especial tu regalo. Entrega rápida y empaquetado especial disponible. Sorprende a quien amas con un regalo único e irrepetible."),
    ("🏆", "Polerones para Eventos y Grupos", "Polerones personalizados para eventos, grupos, peñas y reuniones en Santiago. Ya sea para un evento deportivo, musical, familiar o empresarial, creamos polerones únicos que identifican a tu grupo. Diseños a todo color con DTF y sublimación, diferentes tallas y colores. Ideales para peñas, festivales, conciertos, viajes grupales, despedidas de soltero/a y eventos masivos. Precios especiales por cantidad. Tu evento con identidad y recuerdo para siempre."),
    ("🖨️", "Estampados de Camisetas", "Estampados de camisetas personalizadas con técnicas DTF, vinilo y sublimación. Personalizamos camisetas con tu diseño, logo, foto o texto. Ideales para eventos, regalos, empresas, grupos deportivos y uso personal. Trabajamos con camisetas de alta calidad en algodón y mezclas. Diseños a todo color, resistentes al lavado y de alta durabilidad. Tu camiseta única con acabado profesional. Mínimos de pedido accesibles para grupos pequeños."),
    ("🎈", "Arreglo de Fiestas Infantiles", "Arreglo de fiestas infantiles completo en Santiago. Incluye decoración temática con personajes infantiles, globos, centros de mesa, mesa de dulces, banner personalizado y souvenirs. Trabajamos con todas las temáticas: princesas, superhéroes, animalitos, payasos y más. También personalizamos polerones para el cumpleañero y los invitados. Hacemos que la fiesta de tu hijo sea mágica e inolvidable. Coordinación completa del evento con atención a cada detalle."),
    ("💝", "Regalos Empresariales", "Regalos empresariales personalizados para empresas en Santiago. Creemos souvenirs corporativos únicos: polerones con logo, gorras personalizadas, bolsos de marca, tote bags y más. Ideales para cajas navideñas, eventos corporativos, ferias, promociones y regalos a clientes. Trabajamos con productos de alta calidad y acabados premium. Precios especiales por volumen. Haz que tu marca destaque con regalos que tus clientes y colaboradores usarán con orgullo."),
    ("📦", "Regalos a Domicilio", "Servicio de regalos a domicilio en Santiago y envíos a nivel nacional. Sorprende a esa persona especial con un regalo personalizado entregado directamente en su puerta. Incluye polerón personalizado, empaquetado especial y tarjeta de mensaje. Perfecto para cumpleaños, aniversarios, San Valentín, día de la madre y cualquier ocasión especial. Coordinamos la entrega a la hora que nos indiques. También envíos sorpresa a domicilio a todas las regiones de Chile."),
]

# Generar servicios.html
cards = ""
for icon, title, desc in SERVICIOS:
    cards += f'<div class="service-card"><div class="service-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>\n'

content = f"""
<div class="breadcrumb"><a href="index.html">Inicio</a> > Servicios</div>
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">📍 Santiago de Chile · Envíos Nacionales</div>
    <h1>Nuestros <span>Servicios</span></h1>
    <p>Conoce todos los servicios que ofrecemos en polerones personalizados, estampados textiles, decoración de fiestas y más.</p>
  </div>
</section>
<section class="section section-white">
  <div class="section-inner">
    <h2>Todos los <span>Servicios</span></h2>
    <p>Especialistas en estampados de polerones, poleras, gorras, bolsos y mucho más. Envíos a nivel nacional, domicilios, arreglos en sitio, decoración de fiestas, baby shower, desayunos sorpresas y candy bar.</p>
    <div class="services-grid">
      {cards}
    </div>
  </div>
</section>
<section class="cta">
  <h2>¿Necesitas alguno de estos servicios?</h2>
  <p>Cotiza por WhatsApp. Atención inmediata, envíos a nivel nacional, diseños únicos.</p>
  <a href="https://wa.me/56991502163?text=Hola,%20quisiera%20cotizar%20un%20servicio" target="_blank" class="btn-white">💬 Cotizar por WhatsApp</a>
</section>
"""
(BASE / "servicios.html").write_text(
    page(content, "Servicios | Polerones Personalizados Santiago",
         "Todos nuestros servicios: estampados DTF, vinilo, sublimación, polerones personalizados, gorras, bolsos, decoración de fiestas, candy bar, desayunos sorpresa y más en Santiago.",
         asset_path="", servicios_active="active"),
    encoding="utf-8"
)
print(f"✓ servicios.html ({len(SERVICIOS)} servicios)")

# === ACTUALIZAR index.html con enlace a servicios ===
idx = (BASE / "index.html").read_text(encoding="utf-8")
# Agregar enlace a servicios en el nav
idx = idx.replace(
    '<a href="index.html" class="active">Inicio</a>\n      <a href="comunas.html">Comunas</a>',
    '<a href="index.html" class="active">Inicio</a>\n      <a href="comunas.html">Comunas</a>\n      <a href="servicios.html">Servicios</a>'
)
# Agregar enlace en mobile nav
idx = idx.replace(
    '<a href="comunas.html">Comunas</a>\n    <a href="quienes-somos.html">',
    '<a href="comunas.html">Comunas</a>\n    <a href="servicios.html">Servicios</a>\n    <a href="quienes-somos.html">'
)
# Agregar enlace en footer
idx = idx.replace(
    '<a href="comunas.html">Comunas</a>\n      <a href="quienes-somos.html">',
    '<a href="comunas.html">Comunas</a>\n      <a href="servicios.html">Servicios</a>\n      <a href="quienes-somos.html">'
)
(BASE / "index.html").write_text(idx, encoding="utf-8")
print("✓ index.html actualizado con enlace a Servicios")

# === DEFINICIONES SEO ADICIONALES (basadas en keywords) ===
DEFS = [
    ("Poleras Personalizadas Santiago", "Las poleras personalizadas en Santiago son prendas únicas diseñadas con estampados DTF, vinilo textil y sublimación. Ofrecemos poleras de alta calidad para hombre y mujer con diseños personalizados que reflejan tu estilo, empresa o evento. Trabajamos con las mejores telas y técnicas de estampado de vanguardia. Envíos a nivel nacional."),
    ("Estampados de Poleras", "Los estampados de poleras son la personalización de camisetas y poleras mediante técnicas como DTF, vinilo textil y sublimación. Permiten crear diseños únicos con logos, textos, fotografías y arte personalizado. En Santiago ofrecemos estampados de máxima calidad, resistentes al lavado y de alta durabilidad. Ideales para regalos, empresas, eventos y uso personal."),
    ("Gorras Personalizadas", "Las gorras personalizadas son accesorios únicos estampados con tu logo, nombre o diseño. Utilizamos técnicas de DTF, vinilo y sublimación para crear gorras a tu medida. Ideales para regalos promocionales, uniformes de empresa, eventos deportivos, equipos y merchandising. Trabajamos con diferentes modelos: planas, curvas, trucker, snapback, new era y más."),
    ("Regalos Originales Personalizados", "Los regalos originales personalizados son prendas y accesorios únicos creados especialmente para esa persona especial. Polerones, poleras, gorras y bolsos con diseños personalizados que hacen que tu regalo sea irrepetible. Perfecto para cumpleaños, aniversarios, día de la madre, día del padre, San Valentín, Navidad y cualquier ocasión especial. Sorprende con algo único."),
    ("Decoración de Fiestas Infantiles", "La decoración de fiestas infantiles incluye transformación completa del espacio con temáticas de personajes, globos, centros de mesa, mesa de dulces y banner personalizado. Trabajamos con todas las temáticas: princesas, superhéroes, animalitos y más. También personalizamos polerones para el cumpleañero y los invitados. Servicio completo para hacer mágica la fiesta de tu hijo."),
    ("Desayunos Sorpresa a Domicilio", "Los desayunos sorpresa a domicilio incluyen entrega directa en la puerta de esa persona especial. Incluye polera o polerón personalizado con mensaje, desayuno completo con waffles, frutas y jugos, decoración temática y tarjeta. Perfecto para cumpleaños, aniversarios, día de la madre, San Valentín. Coordinamos la entrega a la hora exacta. También envíos a nivel nacional."),
]

defs_html = ""
for title, desc in DEFS:
    defs_html += f'<div class="def-card"><h3>{title}</h3><p>{desc}</p></div>\n'

content = f"""
<div class="breadcrumb"><a href="index.html">Inicio</a> > Información SEO</div>
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">GUÍA COMPLETA</div>
    <h1>Guía de <span>Estampados y Personalización</span></h1>
    <p>Conoce todo sobre polerones personalizados, estampados textiles, técnicas de impresión y servicios que ofrecemos en Santiago de Chile.</p>
  </div>
</section>
<section class="section section-white">
  <div class="section-inner" style="max-width:800px">
    <h2>Definiciones <span>SEO</span></h2>
    <p>Información detallada sobre cada servicio y técnica de personalización textil.</p>
    {defs_html}
  </div>
</section>
<section class="cta">
  <h2>¿Listo para tu polerón personalizado?</h2>
  <p>Cotiza por WhatsApp. Atención inmediata, envíos a nivel nacional.</p>
  <a href="https://wa.me/56991502163" target="_blank" class="btn-white">💬 Cotizar por WhatsApp</a>
</section>
"""
(BASE / "informacion.html").write_text(
    page(content, "Información SEO | Polerones Personalizados Santiago",
         "Guía completa sobre polerones personalizados, estampados DTF, vinilo, sublimación, gorras, regalos y más en Santiago de Chile.",
         asset_path=""),
    encoding="utf-8"
)
print(f"✓ informacion.html ({len(DEFS)} definiciones)")

print(f"\n✅ Páginas creadas/actualizadas: servicios.html + informacion.html + index.html")
