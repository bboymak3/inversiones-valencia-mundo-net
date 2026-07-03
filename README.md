# Inversiones Valencia Mundo Net — Portal Web

Portal e-shop para **Inversiones Valencia Mundo Net**, negocio venezolano especializado en:

- 🎥 **Venta e instalación de cámaras de seguridad** (CCTV, IP, WiFi) — enfoque principal
- ⌨️ **Accesorios para computadoras** (mouse, teclados, cables, SSD, RAM)
- 📱 **Accesorios para celulares** (cargadores, cables, fundas, vidrios templados)
- 🛠️ **Servicios profesionales**: instalación, mantenimiento, redes y soporte técnico

## Stack tecnológico

- **Framework**: Next.js 16 con App Router + TypeScript
- **Estilos**: Tailwind CSS 4 + shadcn/ui
- **Fuente**: Inter (cuerpo) + Poppins (display)
- **Estado del carrito**: Zustand con persistencia en `localStorage`
- **Iconos**: Lucide React
- **Hosting**: Cloudflare Pages (configuración incluida)
- **Base de datos**: Cloudflare D1 (esquema incluido)
- **Imágenes**: Cloudflare R2 (carpeta dedicada)

## Paleta de colores

| Color            | Hex       | Uso                                  |
|------------------|-----------|--------------------------------------|
| Verde claro      | `#4CAF50` | Color primario (botones, acentos)    |
| Verde oscuro     | `#2E7D32` | Texto destacado, gradientes          |
| Verde muy oscuro | `#1B5E20` | Texto y contrastes                   |
| Blanco           | `#FFFFFF` | Fondo principal                      |
| Gris             | `#6B7280` | Texto secundario, neutros            |

## Estructura del proyecto

```
.
├── cloudflare/
│   ├── schema-d1.sql          # Esquema D1 (tablas prefijadas ivmn_)
│   ├── wrangler.toml          # Configuración Cloudflare
│   └── DEPLOYMENT.md          # Guía de deployment
├── public/
│   ├── logo.svg               # Logo principal
│   ├── favicon.svg            # Favicon
│   ├── og-image.svg           # Open Graph image
│   └── site.webmanifest       # PWA manifest
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Metadata SEO + JSON-LD
│   │   ├── page.tsx           # Página principal
│   │   └── globals.css        # Tailwind + variables de marca
│   ├── components/
│   │   ├── sections/
│   │   │   ├── header.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── services.tsx
│   │   │   ├── promo-banner.tsx
│   │   │   ├── catalog.tsx    # Catálogo con filtros + búsqueda
│   │   │   ├── why-us.tsx
│   │   │   ├── contact.tsx
│   │   │   ├── footer.tsx
│   │   │   └── whatsapp-floating.tsx
│   │   └── shop/
│   │       └── cart-drawer.tsx # Carrito con checkout WhatsApp
│   ├── data/
│   │   └── catalog.ts         # Productos, servicios y helpers WhatsApp
│   └── lib/
│       └── cart-store.ts      # Estado del carrito (Zustand)
```

## WhatsApp

El portal está totalmente integrado con WhatsApp para que cada interacción termine en una conversación de ventas:

- **Botón flotante** inferior derecho (aparece al hacer scroll)
- **Botón "Cotizar"** en cada producto → genera mensaje pre-llenado con datos del producto
- **Carrito con checkout por WhatsApp** → arma el listado completo con subtotales y total
- **Formulario de contacto** → abre WhatsApp con los datos del cliente
- **Cada servicio** tiene su propio botón de cotización

Número configurado: **+58 416-9726126**

## Catálogo de productos

Incluye más de 35 productos organizados en 7 categorías:

1. **Cámaras de Seguridad** (6 productos)
2. **Kits de Cámaras CCTV** (3 productos)
3. **DVR y NVR** (3 productos)
4. **Discos Duros para CCTV** (3 productos)
5. **Accesorios para PC** (8 productos)
6. **Accesorios para Celulares** (7 productos)
7. **Redes y Conectividad** (3 productos)

Para modificar el catálogo, edita `src/data/catalog.ts`.

## Desarrollo local

```bash
bun install
bun run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Deployment a Cloudflare

Ver guía completa en `cloudflare/DEPLOYMENT.md`.

Resumen:

1. Crear repositorio en GitHub (script incluido en `scripts/deploy.sh`)
2. Conectar repo a Cloudflare Pages
3. Ejecutar `wrangler d1 execute` con el esquema SQL
4. Crear bucket R2 para imágenes de productos
5. Configurar variables de entorno en Cloudflare Pages

---

© Inversiones Valencia Mundo Net · Valencia, Carabobo, Venezuela
