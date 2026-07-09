#!/usr/bin/env python3
"""
Elimina todas las referencias a reparaciones/arreglos textiles del sitio.
- Elimina el servicio "Arreglos y Modificaciones Textiles" completo
- Elimina el servicio "Arreglo de Fiestas Infantiles" si menciona arreglos textiles
- Modifica "Domicilios y Arreglos en Sitio" → solo "Domicilios"
- Elimina FAQs sobre arreglos textiles
- Limpia cualquier mención de arreglos/reparaciones textiles
"""
from pathlib import Path
import re

BASE = Path("/home/z/my-project/polerones")

def clean_file(filepath):
    text = filepath.read_text(encoding="utf-8")
    original = text
    changed = False
    
    # 1. Elimtar el servicio completo de "Arreglos y Modificaciones Textiles"
    # Buscar el div.service-card que contiene "Arreglos y Modificaciones Textiles"
    text = re.sub(
        r'\s*<div class="service-card">\s*<div class="service-icon">✂️</div>\s*<h3>Arreglos y Modificaciones Textiles</h3>\s*<p>.*?</p>\s*</div>',
        '',
        text,
        flags=re.DOTALL
    )
    
    # También buscar con números o variaciones
    text = re.sub(
        r'\s*<div class="service-card">.*?<h3>Arreglos y Modificaciones Textiles</h3>.*?</div>',
        '',
        text,
        flags=re.DOTALL
    )
    
    # 2. Modificar "Domicilios y Arreglos en Sitio" → "Domicilios en Sitio"
    text = text.replace("Domicilios y Arreglos en Sitio", "Domicilios en Sitio")
    
    # Limpiar descripción del servicio de domicilios (quitar menciones de arreglos)
    text = re.sub(
        r'(También realizamos arreglos y modificaciones en el lugar cuando es posible\.\s*)',
        '',
        text
    )
    text = re.sub(
        r'(También realizamos arreglos y modificaciones.*?posible\.\s*)',
        '',
        text,
        flags=re.DOTALL
    )
    
    # 3. Eliminar FAQ sobre arreglos textiles
    # Buscar y eliminar <details> que contengan "arreglos" o "reparaciones" textiles
    text = re.sub(
        r'\s*<details class="faq-item"><summary>[^<]*(?:arreglos|reparaciones|modificaciones)[^<]*textiles[^<]*</summary><p>.*?</p></details>',
        '',
        text,
        flags=re.DOTALL | re.IGNORECASE
    )
    
    # 4. Eliminar definiciones SEO sobre arreglos
    text = re.sub(
        r'\s*<div class="def-card"><h3>[^<]*(?:Arreglos|Reparaciones|Modificaciones)[^<]*Textiles?</h3><p>.*?</p></div>',
        '',
        text,
        flags=re.DOTALL | re.IGNORECASE
    )
    
    # 5. Eliminar el servicio de "Arreglo de Fiestas Infantiles" si menciona arreglos textiles
    # En realidad "Arreglo de Fiestas Infantiles" es sobre fiestas, no textiles. Lo dejamos.
    
    # 6. Limpiar menciones generales de "arreglos textiles" en textos
    text = text.replace("Arreglos y Modificaciones Textiles", "")
    text = text.replace("arreglos y modificaciones textiles", "")
    text = text.replace("Arreglos Textiles", "")
    text = text.replace("arreglos textiles", "")
    text = text.replace("reparaciones textiles", "")
    text = text.replace("Reparaciones Textiles", "")
    
    # 7. En servicios.html, eliminar la entrada del listado
    # Buscar entradas con tuple que tengan "Arreglos y Modificaciones"
    
    # 8. Limpiar "arreglos en sitio" en descripciones (mantener "domicilios")
    text = text.replace("domicilios, arreglos en sitio", "domicilios")
    text = text.replace("Domicilios y arreglos en sitio", "Domicilios")
    
    # 9. En el footer, eliminar enlace a arreglos si existe
    
    if text != original:
        filepath.write_text(text, encoding="utf-8")
        changed = True
    
    return changed


# Procesar todas las páginas HTML
count = 0
for p in BASE.rglob("*.html"):
    if clean_file(p):
        count += 1
        print(f"  ✓ {p.relative_to(BASE)}")

print(f"\n✅ {count} páginas limpiadas de referencias a arreglos/reparaciones textiles")
