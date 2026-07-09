#!/usr/bin/env python3
"""
Actualiza la página de dudas con muchas más preguntas y respuestas
relacionadas con todos los servicios. También actualiza el FAQ de la index.
"""
from pathlib import Path
import re

BASE = Path("/home/z/my-project/polerones")

# Todas las preguntas y respuestas (20 nuevas + las 10 existentes = 30 total)
ALL_FAQS = [
    # === ORIGINALES (10) ===
    ("¿Hacen polerones personalizados en Santiago de Chile?", "Sí, hacemos polerones y poleras personalizadas en Santiago de Chile. Estamos ubicados en Lo Prado, Milton Rossel 7196. Realizamos envíos a nivel nacional a todas las regiones de Chile. Cotiza por WhatsApp +56 9 9150 2163."),
    ("¿Qué técnicas de estampado utilizan?", "Utilizamos tres técnicas principales: DTF textil (Direct to Film) para diseños a todo color, vinilo textil para colores sólidos y logos, y sublimación para telas de poliéster. Cada técnica tiene sus ventajas según el diseño y la tela. Te asesoramos para elegir la mejor opción."),
    ("¿Hacen envíos a nivel nacional?", "Sí, hacemos envíos a nivel nacional a todas las regiones de Chile, desde Arica hasta Magallanes. Despachamos vía Starken, Chilexpress, BlueExpress o el courier de tu preferencia. El despacho se realiza el mismo día de confirmado el pago. Incluye seguimiento de envío."),
    ("¿Cuánto demora un polerón personalizado?", "El tiempo de elaboración depende de la técnica de estampado y la cantidad. Generalmente entre 2 y 5 días hábiles para pedidos individuales. Para pedidos grandes (empresas, eventos) coordinamos un plazo según el volumen. Los envíos adicionan 1-3 días hábiles según la región."),
    ("¿Puedo llevar mi propio diseño?", "¡Por supuesto! Puedes llevar tu propio diseño en formato digital (PNG, JPG, PDF, AI). También podemos diseñar contigo si tienes una idea pero no el archivo final. Trabajamos con todo tipo de diseños: logos, fotos, textos, ilustraciones y más."),
    ("¿Qué tipo de prendas personalizan?", "Personalizamos poleras, polerones, chaquetas, gorras, yoker, bolsos, mochilas, tote bags y más. Trabajamos con diferentes materiales: algodón, poliéster, mezclas y telas técnicas. También realizamos arreglos y modificaciones textiles."),
    ("¿Hacen domicilios en Santiago?", "Sí, realizamos domicilios y arreglos en sitio para clientes en Santiago. Nos desplazamos a tu ubicación para tomar medidas, mostrar muestras y coordinar diseños. Ideal para empresas, equipos deportivos y grupos grandes. Cobertura en toda la Región Metropolitana."),
    ("¿Ofrecen servicios de decoración de fiestas?", "Sí, ofrecemos decoración de fiestas, baby shower, desayunos sorpresas y arriendo de candy bar. Transformamos cualquier espacio con decoraciones temáticas personalizadas. También podemos incluir polerones personalizados para el evento."),
    ("¿Cuáles son las formas de pago?", "Aceptamos transferencia bancaria, efectivo y Mercado Pago. Para pedidos grandes solicitamos un adelanto del 50% y el resto al momento de la entrega. Para envíos nacionales, el pago debe ser 100% anticipado. Emitimos boleta o factura según corresponda."),
    ("¿Cómo cotizo mi polerón personalizado?", "Cotizar es muy fácil: escríbenos por WhatsApp al +56 9 9150 2163 con la siguiente información: tipo de prenda, cantidad, técnica de estampado preferida (DTF, vinilo o sublimación), diseño o idea, y fecha necesaria. Te responderemos con un presupuesto personalizado en minutos."),

    # === NUEVAS: DTF (4) ===
    ("¿Qué es el estampado DTF y cuánto dura?", "El estampado DTF (Direct to Film) es una técnica que imprime tu diseño sobre una película especial que luego se transfiere a la tela con calor. Ofrece colores vibrantes a todo color, es lavable y de alta durabilidad. Con los cuidados adecuados (lavar al revés, agua fría, no usar lejía), un estampado DTF puede durar más de 50 lavados sin desvanecerse. Es ideal para fotografías, gradientes y diseños complejos."),
    ("¿El estampado DTF se puede lavar en lavadora?", "Sí, los estampados DTF son completamente lavables en lavadora. Recomendamos lavar la prenda al revés, con agua fría o tibia, usar ciclo suave y no usar lejía ni cloro. Para secar, preferiblemente al aire libre. Evitar planchar directamente sobre el estampado. Con estos cuidados, el diseño se mantendrá intacto por mucho tiempo."),
    ("¿Qué diferencia hay entre DTF, vinilo y sublimación?", "DTF: permite diseños a todo color con fotografías y gradientes, funciona en cualquier tela. Vinilo: ideal para colores sólidos, textos y logos, ofrece colores más vibrantes y opacos. Sublimación: solo funciona en poliéster, el diseño se integra en la tela permanentemente sin tocar la textura. Te asesoramos según tu diseño y tela para elegir la mejor técnica."),
    ("¿Puedo estampar una fotografía en mi polerón?", "Sí, con la técnica DTF podemos estampar fotografías a todo color con alta resolución. La calidad de la foto original influye en el resultado final, por lo que recomendamos enviar imágenes de alta calidad (mínimo 300 DPI). También podemos aplicar filtros, ajustar colores y mejorar la imagen antes de estampar."),

    # === NUEVAS: Sublimación (3) ===
    ("¿Qué telas funcionan con la sublimación?", "La sublimación funciona exclusivamente en telas con alto contenido de poliéster (mínimo 65%). Las telas 100% poliéster ofrecen los mejores resultados con colores más vibrantes. No funciona en algodón puro. Si tienes una prenda de algodón, te recomendamos DTF o vinilo en su lugar. Trabajamos con telas de alta calidad importadas para sublimación."),
    ("¿La sublimación se desvanece con el lavado?", "No, la sublimación es la técnica más duradera porque la tinta se integra permanentemente en las fibras de la tela. No se desvanece, no se agrieta ni se pela con el lavado. Los colores se mantienen vibrantes incluso después de cientos de lavados. Es la técnica ideal para uniformes deportivos y prendas de uso frecuente."),
    ("¿Pueden sublimar tazas y polerones?", "Sí, sublimamos tanto textiles (poleras, polerones en poliéster) como productos rígidos como tazas, mouse pads, llaveros, plaquetas y más. La sublimación en tazas ofrece diseños permanentes a todo color que no se borran con el lavado. Es ideal para regalos personalizados, souvenirs empresariales y merchandising.Consulta por otros productos sublimables."),

    # === NUEVAS: Candy Bar (3) ===
    ("¿Qué incluye el arriendo de candy bar?", "Nuestro arriendo de candy bar incluye: mesa profesional, variedad de golosinas (chocolates, gomitas, caramelos), cupcakes, cake pops, etiquetas personalizadas, contenedores decorativos, servilletas y servicio completo de montaje y desmontaje. Personalizamos la decoración según la temática y colores de tu evento. Todo listo para que solo disfrutes tu celebración."),
    ("¿Cuánto cuesta el arriendo de candy bar?", "El costo del candy bar depende de la cantidad de invitados, el tipo de dulces y el nivel de personalización. Ofrecemos paquetes desde opciones básicas hasta premium. Te entregamos un presupuesto personalizado según tus necesidades. El servicio incluye montaje, desmontaje y decoración. Cotiza por WhatsApp +56 9 9150 2163 para recibir tu presupuesto a medida."),
    ("¿El candy bar incluye servicio de montaje?", "Sí, el arriendo de candy bar incluye servicio completo de montaje y desmontaje. Llegamos al lugar del evento con anticipación, instalamos la mesa, decoramos según tu temática y retiramos todo al finalizar. No tienes que preocuparte por nada. Servicio profesional garantizado en Santiago y regiones cercanas."),

    # === NUEVAS: Desayunos sorpresa (3) ===
    ("¿Qué incluyen los desayunos sorpresa?", "Nuestros desayunos sorpresa incluyen: polera o polerón personalizado con mensaje, desayuno completo (waffles, frutas, jugos, café, pan artesanal, miel), decoración temática, tarjeta de mensaje personalizada y entrega a domicilio. Perfecto para cumpleaños, aniversarios, San Valentín, día de la madre y cualquier ocasión especial. Coordinamos la entrega a la hora exacta que nos indiques."),
    ("¿Hacen desayunos sorpresa a domicilio en Santiago?", "Sí, hacemos desayunos sorpresa a domicilio en toda la Región Metropolitana. Coordinamos contigo la fecha, hora y dirección exacta de entrega. La persona recibirá su desayuno sorpresa con polerón personalizado directamente en su puerta. También enviamos desayunos sorpresa a otras regiones de Chile vía courier. Reserva con al menos 2 días de anticipación."),
    ("¿Puedo personalizar el desayuno sorpresa?", "¡Por supuesto! Puedes personalizar todo: el mensaje del polerón, los alimentos del desayuno (waffles, frutas, pan, jugos), la decoración temática, la tarjeta de mensaje y hasta la música si lo deseas. Trabajamos contigo para crear una experiencia única y memorable. También puedes agregar extras como chocolates, flores o globos."),

    # === NUEVAS: Tiempos de entrega (3) ===
    ("¿Cuál es el tiempo de entrega de un pedido?", "Los tiempos de entrega varían según el tipo de servicio: Polerones individualmente: 2-5 días hábiles. Pedidos grandes (20+ unidades): 5-10 días hábiles. Estampados DTF individuales: 1-3 días hábiles. Sublimación: 3-5 días hábiles. Candy bar: coordinar con 1 semana de anticipación. Desayunos sorpresa: reservar con 2 días de anticipación. Envíos nacionales adicionan 1-3 días hábiles al plazo."),
    ("¿Hacen entregas urgentes o exprés?", "Sí, ofrecemos servicio exprés para casos urgentes con un recargo adicional. Para estampados individuales podemos entregar en 24-48 horas. Para pedidos grandes depende de la complejidad. Contáctanos por WhatsApp +56 9 9150 2163 para coordinar una entrega urgente. Las entregas exprés en Santiago pueden ser el mismo día en zonas cercanas."),
    ("¿Puedo recoger mi pedido en persona?", "Sí, puedes recoger tu pedido en nuestro local ubicado en Lo Prado, Milton Rossel 7196, Santiago de Chile. Coordinamos contigo el día y horario de retiro (Lun a Sáb de 9:00 AM a 6:00 PM). También ofrecemos entregas a domicilio en Santiago y envíos a nivel nacional. Elige la opción que más te convenga al momento de confirmar tu pedido."),

    # === NUEVAS: Envíos (3) ===
    ("¿A qué regiones de Chile hacen envíos?", "Hacemos envíos a TODAS las regiones de Chile: Arica y Parinacota, Tarapacá, Antofagasta, Atacama, Coquimbo, Valparaíso, Metropolitana, O'Higgins, Maule, Ñuble, Bío Bío, La Araucanía, Los Ríos, Los Lagos, Aysén y Magallanes. No importas dónde estés, te llegará tu pedido. Despachamos vía Starken, Chilexpress, BlueExpress o el courier de tu preferencia."),
    ("¿Cuánto cuesta el envío a regiones?", "El costo de envío depende de la región de destino, el peso del paquete y el courier elegido. Generalmente los envíos dentro de la Región Metropolitana cuestan entre $2.000 y $4.000 CLP. Envíos a regiones entre $3.000 y $8.000 CLP según la zona. Te cotizamos el envío exacto al confirmar tu pedido. El pago del envío puede ser contra entrega o pagado por adelantado."),
    ("¿El envío tiene seguimiento?", "Sí, todos nuestros envíos incluyen número de seguimiento. Al despachar tu pedido te enviamos por WhatsApp el código de seguimiento para que puedas rastrear tu paquete en todo momento. Trabajamos con couriers confiables como Starken, Chilexpress y BlueExpress que ofrecen seguimiento online en tiempo real. Tu pedido siempre está protegido y rastreable."),

    # === NUEVAS: Tazas y productos adicionales (2) ===
    ("¿Hacen estampados en tazas personalizadas?", "Sí, hacemos tazas personalizadas mediante sublimación. Las tazas sublimadas tienen diseños permanentes a todo color que no se borran con el lavado. Ideales para regalos corporativos, souvenirs, cumpleaños, día de la madre, día del padre y merchandising. Trabajamos con tazas de cerámica de alta calidad en blanco (11 oz). Mínimo de pedido: 1 unidad. También mugs mágicos que cambian de color con el calor."),
    ("¿Qué otros productos además de polerones personalizan?", "Además de polerones y poleras, personalizamos: gorras, yoker, bolsos, mochilas, tote bags, tazas, mouse pads, llaveros, plaquetas, cojines y mucho más. Si tienes un producto que quieres personalizar, consúltanos. Trabajamos con DTF, vinilo y sublimación según el material. También hacemos arreglos textiles, parches personalizados y modificaciones de prendas existentes."),
]


