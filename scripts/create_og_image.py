#!/usr/bin/env python3
"""
Crea la imagen OG (1200x630) para compartir en WhatsApp/Facebook/Twitter.
Usa el icono de cámara subido por el usuario + texto SEO.
Genera un PNG (no SVG) porque WhatsApp no soporta SVG.
"""
from PIL import Image, ImageDraw, ImageFont
import io
from pathlib import Path

INPUT_ICON = Path("/home/z/my-project/upload/pasted_image_1783111782671.png")
OUTPUT = Path("/home/z/my-project/public/og-image.png")

# Crear canvas 1200x630
W, H = 1200, 630

# Crear fondo con degradado verde claro
img = Image.new("RGB", (W, H), (232, 245, 233))  # #E8F5E9

# Agregar degradado sutil
for y in range(H):
    alpha = int(255 * (y / H) * 0.15)
    img.paste((255, 255, 255), (0, y, W, y + 1))

# Dibujar círculos decorativos
draw = ImageDraw.Draw(img, "RGBA")

# Círculo verde grande esquina superior derecha
for r in range(200, 0, -10):
    alpha = max(0, 40 - r // 5)
    draw.ellipse([W - 200 - r, 80 - r // 2, W - 200 + r, 80 + r // 2],
                 fill=(76, 175, 80, alpha))

# Círculo verde esquina inferior derecha
for r in range(250, 0, -10):
    alpha = max(0, 30 - r // 8)
    draw.ellipse([W - 100 - r, H - 100 - r, W - 100 + r, H - 100 + r],
                 fill=(46, 125, 50, alpha))

# === LADO IZQUIERDO: TEXTO ===

# Banner verde superior
banner_y = 80
draw.rounded_rectangle([80, banner_y, 480, banner_y + 36], radius=18,
                        fill=(76, 175, 80))

# Texto del banner
try:
    font_banner = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
except:
    font_banner = ImageFont.load_default()

banner_text = "INSTALACIÓN A NIVEL NACIONAL"
bbox = draw.textbbox((0, 0), banner_text, font=font_banner)
text_w = bbox[2] - bbox[0]
draw.text((80 + (400 - text_w) / 2, banner_y + 8), banner_text,
          fill="white", font=font_banner)

# Título principal
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 44)
    font_title2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 44)
    font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
    font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_wa = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_wa_num = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
except:
    font_title = ImageFont.load_default()
    font_title2 = font_title
    font_subtitle = font_title
    font_body = font_title
    font_small = font_title
    font_wa = font_title
    font_wa_num = font_title

# "Instalación de"
draw.text((80, 140), "Instalación de", fill=(27, 94, 32), font=font_title)
# "Cámaras de Seguridad"
draw.text((80, 195), "Cámaras de Seguridad", fill=(46, 125, 50), font=font_title2)
# "a Nivel Nacional"
draw.text((80, 250), "a Nivel Nacional", fill=(107, 112, 128), font=font_subtitle)

# Línea decorativa
draw.rounded_rectangle([80, 305, 460, 311], radius=3, fill=(76, 175, 80))

# Subtítulo
draw.text((80, 335), "Cámaras de seguridad CCTV, WiFi y", fill=(55, 65, 81), font=font_body)
draw.text((80, 365), "videovigilancia. Accesorios para PC", fill=(55, 65, 81), font=font_body)
draw.text((80, 395), "y celulares.", fill=(55, 65, 81), font=font_body)

# Caja de WhatsApp
wa_y = 440
draw.rounded_rectangle([80, wa_y, 400, wa_y + 50], radius=12,
                        fill=(255, 255, 255), outline=(165, 214, 167), width=2)

# Círculo verde WhatsApp
draw.ellipse([95, wa_y + 10, 125, wa_y + 40], fill=(37, 211, 102))
draw.text((103, wa_y + 14), "W", fill="white", font=font_wa_num)

# Texto WhatsApp
draw.text((140, wa_y + 10), "Cotiza por WhatsApp", fill=(107, 112, 128), font=font_small)
draw.text((140, wa_y + 28), "+58 416-9726126", fill=(27, 94, 32), font=font_wa_num)

# Ubicación
draw.text((80, 510), "Barinas, Venezuela · Instalaciones y envíos a todo el país",
          fill=(107, 112, 128), font=font_small)

# === LADO DERECHO: ICONO DE CÁMARA ===

# Cargar el icono subido
icon = Image.open(INPUT_ICON).convert("RGBA")

# Redimensionar el icono a 400x400 (manteniendo aspect ratio)
icon_size = 400
icon_ratio = icon.width / icon.height
if icon_ratio > 1:
    new_w = icon_size
    new_h = int(icon_size / icon_ratio)
else:
    new_h = icon_size
    new_w = int(icon_size * icon_ratio)

icon_resized = icon.resize((new_w, new_h), Image.LANCZOS)

# Posicionar el icono centrado en el lado derecho
icon_x = 740 + (400 - new_w) // 2
icon_y = 115 + (400 - new_h) // 2

# Pegar el icono
img.paste(icon_resized, (icon_x, icon_y), icon_resized)

# Guardar como PNG
img.save(OUTPUT, "PNG", optimize=True)
print(f"✓ OG Image guardada en: {OUTPUT}")
print(f"  Tamaño: {img.size}")
print(f"  Archivo: {OUTPUT.stat().st_size} bytes")
