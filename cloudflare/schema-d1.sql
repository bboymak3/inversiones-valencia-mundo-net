-- ============================================================
-- Inversiones Valencia Mundo Net
-- Esquema de base de datos para Cloudflare D1
-- D1 ID: 38dd85ba-03dc-4937-af19-4d1c41a18f27
-- IMPORTANTE: Todas las tablas usan el prefijo `ivmn_` para
-- evitar conflictos con tablas ya existentes en el D1.
-- ============================================================

-- --------------------------------------------------------
-- Tabla: ivmn_categories
-- Categorías de productos (Cámaras, Accesorios PC, Celulares, etc.)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ivmn_categories_slug ON ivmn_categories(slug);
CREATE INDEX IF NOT EXISTS idx_ivmn_categories_active ON ivmn_categories(is_active);

-- --------------------------------------------------------
-- Tabla: ivmn_products
-- Productos del catálogo (cámaras de seguridad y accesorios)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_products (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  long_description TEXT,
  price REAL,
  compare_at_price REAL,
  currency TEXT DEFAULT 'USD',
  stock INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  brand TEXT,
  model TEXT,
  image_url TEXT,
  image_r2_key TEXT,
  gallery TEXT,           -- JSON array de URLs de imágenes
  specs TEXT,             -- JSON array de especificaciones {label, value}
  tags TEXT,              -- JSON array de etiquetas
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES ivmn_categories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ivmn_products_slug ON ivmn_products(slug);
CREATE INDEX IF NOT EXISTS ivmn_products_category ON ivmn_products(category_id);
CREATE INDEX IF NOT EXISTS ivmn_products_featured ON ivmn_products(is_featured);
CREATE INDEX IF NOT EXISTS ivmn_products_active ON ivmn_products(is_active);
CREATE INDEX IF NOT EXISTS ivmn_products_brand ON ivmn_products(brand);

-- --------------------------------------------------------
-- Tabla: ivmn_services
-- Servicios que ofrece la empresa (instalación, soporte, etc.)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  long_description TEXT,
  icon TEXT,
  image_url TEXT,
  image_r2_key TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS ivmn_services_slug ON ivmn_services(slug);
CREATE INDEX IF NOT EXISTS ivmn_services_active ON ivmn_services(is_active);

-- --------------------------------------------------------
-- Tabla: ivmn_quotes
-- Cotizaciones recibidas vía WhatsApp o formulario
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_quotes (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  product_id TEXT,
  product_name TEXT,
  quantity INTEGER DEFAULT 1,
  message TEXT,
  status TEXT DEFAULT 'pending',  -- pending, contacted, quoted, closed
  source TEXT DEFAULT 'web',       -- web, whatsapp, phone
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES ivmn_products(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS ivmn_quotes_status ON ivmn_quotes(status);
CREATE INDEX IF NOT EXISTS ivmn_quotes_created ON ivmn_quotes(created_at);

-- --------------------------------------------------------
-- Tabla: ivmn_contact_messages
-- Mensajes del formulario de contacto
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'unread',  -- unread, read, replied, archived
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS ivmn_contact_messages_status ON ivmn_contact_messages(status);
CREATE INDEX IF NOT EXISTS ivmn_contact_messages_created ON ivmn_contact_messages(created_at);

-- --------------------------------------------------------
-- Tabla: ivmn_settings
-- Configuración global del sitio (logo, colores, contacto, etc.)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- --------------------------------------------------------
-- Tabla: ivmn_testimonials
-- Testimonios de clientes satisfechos
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_testimonials (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_role TEXT,
  customer_avatar TEXT,
  rating INTEGER DEFAULT 5,
  message TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS ivmn_testimonials_active ON ivmn_testimonials(is_active);

-- --------------------------------------------------------
-- Tabla: ivmn_orders
-- Pedidos generados desde la tienda (con checkout por WhatsApp)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT,
  customer_city TEXT,
  items TEXT NOT NULL,          -- JSON array de {product_id, name, price, quantity}
  subtotal REAL DEFAULT 0,
  total REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  payment_method TEXT DEFAULT 'whatsapp',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS ivmn_orders_number ON ivmn_orders(order_number);
CREATE INDEX IF NOT EXISTS ivmn_orders_status ON ivmn_orders(status);
CREATE INDEX IF NOT EXISTS ivmn_orders_created ON ivmn_orders(created_at);

-- ============================================================
-- DATOS INICIALES (Seed)
-- ============================================================

-- Categorías principales
INSERT INTO ivmn_categories (id, name, slug, description, icon, sort_order) VALUES
('cat-camaras', 'Cámaras de Seguridad', 'camaras-de-seguridad', 'Sistemas de videovigilancia IP, analógicas, DVR/NVR y kits completos para hogar, comercio e industria.', 'camera', 1),
('cat-kits-cctv', 'Kits de Cámaras CCTV', 'kits-cctv', 'Paquetes completos listos para instalar con DVR/NVR, cámaras, disco y cables incluidos.', 'package', 2),
('cat-dvr-nvr', 'DVR y NVR', 'dvr-nvr', 'Grabadores digitales y de red para gestionar tus cámaras de seguridad con acceso remoto.', 'hard-drive', 3),
('cat-discos-cctv', 'Discos Duros para CCTV', 'discos-cctv', 'Discos de vigilancia diseñados para grabación 24/7 con alta confiabilidad.', 'database', 4),
('cat-accesorios-pc', 'Accesorios para PC', 'accesorios-pc', 'Mouse, teclados, auriculares, cables, adaptadores y más para tu computadora.', 'monitor', 5),
('cat-celulares', 'Accesorios para Celulares', 'accesorios-celulares', 'Cargadores, cables, fundas, vidrios templados y power banks para tu móvil.', 'smartphone', 6),
('cat-redes', 'Redes y Conectividad', 'redes-conectividad', 'Routers, switches, cables UTP y todo para tu infraestructura de red.', 'wifi', 7),
('cat-servicios', 'Servicios de Instalación', 'servicios-instalacion', 'Instalación profesional de cámaras de seguridad, configuración de redes y soporte técnico.', 'wrench', 8);

-- Configuración inicial del sitio
INSERT INTO ivmn_settings (key, value, description) VALUES
('site_name', 'Inversiones Valencia Mundo Net', 'Nombre del negocio'),
('site_tagline', 'Especialistas en Cámaras de Seguridad y Tecnología', 'Eslogan'),
('whatsapp_number', '+584169726126', 'Número de WhatsApp para contacto'),
('whatsapp_display', '+58 416-9726126', 'Número para mostrar'),
('phone_primary', '+58 416-9726126', 'Teléfono principal'),
('email_contact', 'ventas@inversionesvalencia.net', 'Email de contacto'),
('city', 'Valencia', 'Ciudad'),
('state', 'Carabobo', 'Estado'),
('country', 'Venezuela', 'País'),
('address', 'Valencia, Estado Carabobo, Venezuela', 'Dirección'),
('business_hours', 'Lun a Sáb: 8:00 AM - 6:00 PM', 'Horario de atención'),
('primary_color', '#4CAF50', 'Color primario (verde claro)'),
('accent_color', '#2E7D32', 'Color de acento (verde oscuro)'),
('neutral_color', '#6B7280', 'Color neutro (gris)'),
('background_color', '#FFFFFF', 'Color de fondo (blanco)'),
('facebook_url', '', 'URL de Facebook'),
('instagram_url', '', 'URL de Instagram'),
('twitter_url', '', 'URL de Twitter'),
('meta_description', 'Inversiones Valencia Mundo Net: venta e instalación de cámaras de seguridad, accesorios para computadoras y celulares en Valencia, Venezuela. Cotiza por WhatsApp.', 'Meta descripción del sitio'),
('meta_keywords', 'cámaras de seguridad, CCTV, videovigilancia, DVR, NVR, accesorios para PC, accesorios para celular, instalación de cámaras, Valencia, Venezuela', 'Palabras clave SEO');

-- --------------------------------------------------------
-- Tabla ADICIONAL: ivmn_product_overrides
-- Guarda los cambios que el admin hace a productos del catálogo base
-- El catálogo base está en src/data/catalog.ts (580 productos)
-- Esta tabla guarda solo los campos modificados por SKU
-- Al cargar productos, se hace merge del catálogo base + overrides
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_product_overrides (
  sku TEXT PRIMARY KEY,
  name TEXT,
  category_id TEXT,
  price REAL,
  compare_at_price REAL,
  stock INTEGER,
  is_featured INTEGER,
  brand TEXT,
  short_description TEXT,
  long_description TEXT,
  image_emoji TEXT,
  image_color TEXT,
  image_r2_key TEXT,
  tags TEXT,                  -- JSON array
  is_deleted INTEGER DEFAULT 0,  -- 1 = producto eliminado por el admin
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ivmn_overrides_sku ON ivmn_product_overrides(sku);
CREATE INDEX IF NOT EXISTS idx_ivmn_overrides_category ON ivmn_product_overrides(category_id);

-- --------------------------------------------------------
-- Tabla: ivmn_custom_products
-- Productos creados desde cero por el admin (no están en el catálogo base)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS ivmn_custom_products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  price REAL NOT NULL,
  compare_at_price REAL,
  currency TEXT DEFAULT 'USD',
  stock INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  brand TEXT,
  model TEXT,
  short_description TEXT,
  long_description TEXT,
  image_emoji TEXT DEFAULT '📦',
  image_color TEXT DEFAULT '#4CAF50',
  image_r2_key TEXT,
  specs TEXT,                 -- JSON array
  tags TEXT,                  -- JSON array
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  slug TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ivmn_custom_sku ON ivmn_custom_products(sku);
CREATE INDEX IF NOT EXISTS idx_ivmn_custom_category ON ivmn_custom_products(category_id);
CREATE INDEX IF NOT EXISTS idx_ivmn_custom_active ON ivmn_custom_products(is_active);