# === ACTUALIZAR PÁGINA DE DUDAS ===
print("=== Actualizando dudas.html ===")
p = BASE / "dudas.html"
text = p.read_text(encoding="utf-8")

# Generar HTML de todas las FAQ
faq_html = ""
for i, (q, a) in enumerate(ALL_FAQS):
    faq_html += f'    <details class="faq-item"><summary>{q}</summary><p>{a}</p></details>\n'

# Reemplazar las FAQ existentes
# Buscar desde el primer <details hasta el último </details>
text = re.sub(
    r'<details class="faq-item">.*?</details>\s*(?=<div|</div>|</section>)',
    faq_html,
    text,
    count=0,
    flags=re.DOTALL
)

p.write_text(text, encoding="utf-8")
print(f"  ✓ dudas.html actualizada con {len(ALL_FAQS)} preguntas y respuestas")


# === ACTUALIZAR FAQ DE LA INDEX ===
print("\n=== Actualizando FAQ en index.html ===")
p = BASE / "index.html"
text = p.read_text(encoding="utf-8")

# Las FAQ de la index son las primeras 10 (las más importantes)
INDEX_FAQS = ALL_FAQS[:10]
faq_html = ""
for i, (q, a) in enumerate(INDEX_FAQS):
    faq_html += f'    <details class="faq-item"><summary>{q}</summary><p>{a}</p></details>\n'

# Reemplazar las FAQ existentes en la index
text = re.sub(
    r'<details class="faq-item">.*?</details>\s*(?=<div|</section>)',
    faq_html,
    text,
    count=0,
    flags=re.DOTALL
)

# Actualizar el enlace a la página de dudas completas
if "preguntas y respuestas completas" in text:
    pass  # ya existe
else:
    # Agregar enlace antes del botón de WhatsApp en el FAQ
    text = text.replace(
        '¿Tienes más dudas? Visita nuestra página de',
        '¿Tienes más dudas? Visita nuestra página de <a href="dudas.html" style="color:var(--green-dark);font-weight:600">preguntas y respuestas completas</a> con 30 preguntas'
    )

p.write_text(text, encoding="utf-8")
print(f"  ✓ index.html actualizada con {len(INDEX_FAQS)} FAQ en la home")

print(f"\n✅ Total preguntas: {len(ALL_FAQS)} en dudas.html + {len(INDEX_FAQS)} en index.html")
