#!/usr/bin/env python3
"""
Genera todas las páginas del sitio polerones:
- comunas.html (listado)
- comunas/[comuna].html (una por comuna - 20 comunas)
- quienes-somos.html
- contacto.html
- dudas.html
- politica-privacidad.html
"""
from pathlib import Path
import re

BASE = Path("/home/z/my-project/polerones")

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
      <a href="{asset_path}index.html">Estampado DTF</a>
      <a href="{asset_path}index.html">Vinilo Textil</a>
      <a href="{asset_path}index.html">Sublimación</a>
      <a href="{asset_path}index.html">Decoración de Fiestas</a>
      <a href="{asset_path}index.html">Candy Bar</a>
    </div>
    <div>
      <h3>Navegación</h3>
      <a href="{asset_path}index.html">Inicio</a>
      <a href="{asset_path}comunas.html">Comunas</a>
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


def page(content, title, desc, asset_path=""):
    h = HEADER.format(title=title, desc=desc, asset_path=asset_path)
    f = FOOTER.format(asset_path=asset_path)
    return h + content + f


# === COMUNAS LISTING PAGE ===
comunas_cards = ""
for slug, name, region in COMUNAS:
    comunas_cards += f'<a href="comunas/{slug}.html" class="comuna-card"><h3>{name}</h3><p>{region}</p></a>\n'

content = f"""
<div class="breadcrumb"><a href="index.html">Inicio</a> > Comunas</div>
<section class="section section-white">
  <div class="section-inner">
    <h2>Comunas que <span>Cubrimos</span></h2>
    <p>Realizamos envíos y servicios de polerones personalizados en las siguientes comunas de Chile.</p>
    <div class="comunas-grid">
      {comunas_cards}
    </div>
  </div>
</section>
<section class="cta">
  <h2>¿No ves tu comuna en la lista?</h2>
  <p>Hacemos envíos a nivel nacional. Contáctanos y coordinamos la entrega.</p>
  <a href="https://wa.me/56991502163" target="_blank" class="btn-white">💬 Consultar por WhatsApp</a>
</section>
"""
(BASE / "comunas.html").write_text(
    page(content, "Comunas que Cubrimos | Polerones Personalizados Santiago",
         "Listado de comunas donde realizamos envíos de polerones personalizados en Santiago y toda Chile.",
         asset_path=""),
    encoding="utf-8"
)
print("✓ comunas.html")

# === INDIVIDUAL COMUNA PAGES ===
for slug, name, region in COMUNAS:
    content = f"""
    <div class="breadcrumb"><a href="../index.html">Inicio</a> > <a href="../comunas.html">Comunas</a> > {name}</div>
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">📍 {region}, Chile</div>
        <h1>Polerones Personalizados en <span>{name}</span></h1>
        <p>Polerones y poleras personalizadas con estampados DTF, vinilo textil y sublimación en {name}, {region}. Realizamos envíos a esta comuna con entrega rápida y segura. Cotiza por WhatsApp +56 9 9150 2163.</p>
        <div class="hero-cta">
          <a href="https://wa.me/56991502163?text=Hola,%20quisiera%20polerones%20personalizados%20en%20{name}" target="_blank" class="btn-primary">💬 Cotizar por WhatsApp</a>
        </div>
      </div>
    </section>
    <section class="section section-white">
      <div class="section-inner" style="max-width:800px">
        <h2>Servicios en <span>{name}</span></h2>
        <p>En {name} ofrecemos todos nuestros servicios de personalización textil:</p>
        <div class="services-grid">
          <div class="service-card"><div class="service-icon">👕</div><h3>Estampado DTF</h3><p>Diseños a todo color con máxima durabilidad para poleras y polerones en {name}.</p></div>
          <div class="service-card"><div class="service-icon">🎨</div><h3>Vinilo Textil</h3><p>Logos, textos y colores sólidos con vinilo de alta calidad en {name}.</p></div>
          <div class="service-card"><div class="service-icon">🔥</div><h3>Sublimación</h3><p>Diseños permanentes en poliéster, ideales para uniformes deportivos en {name}.</p></div>
          <div class="service-card"><div class="service-icon">🚚</div><h3>Envíos</h3><p>Entrega rápida en {name} con seguimiento incluido. Despacho mismo día.</p></div>
          <div class="service-card"><div class="service-icon">🎉</div><h3>Decoración</h3><p>Decoración de fiestas, baby shower y candy bar en {name}.</p></div>
          <div class="service-card"><div class="service-icon">✂️</div><h3>Arreglos</h3><p>Arreglos y modificaciones textiles en {name}. Servicio profesional.</p></div>
        </div>
      </div>
    </section>
    <section class="cta">
      <h2>¿Necesitas polerones personalizados en {name}?</h2>
      <p>Cotiza por WhatsApp. Envíos rápidos a {name}, {region}.</p>
      <a href="https://wa.me/56991502163?text=Hola,%20quisiera%20polerones%20personalizados%20en%20{name}" target="_blank" class="btn-white">💬 Cotizar por WhatsApp</a>
    </section>
    """
    (BASE / "comunas" / f"{slug}.html").write_text(
        page(content, f"Polerones Personalizados en {name} | Estampados {region}",
             f"Polerones y poleras personalizadas en {name}, {region}. Estampados DTF, vinilo y sublimación. Envíos a {name}. WhatsApp +56 9 9150 2163.",
             asset_path="../"),
        encoding="utf-8"
    )
print(f"✓ {len(COMUNAS)} páginas de comunas individuales")

# === QUIENES SOMOS ===
content = """
<div class="breadcrumb"><a href="index.html">Inicio</a> > Quiénes Somos</div>
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">📍 Santiago de Chile</div>
    <h1>Quiénes <span>Somos</span></h1>
    <p>Conoce más sobre Polerones Personalizados Santiago, tu tienda de confianza en estampados textiles.</p>
  </div>
</section>
<section class="section section-white">
  <div class="section-inner" style="max-width:800px">
    <h2>Nuestra <span>Historia</span></h2>
    <p style="text-align:left;color:var(--gray-text);line-height:1.8;font-size:1rem">
      Somos una tienda especializada en polerones y poleras personalizadas ubicada en Santiago de Chile, específicamente en Lo Prado, Milton Rossel 7196. Nuestra pasión es crear prendas únicas que reflejen la personalidad y estilo de cada cliente.<br><br>
      Contamos con años de experiencia en el rubro textil, utilizando las mejores técnicas de estampado: DTF textil, vinilo textil y sublimación. Trabajamos con materiales de alta calidad para garantizar la durabilidad y el mejor acabado en cada prenda.<br><br>
      Además de estampados, ofrecemos servicios de decoración de fiestas, baby shower, desayunos sorpresas, arriendo de candy bar y arreglos textiles. Nuestro compromiso es brindar un servicio completo y personalizado para cada ocasión.<br><br>
      Realizamos envíos a nivel nacional a todas las regiones de Chile, desde Arica hasta Magallanes. También ofrecemos entregas personales en puntos estratégicos de Santiago para mayor rapidez y seguridad.<br><br>
      ¡Vístete con exclusividad! Tu diseño, tu regla. 🇨🇱
    </p>
  </div>
</section>
<section class="cta">
  <h2>¿Quieres conocernos?</h2>
  <p>Visítanos en Lo Prado, Milton Rossel 7196 o contáctanos por WhatsApp.</p>
  <a href="https://wa.me/56991502163" target="_blank" class="btn-white">💬 Contactar</a>
</section>
"""
(BASE / "quienes-somos.html").write_text(
    page(content, "Quiénes Somos | Polerones Personalizados Santiago",
         "Conoce Polerones Personalizados Santiago, tienda especializada en estampados DTF, vinilo y sublimación en Santiago de Chile."),
    encoding="utf-8"
)
print("✓ quienes-somos.html")

# === CONTACTO ===
content = """
<div class="breadcrumb"><a href="index.html">Inicio</a> > Contacto</div>
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">📍 Santiago de Chile</div>
    <h1><span>Contacto</span></h1>
    <p>Contáctanos para cotizar tus polerones y poleras personalizadas.</p>
  </div>
</section>
<section class="section section-white">
  <div class="section-inner" style="max-width:600px;text-align:center">
    <h2>Información de <span>Contacto</span></h2>
    <div style="display:grid;gap:1rem;margin-top:2rem">
      <div class="service-card" style="text-align:center">
        <div class="service-icon" style="margin:0 auto 1rem">💬</div>
        <h3>WhatsApp</h3>
        <p style="font-size:1.25rem;font-weight:700;color:var(--green-dark)">+56 9 9150 2163</p>
        <a href="https://wa.me/56991502163" target="_blank" class="btn-primary" style="margin-top:1rem">💬 Escribir ahora</a>
      </div>
      <div class="service-card" style="text-align:center">
        <div class="service-icon" style="margin:0 auto 1rem">📍</div>
        <h3>Ubicación</h3>
        <p style="font-size:1rem">Lo Prado, Milton Rossel 7196<br>Santiago de Chile</p>
      </div>
      <div class="service-card" style="text-align:center">
        <div class="service-icon" style="margin:0 auto 1rem">🕒</div>
        <h3>Horario</h3>
        <p style="font-size:1rem">Lunes a Sábado<br>9:00 AM - 6:00 PM</p>
      </div>
    </div>
  </div>
</section>
"""
(BASE / "contacto.html").write_text(
    page(content, "Contacto | Polerones Personalizados Santiago",
         "Contacta con Polerones Personalizados Santiago. WhatsApp +56 9 9150 2163. Lo Prado, Milton Rossel 7196."),
    encoding="utf-8"
)
print("✓ contacto.html")

# === DUDAS ===
faqs = [
    ("¿Hacen polerones personalizados en Santiago?", "Sí, hacemos polerones y poleras personalizadas en Santiago de Chile. Estamos ubicados en Lo Prado, Milton Rossel 7196. Realizamos envíos a nivel nacional. Cotiza por WhatsApp +56 9 9150 2163."),
    ("¿Qué técnicas de estampado utilizan?", "Utilizamos DTF textil para diseños a todo color, vinilo textil para colores sólidos y logos, y sublimación para telas de poliéster. Te asesoramos para elegir la mejor opción según tu diseño y tela."),
    ("¿Hacen envíos a nivel nacional?", "Sí, enviamos a todas las regiones de Chile, desde Arica hasta Magallanes. Despachamos vía Starken, Chilexpress o BlueExpress el mismo día de confirmado el pago."),
    ("¿Cuánto demora un polerón personalizado?", "Generalmente entre 2 y 5 días hábiles para pedidos individuales. Para pedidos grandes coordinamos un plazo según el volumen. Los envíos adicionan 1-3 días hábiles."),
    ("¿Puedo llevar mi propio diseño?", "¡Sí! Puedes llevar tu diseño en formato digital (PNG, JPG, PDF, AI). También podemos diseñar contigo si tienes una idea. Trabajamos con logos, fotos, textos e ilustraciones."),
    ("¿Qué prendas personalizan?", "Personalizamos poleras, polerones, chaquetas, gorras, yoker, bolsos, mochilas y tote bags. También hacemos arreglos y modificaciones textiles."),
    ("¿Hacen domicilios en Santiago?", "Sí, realizamos domicilios y arreglos en sitio para clientes en Santiago. Cobertura en toda la Región Metropolitana. Coordina tu visita por WhatsApp."),
    ("¿Ofrecen decoración de fiestas?", "Sí, ofrecemos decoración de fiestas, baby shower, desayunos sorpresas y arriendo de candy bar. Incluye decoración temática personalizada para tu evento."),
    ("¿Cuáles son las formas de pago?", "Aceptamos transferencia bancaria, efectivo y Mercado Pago. Para pedidos grandes: 50% adelanto y resto al momento de entrega. Envíos nacionales: 100% anticipado."),
    ("¿Cómo cotizo mi polerón personalizado?", "Escríbenos por WhatsApp al +56 9 9150 2163 indicando: tipo de prenda, cantidad, técnica de estampado, diseño y fecha. Te responderemos con un presupuesto en minutos."),
]

faq_html = ""
for i, (q, a) in enumerate(faqs):
    faq_html += f'<details class="faq-item"><summary>{q}</summary><p>{a}</p></details>\n'

content = f"""
<div class="breadcrumb"><a href="index.html">Inicio</a> > Dudas</div>
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">PREGUNTAS FRECUENTES</div>
    <h1>Dudas, <span>Preguntas y Respuestas</span></h1>
    <p>Resolvemos las dudas más comunes sobre polerones personalizados, estampados y envíos.</p>
  </div>
</section>
<section class="section section-white">
  <div class="section-inner" style="max-width:800px">
    {faq_html}
    <div style="text-align:center;margin-top:2rem;padding:1.5rem;background:var(--green-bg);border-radius:1rem">
      <h3 style="margin-bottom:0.5rem">¿Tienes más dudas?</h3>
      <p style="margin-bottom:1rem">Escríbenos por WhatsApp y te asesoramos sin compromiso.</p>
      <a href="https://wa.me/56991502163" target="_blank" class="btn-primary">💬 Consultar por WhatsApp</a>
    </div>
  </div>
</section>
"""
(BASE / "dudas.html").write_text(
    page(content, "Dudas y Preguntas Frecuentes | Polerones Personalizados Santiago",
         "Preguntas frecuentes sobre polerones personalizados, estampados DTF, vinilo, sublimación y envíos en Chile."),
    encoding="utf-8"
)
print("✓ dudas.html")

# === POLITICA DE PRIVACIDAD ===
content = """
<div class="breadcrumb"><a href="index.html">Inicio</a> > Política de Privacidad</div>
<section class="hero">
  <div class="hero-inner">
    <h1>Política de <span>Privacidad</span></h1>
    <p>Política de privacidad de Polerones Personalizados Santiago.</p>
  </div>
</section>
<section class="section section-white">
  <div class="section-inner" style="max-width:800px">
    <div class="def-card">
      <h3>1. Información que Recopilamos</h3>
      <p>Recopilamos información que nos proporcionas directamente cuando te comunicas con nosotros por WhatsApp, correo electrónico o formulario de contacto. Esto incluye tu nombre, número de teléfono, dirección de envío y detalles de tu pedido de polerones personalizados.</p>
    </div>
    <div class="def-card">
      <h3>2. Uso de la Información</h3>
      <p>Utilizamos tu información exclusivamente para procesar tus pedidos, coordinar envíos, responder consultas y brindar soporte. No compartimos ni vendemos tu información a terceros.</p>
    </div>
    <div class="def-card">
      <h3>3. WhatsApp</h3>
      <p>Al contactarnos por WhatsApp, aceptas que utilicemos esta plataforma para comunicarnos contigo respecto a tus pedidos y consultas. Las conversaciones se almacenan en WhatsApp conforme a sus propios términos de servicio.</p>
    </div>
    <div class="def-card">
      <h3>4. Pagos</h3>
      <p>Los pagos se realizan mediante transferencia bancaria, efectivo o Mercado Pago. No almacenamos datos de tarjetas de crédito ni información financiera sensible en nuestros servidores.</p>
    </div>
    <div class="def-card">
      <h3>5. Cookies</h3>
      <p>Este sitio web no utiliza cookies de seguimiento ni publicidad. Es un sitio informativo estático sin analíticas ni herramientas de tracking de terceros.</p>
    </div>
    <div class="def-card">
      <h3>6. Tus Derechos</h3>
      <p>Tienes derecho a solicitar acceso, corrección o eliminación de tu información personal en cualquier momento. Para ejercer estos derechos, contáctanos por WhatsApp al +56 9 9150 2163.</p>
    </div>
    <div class="def-card">
      <h3>7. Contacto</h3>
      <p>Para cualquier consulta sobre esta política de privacidad, contáctanos en Lo Prado, Milton Rossel 7196, Santiago de Chile, o por WhatsApp al +56 9 9150 2163.</p>
    </div>
  </div>
</section>
"""
(BASE / "politica-privacidad.html").write_text(
    page(content, "Política de Privacidad | Polerones Personalizados Santiago",
         "Política de privacidad de Polerones Personalizados Santiago."),
    encoding="utf-8"
)
print("✓ politica-privacidad.html")

print(f"\n✅ Total páginas creadas: {2 + len(COMUNAS) + 4} (comunas.html + index + 20 comunas + quienes-somos + contacto + dudas + politica)")
