// ============================================================
// Catálogo de productos — Inversiones Valencia Mundo Net
// Productos extraídos y organizados del catálogo del negocio.
// Enfoque principal: cámaras de seguridad (CCTV / IP / WiFi)
// Enfoque secundario: accesorios para PC y celulares
// ============================================================

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  categoryId: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stock: number;
  isFeatured: boolean;
  brand: string;
  model: string;
  imageColor: string; // color de fondo para el placeholder
  imageEmoji: string; // emoji para identificar visualmente
  specs: { label: string; value: string }[];
  tags: string[];
  rating: number;
  reviewCount: number;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  features: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "cat-camaras",
    name: "Cámaras de Seguridad",
    slug: "camaras-de-seguridad",
    description:
      "Cámaras IP, WiFi, dome y bala para videovigilancia profesional en hogar, comercio e industria. Acceso remoto desde tu celular 24/7.",
    icon: "camera",
    sortOrder: 1,
  },
  {
    id: "cat-kits-cctv",
    name: "Kits de Cámaras CCTV",
    slug: "kits-cctv",
    description:
      "Paquetes completos listos para instalar con DVR/NVR, cámaras, disco duro y cables incluidos. Instalación profesional disponible.",
    icon: "package",
    sortOrder: 2,
  },
  {
    id: "cat-dvr-nvr",
    name: "DVR y NVR",
    slug: "dvr-nvr",
    description:
      "Grabadores digitales y de red para gestionar tus cámaras de seguridad con acceso remoto desde cualquier dispositivo.",
    icon: "hard-drive",
    sortOrder: 3,
  },
  {
    id: "cat-discos-cctv",
    name: "Discos Duros para CCTV",
    slug: "discos-cctv",
    description:
      "Discos de vigilancia diseñados para grabación 24/7 con alta confiabilidad y resistencia al trabajo continuo.",
    icon: "database",
    sortOrder: 4,
  },
  {
    id: "cat-accesorios-pc",
    name: "Accesorios para PC",
    slug: "accesorios-pc",
    description:
      "Mouse, teclados, auriculares, cables, adaptadores, memorias y todo para potenciar tu computadora.",
    icon: "monitor",
    sortOrder: 5,
  },
  {
    id: "cat-celulares",
    name: "Accesorios para Celulares",
    slug: "accesorios-celulares",
    description:
      "Cargadores, cables USB-C y Lightning, fundas, vidrios templados, audífonos y power banks para tu móvil.",
    icon: "smartphone",
    sortOrder: 6,
  },
  {
    id: "cat-redes",
    name: "Redes y Conectividad",
    slug: "redes-conectividad",
    description:
      "Routers, switches, cables UTP y todo lo necesario para tu infraestructura de red cableada e inalámbrica.",
    icon: "wifi",
    sortOrder: 7,
  },
];

export const SERVICES: Service[] = [
  {
    id: "srv-instalacion-camaras",
    title: "Instalación de Cámaras de Seguridad",
    slug: "instalacion-camaras-seguridad",
    shortDescription:
      "Servicio profesional de instalación de cámaras CCTV, IP y WiFi para hogar, comercio e industria.",
    longDescription:
      "Realizamos instalaciones llave en mano de sistemas de videovigilancia. Incluye asesoría técnica, cableado estructurado, configuración de DVR/NVR, acceso remoto desde tu celular y capacitación. Trabajamos con marcas de alta calidad y ofrecemos garantía escrita sobre la instalación.",
    icon: "camera",
    features: [
      "Visita técnica de evaluación sin compromiso",
      "Cableado estructurado con canaletas PVC",
      "Configuración de acceso remoto 24/7",
      "Garantía escrita sobre la instalación",
      "Soporte técnico post-venta",
    ],
  },
  {
    id: "srv-mantenimiento-cctv",
    title: "Mantenimiento de Sistemas CCTV",
    slug: "mantenimiento-cctv",
    shortDescription:
      "Mantenimiento preventivo y correctivo para sistemas de videovigilancia existentes.",
    longDescription:
      "Diagnóstico, limpieza, reconfiguración y reemplazo de componentes dañados en tus sistemas de cámaras. Aseguramos que tu sistema siga grabando con la máxima calidad y que el acceso remoto funcione sin interrupciones.",
    icon: "wrench",
    features: [
      "Diagnóstico completo del sistema",
      "Limpieza de lentes y domos",
      "Actualización de firmware",
      "Reemplazo de componentes dañados",
      "Optimización de almacenamiento",
    ],
  },
  {
    id: "srv-redes-conectividad",
    title: "Redes y Conectividad",
    slug: "redes-conectividad",
    shortDescription:
      "Instalación y configuración de redes WiFi y cableadas para hogar y oficina.",
    longDescription:
      "Diseñamos e instalamos redes de datos confiables. Desde un router WiFi para tu casa hasta una red completa para tu negocio con switches, access points y cableado UTP certificado.",
    icon: "wifi",
    features: [
      "Cableado UTP certificado Cat5e/Cat6",
      "Configuración de routers y access points",
      "Optimización de cobertura WiFi",
      "Switches administrables",
      "Soporte remoto y presencial",
    ],
  },
  {
    id: "srv-soporte-pc",
    title: "Soporte Técnico de PC",
    slug: "soporte-tecnico-pc",
    shortDescription:
      "Mantenimiento, reparación y upgrades de computadoras de escritorio y laptops.",
    longDescription:
      "Diagnóstico y reparación de PCs y laptops, instalación de software, limpieza de virus, upgrades de memoria RAM y discos SSD, recuperación de datos y más. Servicio rápido y confiable.",
    icon: "monitor",
    features: [
      "Diagnóstico gratuito",
      "Limpieza de virus y malware",
      "Upgrade de RAM y SSD",
      "Instalación de software",
      "Recuperación de datos",
    ],
  },
];

export const PRODUCTS: Product[] = [
  // ============================================================
  // CÁMARAS DE SEGURIDAD — Principal
  // ============================================================
  {
    id: "prod-cam-ip-wifi-1",
    categoryId: "cat-camaras",
    sku: "IVMN-CAM-001",
    name: "Cámara IP WiFi 1080p Visión Nocturna",
    slug: "camara-ip-wifi-1080p-vision-nocturna",
    shortDescription:
      "Cámara IP inalámbrica 1080p con visión nocturna, audio bidireccional y acceso remoto desde tu celular.",
    longDescription:
      "Cámara de seguridad IP WiFi con resolución Full HD 1080p, ideal para monitorear tu hogar o negocio desde cualquier lugar del mundo. Incluye visión nocturna inteligente hasta 10 metros, audio bidireccional para hablar y escuchar, detección de movimiento con notificaciones push y almacenamiento en la nube o microSD hasta 128GB. Compatible con aplicaciones móviles iOS y Android. Fácil instalación, no requiere DVR.",
    price: 35,
    compareAtPrice: 45,
    currency: "USD",
    stock: 24,
    isFeatured: true,
    brand: "Generic",
    model: "IP-WiFi-1080",
    imageColor: "#4CAF50",
    imageEmoji: "📷",
    specs: [
      { label: "Resolución", value: "1920×1080 (Full HD)" },
      { label: "Conectividad", value: "WiFi 2.4 GHz" },
      { label: "Visión nocturna", value: "Hasta 10 metros" },
      { label: "Audio", value: "Bidireccional" },
      { label: "Almacenamiento", value: "MicroSD hasta 128GB" },
      { label: "Aplicación", value: "iOS / Android" },
      { label: "Ángulo de visión", value: "110°" },
      { label: "Detección de movimiento", value: "Sí, con alertas push" },
    ],
    tags: ["wifi", "ip", "full hd", "visión nocturna", "audio"],
    rating: 4.7,
    reviewCount: 38,
  },
  {
    id: "prod-cam-dome-2",
    categoryId: "cat-camaras",
    sku: "IVMN-CAM-002",
    name: "Cámara Dome 5MP HD-TVI",
    slug: "camara-dome-5mp-hd-tvi",
    shortDescription:
      "Cámara tipo domo 5MP para interior/exterior con visión nocturna de alto alcance.",
    longDescription:
      "Cámara de seguridad tipo domo con sensor de 5 megapíxeles, ideal para interiores y exteriores protegidos. Resolución Ultra HD para capturar detalles nítidos como rostros y placas. Carcasa resistente vandalismo IK10, visión nocturna IR hasta 25 metros, y compatible con grabadores DVR HD-TVI de 4/8/16 canales. Excelente relación calidad-precio para comercios.",
    price: 28,
    compareAtPrice: 35,
    currency: "USD",
    stock: 40,
    isFeatured: true,
    brand: "Generic",
    model: "DOME-5MP",
    imageColor: "#2E7D32",
    imageEmoji: "🎥",
    specs: [
      { label: "Resolución", value: "5MP (2592×1944)" },
      { label: "Tipo", value: "Domo" },
      { label: "Tecnología", value: "HD-TVI / CVI / AHD" },
      { label: "Visión nocturna", value: "Hasta 25 metros" },
      { label: "Protección", value: "IP66 / IK10" },
      { label: "Lente", value: "3.6mm fijo" },
      { label: "Alimentación", value: "12V DC" },
    ],
    tags: ["dome", "5mp", "exterior", "hd-tvi"],
    rating: 4.5,
    reviewCount: 22,
  },
  {
    id: "prod-cam-bala-3",
    categoryId: "cat-camaras",
    sku: "IVMN-CAM-003",
    name: "Cámara Bala 4MP IR 30m Exterior",
    slug: "camara-bala-4mp-ir-30m-exterior",
    shortDescription:
      "Cámara bala 4MP de alta resolución para exterior con IR de largo alcance hasta 30 metros.",
    longDescription:
      "Cámara tipo bala de 4 megapíxeles diseñada para exteriores. Carcasa IP67 resistente al polvo y lluvia. Incluye iluminación infrarroja de alta potencia hasta 30 metros de distancia en completa oscuridad. Compatible con DVRs HD-TVI/CVI/AHD. Excelente para perimetrales, estacionamientos, patios y entradas.",
    price: 32,
    currency: "USD",
    stock: 35,
    isFeatured: true,
    brand: "Generic",
    model: "BALA-4MP-30",
    imageColor: "#1B5E20",
    imageEmoji: "📹",
    specs: [
      { label: "Resolución", value: "4MP (2688×1520)" },
      { label: "Tipo", value: "Bala" },
      { label: "Visión nocturna", value: "IR hasta 30m" },
      { label: "Protección", value: "IP67" },
      { label: "Lente", value: "6mm fijo" },
      { label: "Temperatura", value: "-30°C a 60°C" },
      { label: "Alimentación", value: "12V DC" },
    ],
    tags: ["bala", "4mp", "exterior", "largo alcance"],
    rating: 4.6,
    reviewCount: 19,
  },
  {
    id: "prod-cam-ptz-4",
    categoryId: "cat-camaras",
    sku: "IVMN-CAM-004",
    name: "Cámara PTZ 4x Zoom Inteligente",
    slug: "camara-ptz-4x-zoom-inteligente",
    shortDescription:
      "Cámara motorizada PTZ con rotación 360°, zoom óptico y seguimiento automático de movimiento.",
    longDescription:
      "Cámara PTZ (Pan-Tilt-Zoom) motorizada con rotación horizontal de 360° continua y vertical de 90°. Zoom óptico 4x para acercamiento sin pérdida de calidad. Seguimiento automático de objetos en movimiento, ideal para áreas grandes como almacenes, plazas y parkings. Se controla desde el DVR/NVR o la app móvil. Compatible con protocolo ONVIF.",
    price: 95,
    compareAtPrice: 120,
    currency: "USD",
    stock: 12,
    isFeatured: true,
    brand: "Generic",
    model: "PTZ-4X",
    imageColor: "#388E3C",
    imageEmoji: "🎯",
    specs: [
      { label: "Tipo", value: "PTZ motorizada" },
      { label: "Rotación", value: "Pan 360° / Tilt 90°" },
      { label: "Zoom óptico", value: "4x" },
      { label: "Resolución", value: "1080p Full HD" },
      { label: "Seguimiento", value: "Automático de movimiento" },
      { label: "Protocolo", value: "ONVIF / PELCO-D" },
      { label: "Visión nocturna", value: "IR hasta 50m" },
    ],
    tags: ["ptz", "zoom", "motorizada", "seguimiento"],
    rating: 4.8,
    reviewCount: 14,
  },
  {
    id: "prod-cam-wifi-bateria-5",
    categoryId: "cat-camaras",
    sku: "IVMN-CAM-005",
    name: "Cámara WiFi con Batería Recargable",
    slug: "camara-wifi-bateria-recargable",
    shortDescription:
      "Cámara 100% inalámbrica con batería recargable, ideal para lugares sin corriente.",
    longDescription:
      "Cámara de seguridad WiFi 100% inalámbrica con batería recargable de larga duración (hasta 6 meses en modo standby). Detección de movimiento PIR que activa grabación y alertas. Panel solar opcional para carga continua. Resistente al agua IP65. Perfecta para portones, fincas, casas de campo y lugares sin acceso a corriente eléctrica.",
    price: 48,
    currency: "USD",
    stock: 18,
    isFeatured: false,
    brand: "Generic",
    model: "WIFI-BAT",
    imageColor: "#5CB85C",
    imageEmoji: "🔋",
    specs: [
      { label: "Resolución", value: "1080p Full HD" },
      { label: "Conectividad", value: "WiFi 2.4 GHz" },
      { label: "Batería", value: "Recargable 6600mAh" },
      { label: "Autonomía", value: "Hasta 6 meses standby" },
      { label: "Protección", value: "IP65" },
      { label: "Sensor", value: "PIR" },
      { label: "Audio", value: "Bidireccional" },
    ],
    tags: ["wifi", "batería", "inalámbrica", "solar"],
    rating: 4.4,
    reviewCount: 27,
  },
  {
    id: "prod-cam-360-6",
    categoryId: "cat-camaras",
    sku: "IVMN-CAM-006",
    name: "Cámara WiFi 360° Panorámica",
    slug: "camara-wifi-360-panoramica",
    shortDescription:
      "Cámara WiFi con visión 360° y control de rotación desde tu celular.",
    longDescription:
      "Cámara inteligente con visión panorámica 360° y control de orientación desde la app móvil. Incluye visión nocturna, audio bidireccional, alarma sonora y detección de movimiento inteligente con seguimiento automático. Ideal para monitorear espacios amplios desde un solo punto: salas, oficinas, comercios pequeños.",
    price: 42,
    compareAtPrice: 55,
    currency: "USD",
    stock: 22,
    isFeatured: false,
    brand: "Generic",
    model: "WIFI-360",
    imageColor: "#66BB6A",
    imageEmoji: "🌀",
    specs: [
      { label: "Resolución", value: "1080p Full HD" },
      { label: "Visión", value: "360° panorámica" },
      { label: "Rotación", value: "Pan 355° / Tilt 90°" },
      { label: "Visión nocturna", value: "Sí, IR automática" },
      { label: "Audio", value: "Bidireccional + alarma" },
      { label: "Almacenamiento", value: "MicroSD hasta 128GB" },
    ],
    tags: ["360", "wifi", "panorámica", "rotación"],
    rating: 4.5,
    reviewCount: 31,
  },

  // ============================================================
  // KITS DE CÁMARAS CCTV — Llave en mano
  // ============================================================
  {
    id: "prod-kit-4-1",
    categoryId: "cat-kits-cctv",
    sku: "IVMN-KIT-001",
    name: "Kit 4 Cámaras CCTV + DVR + Disco 1TB",
    slug: "kit-4-camaras-cctv-dvr-disco-1tb",
    shortDescription:
      "Kit completo de 4 cámaras 1080p, DVR 4 canales, disco duro 1TB y cables incluidos. Listo para instalar.",
    longDescription:
      "Kit CCTV completo y listo para instalar: incluye 4 cámaras de seguridad 1080p (2 dome + 2 bala), DVR de 4 canales con salida HDMI/VGA, disco duro de vigilancia 1TB para grabación continua de hasta 30 días, fuente de poder, baluns de video y cables BNC + DC de 20 metros por cámara. Acceso remoto desde celular. Servicio de instalación profesional disponible por separado.",
    price: 195,
    compareAtPrice: 240,
    currency: "USD",
    stock: 8,
    isFeatured: true,
    brand: "Generic",
    model: "KIT-4-1TB",
    imageColor: "#2E7D32",
    imageEmoji: "📦",
    specs: [
      { label: "Cantidad de cámaras", value: "4 (2 dome + 2 bala)" },
      { label: "Resolución", value: "1080p Full HD" },
      { label: "DVR", value: "4 canales HD-TVI" },
      { label: "Disco incluido", value: "1TB vigilancia 24/7" },
      { label: "Capacidad de grabación", value: "Hasta 30 días" },
      { label: "Cables incluidos", value: "4× 20m BNC+DC" },
      { label: "Acceso remoto", value: "Sí, iOS/Android/Web" },
    ],
    tags: ["kit", "4 cámaras", "dvr", "1tb", "1080p"],
    rating: 4.8,
    reviewCount: 26,
  },
  {
    id: "prod-kit-8-2",
    categoryId: "cat-kits-cctv",
    sku: "IVMN-KIT-002",
    name: "Kit 8 Cámaras CCTV + DVR + Disco 2TB",
    slug: "kit-8-camaras-cctv-dvr-disco-2tb",
    shortDescription:
      "Kit profesional de 8 cámaras 1080p con DVR 8 canales y disco duro 2TB. Ideal para comercios medianos.",
    longDescription:
      "Kit CCTV profesional para comercios, residencias y oficinas medianas. Incluye 8 cámaras de seguridad 1080p (4 dome + 4 bala), DVR de 8 canales con detección de movimiento, disco duro de vigilancia 2TB para grabación continua de hasta 30 días con 8 cámaras, fuente de poder centralizada, cables BNC+DC de 20 metros por cámara y accesorios de instalación. Acceso remoto desde celular y PC.",
    price: 340,
    compareAtPrice: 410,
    currency: "USD",
    stock: 5,
    isFeatured: true,
    brand: "Generic",
    model: "KIT-8-2TB",
    imageColor: "#1B5E20",
    imageEmoji: "📦",
    specs: [
      { label: "Cantidad de cámaras", value: "8 (4 dome + 4 bala)" },
      { label: "Resolución", value: "1080p Full HD" },
      { label: "DVR", value: "8 canales HD-TVI" },
      { label: "Disco incluido", value: "2TB vigilancia 24/7" },
      { label: "Capacidad de grabación", value: "Hasta 30 días (8 cámaras)" },
      { label: "Detección de movimiento", value: "Sí" },
      { label: "Acceso remoto", value: "iOS/Android/Web" },
    ],
    tags: ["kit", "8 cámaras", "dvr", "2tb", "comercios"],
    rating: 4.9,
    reviewCount: 17,
  },
  {
    id: "prod-kit-wifi-3",
    categoryId: "cat-kits-cctv",
    sku: "IVMN-KIT-003",
    name: "Kit 4 Cámaras WiFi Inalámbricas + NVR",
    slug: "kit-4-camaras-wifi-inalambricas-nvr",
    shortDescription:
      "Kit 100% inalámbrico de 4 cámaras WiFi con NVR y disco de 1TB. Sin cableado de video.",
    longDescription:
      "Kit CCTV 100% inalámbrico con 4 cámaras WiFi de 1080p y NVR con disco duro de 1TB. Las cámaras solo necesitan conexión a la corriente, transmiten video por WiFi al NVR. Ideal para lugares donde el cableado de video es complicado. Acceso remoto desde celular con la app incluida. Detección de movimiento y notificaciones push.",
    price: 280,
    compareAtPrice: 330,
    currency: "USD",
    stock: 6,
    isFeatured: false,
    brand: "Generic",
    model: "KIT-WIFI-4",
    imageColor: "#4CAF50",
    imageEmoji: "📡",
    specs: [
      { label: "Cantidad de cámaras", value: "4 WiFi" },
      { label: "Resolución", value: "1080p Full HD" },
      { label: "NVR", value: "4 canales WiFi" },
      { label: "Disco incluido", value: "1TB" },
      { label: "Cableado de video", value: "No requerido (WiFi)" },
      { label: "Acceso remoto", value: "iOS/Android/Web" },
    ],
    tags: ["kit", "wifi", "inalámbrico", "nvr"],
    rating: 4.6,
    reviewCount: 12,
  },

  // ============================================================
  // DVR Y NVR
  // ============================================================
  {
    id: "prod-dvr-8-1",
    categoryId: "cat-dvr-nvr",
    sku: "IVMN-DVR-001",
    name: "DVR 8 Canales 1080p H.265",
    slug: "dvr-8-canales-1080p-h265",
    shortDescription:
      "Grabador digital de 8 canales con compresión H.265, salida HDMI y acceso remoto.",
    longDescription:
      "DVR de 8 canales con soporte para cámaras HD-TVI/CVI/AHD/CVBS. Compresión H.265 que reduce hasta un 50% el consumo de disco frente a H.264. Salida HDMI y VGA simultánea para monitor. Detección de movimiento por zona, búsqueda inteligente y backup por USB. Acceso remoto vía P2P sin IP fija desde iOS, Android y web.",
    price: 65,
    compareAtPrice: 80,
    currency: "USD",
    stock: 14,
    isFeatured: false,
    brand: "Generic",
    model: "DVR-8CH-H265",
    imageColor: "#388E3C",
    imageEmoji: "💾",
    specs: [
      { label: "Canales", value: "8" },
      { label: "Resolución máxima", value: "1080p" },
      { label: "Compresión", value: "H.265 / H.264" },
      { label: "Salidas", value: "HDMI + VGA" },
      { label: "Audio", value: "4 entradas / 1 salida" },
      { label: "Alarmas", value: "8 entradas / 4 salidas" },
      { label: "Red", value: "Ethernet RJ45" },
      { label: "Acceso remoto", value: "iOS/Android/Web P2P" },
    ],
    tags: ["dvr", "8 canales", "h265", "1080p"],
    rating: 4.6,
    reviewCount: 21,
  },
  {
    id: "prod-dvr-16-2",
    categoryId: "cat-dvr-nvr",
    sku: "IVMN-DVR-002",
    name: "DVR 16 Canales 4K H.265",
    slug: "dvr-16-canales-4k-h265",
    shortDescription:
      "DVR profesional de 16 canales con soporte 4K, ideal para grandes instalaciones.",
    longDescription:
      "DVR de 16 canales profesional con soporte para cámaras 4K y 8MP. Compresión H.265+ para máximo ahorro de espacio. Detección de movimiento, alertas por correo y push, backup por USB y red. Salida HDMI 4K para visualización en monitores de alta resolución. Ideal para proyectos de videovigilancia de gran escala.",
    price: 115,
    currency: "USD",
    stock: 7,
    isFeatured: false,
    brand: "Generic",
    model: "DVR-16CH-4K",
    imageColor: "#1B5E20",
    imageEmoji: "💾",
    specs: [
      { label: "Canales", value: "16" },
      { label: "Resolución máxima", value: "4K / 8MP" },
      { label: "Compresión", value: "H.265+ / H.265 / H.264" },
      { label: "Salidas", value: "HDMI 4K + VGA" },
      { label: "Audio", value: "16 entradas / 1 salida" },
      { label: "Acceso remoto", value: "iOS/Android/Web P2P" },
    ],
    tags: ["dvr", "16 canales", "4k", "profesional"],
    rating: 4.7,
    reviewCount: 9,
  },
  {
    id: "prod-nvr-8-3",
    categoryId: "cat-dvr-nvr",
    sku: "IVMN-NVR-001",
    name: "NVR 8 Canales IP POE",
    slug: "nvr-8-canales-ip-poe",
    shortDescription:
      "Grabador de red IP de 8 canales con puertos POE integrados para cámaras IP.",
    longDescription:
      "NVR de 8 canales IP con 8 puertos POE integrados que alimentan y reciben video de cámaras IP por un solo cable UTP. Soporta cámaras hasta 8MP. Compresión H.265, detección de movimiento inteligente, búsqueda por evento y acceso remoto P2P. Salida HDMI 4K. Compatible con cámaras ONVIF.",
    price: 120,
    compareAtPrice: 145,
    currency: "USD",
    stock: 9,
    isFeatured: false,
    brand: "Generic",
    model: "NVR-8CH-POE",
    imageColor: "#2E7D32",
    imageEmoji: "🖥️",
    specs: [
      { label: "Canales IP", value: "8" },
      { label: "Puertos POE", value: "8 integrados" },
      { label: "Resolución máxima", value: "8MP (4K)" },
      { label: "Compresión", value: "H.265 / H.264" },
      { label: "Compatible", value: "ONVIF" },
      { label: "Salidas", value: "HDMI 4K + VGA" },
      { label: "Acceso remoto", value: "iOS/Android/Web" },
    ],
    tags: ["nvr", "8 canales", "poe", "ip"],
    rating: 4.8,
    reviewCount: 15,
  },

  // ============================================================
  // DISCOS DUROS PARA CCTV
  // ============================================================
  {
    id: "prod-disco-1tb-1",
    categoryId: "cat-discos-cctv",
    sku: "IVMN-HDD-001",
    name: "Disco Duro CCTV 1TB 24/7",
    slug: "disco-duro-cctv-1tb-24-7",
    shortDescription:
      "Disco duro de vigilancia 1TB diseñado para grabación continua 24/7 con alta durabilidad.",
    longDescription:
      "Disco duro de grado vigilancia de 1TB, fabricado para soportar la escritura continua 24/7 requerida por sistemas CCTV. Optimizado para múltiples flujos de video simultáneos. Menor consumo eléctrico y mayor vida útil que un disco de PC estándar. Compatible con DVR/NVR de 4 y 8 canales.",
    price: 38,
    currency: "USD",
    stock: 20,
    isFeatured: false,
    brand: "Generic",
    model: "HDD-CCTV-1TB",
    imageColor: "#5CB85C",
    imageEmoji: "💿",
    specs: [
      { label: "Capacidad", value: "1TB" },
      { label: "Tipo", value: "Vigilancia 24/7" },
      { label: "Interfaz", value: "SATA III" },
      { label: "RPM", value: "5400" },
      { label: "Cache", value: "64MB" },
      { label: "MTBF", value: "1,000,000 horas" },
    ],
    tags: ["disco", "cctv", "1tb", "24/7"],
    rating: 4.6,
    reviewCount: 33,
  },
  {
    id: "prod-disco-2tb-2",
    categoryId: "cat-discos-cctv",
    sku: "IVMN-HDD-002",
    name: "Disco Duro CCTV 2TB 24/7",
    slug: "disco-duro-cctv-2tb-24-7",
    shortDescription:
      "Disco de vigilancia 2TB para grabación continua de hasta 30 días con 8 cámaras.",
    longDescription:
      "Disco de grado vigilancia de 2TB con tecnología de grabación continua 24/7. Diseñado para soportar la carga de trabajo de DVRs y NVRs de 8 y 16 canales. Bajo consumo, operación silenciosa y alta confiabilidad.",
    price: 58,
    compareAtPrice: 70,
    currency: "USD",
    stock: 15,
    isFeatured: false,
    brand: "Generic",
    model: "HDD-CCTV-2TB",
    imageColor: "#4CAF50",
    imageEmoji: "💿",
    specs: [
      { label: "Capacidad", value: "2TB" },
      { label: "Tipo", value: "Vigilancia 24/7" },
      { label: "Interfaz", value: "SATA III" },
      { label: "RPM", value: "5400" },
      { label: "Cache", value: "256MB" },
      { label: "Carga de trabajo", value: "180TB/año" },
    ],
    tags: ["disco", "cctv", "2tb", "24/7"],
    rating: 4.7,
    reviewCount: 19,
  },
  {
    id: "prod-disco-4tb-3",
    categoryId: "cat-discos-cctv",
    sku: "IVMN-HDD-003",
    name: "Disco Duro CCTV 4TB 24/7",
    slug: "disco-duro-cctv-4tb-24-7",
    shortDescription:
      "Disco de vigilancia 4TB para sistemas CCTV profesionales de alta capacidad.",
    longDescription:
      "Disco duro de vigilancia de alta capacidad 4TB, ideal para sistemas con 16 o más cámaras o cuando se requiere almacenamiento extendido de varios meses. Tecnología de grabación continua 24/7, alta tolerancia a temperatura y vibración.",
    price: 95,
    currency: "USD",
    stock: 8,
    isFeatured: false,
    brand: "Generic",
    model: "HDD-CCTV-4TB",
    imageColor: "#2E7D32",
    imageEmoji: "💿",
    specs: [
      { label: "Capacidad", value: "4TB" },
      { label: "Tipo", value: "Vigilancia 24/7" },
      { label: "Interfaz", value: "SATA III" },
      { label: "RPM", value: "7200" },
      { label: "Cache", value: "256MB" },
      { label: "Carga de trabajo", value: "180TB/año" },
    ],
    tags: ["disco", "cctv", "4tb", "profesional"],
    rating: 4.8,
    reviewCount: 11,
  },

  // ============================================================
  // ACCESORIOS PARA PC — Secundario
  // ============================================================
  {
    id: "prod-mouse-1",
    categoryId: "cat-accesorios-pc",
    sku: "IVMN-PC-001",
    name: "Mouse Inalámbrico USB 2.4GHz",
    slug: "mouse-inalambrico-usb-24ghz",
    shortDescription:
      "Mouse inalámbrico ergonómico con receptor USB nano silencioso.",
    longDescription:
      "Mouse inalámbrico 2.4GHz con receptor USB nano que puedes dejar conectado a tu laptop sin estorbar. Diseño ergonómico para diestros, clic silencioso, rueda de scroll con doble modo (libre y entrecortado). Botón DPI ajustable (800/1200/1600). Funciona con 1 pila AA hasta 12 meses.",
    price: 8,
    compareAtPrice: 12,
    currency: "USD",
    stock: 60,
    isFeatured: false,
    brand: "Generic",
    model: "MS-WL-01",
    imageColor: "#5CB85C",
    imageEmoji: "🖱️",
    specs: [
      { label: "Conexión", value: "Inalámbrico 2.4GHz" },
      { label: "Receptor", value: "USB nano" },
      { label: "DPI", value: "800/1200/1600" },
      { label: "Botones", value: "3 + scroll" },
      { label: "Alimentación", value: "1 pila AA" },
      { label: "Autonomía", value: "Hasta 12 meses" },
      { label: "Compatibilidad", value: "Windows/Mac/Linux" },
    ],
    tags: ["mouse", "inalámbrico", "usb", "silencioso"],
    rating: 4.5,
    reviewCount: 47,
  },
  {
    id: "prod-teclado-2",
    categoryId: "cat-accesorios-pc",
    sku: "IVMN-PC-002",
    name: "Teclado USB Español + Mouse Combo",
    slug: "teclado-usb-espanol-mouse-combo",
    shortDescription:
      "Combo teclado + mouse USB con distribución en español, teclas silenciosas.",
    longDescription:
      "Combo económico de teclado y mouse USB. Teclado de tamaño completo con teclas silenciosas, distribución latina en español, resistente a salpicaduras. Mouse óptico de 1000 DPI con cable de 1.5m. Conexión plug & play, sin necesidad de drivers.",
    price: 14,
    compareAtPrice: 19,
    currency: "USD",
    stock: 50,
    isFeatured: true,
    brand: "Generic",
    model: "KB-MS-COMBO",
    imageColor: "#4CAF50",
    imageEmoji: "⌨️",
    specs: [
      { label: "Conexión", value: "USB alámbrico" },
      { label: "Distribución", value: "Español Latino" },
      { label: "Teclado", value: "Tamaño completo + numérico" },
      { label: "Mouse", value: "Óptico 1000 DPI" },
      { label: "Largo del cable", value: "1.5m" },
      { label: "Compatibilidad", value: "Windows/Linux" },
    ],
    tags: ["teclado", "mouse", "combo", "usb"],
    rating: 4.4,
    reviewCount: 38,
  },
  {
    id: "prod-auriculares-3",
    categoryId: "cat-accesorios-pc",
    sku: "IVMN-PC-003",
    name: "Auriculares Gaming con Micrófono",
    slug: "auriculares-gaming-microfono",
    shortDescription:
      "Auriculares over-ear gaming con micrófono desmontable, luces LED y sonido surround.",
    longDescription:
      "Auriculares gaming over-ear con diadema acolchada, drivers de 50mm para graves potentes y agudos nítidos. Micrófono desmontable con cancelación de ruido. Luces LED RGB compatibles con USB. Cable trenzado de 2.1m con control de volumen y mute. Compatible con PC, PS4, PS5, Xbox y Switch.",
    price: 22,
    compareAtPrice: 28,
    currency: "USD",
    stock: 30,
    isFeatured: false,
    brand: "Generic",
    model: "HEAD-GAME",
    imageColor: "#2E7D32",
    imageEmoji: "🎧",
    specs: [
      { label: "Tipo", value: "Over-ear" },
      { label: "Drivers", value: "50mm" },
      { label: "Micrófono", value: "Desmontable con cancelación de ruido" },
      { label: "Conexión", value: "USB + Jack 3.5mm" },
      { label: "Luces", value: "LED RGB" },
      { label: "Cable", value: "2.1m trenzado" },
      { label: "Compatibilidad", value: "PC/PS4/PS5/Xbox/Switch" },
    ],
    tags: ["auriculares", "gaming", "micrófono", "rgb"],
    rating: 4.6,
    reviewCount: 24,
  },
  {
    id: "prod-cable-hdmi-4",
    categoryId: "cat-accesorios-pc",
    sku: "IVMN-PC-004",
    name: "Cable HDMI 4K 1.5 metros",
    slug: "cable-hdmi-4k-15-metros",
    shortDescription:
      "Cable HDMI 2.0 premium con soporte 4K@60Hz, ethernet y retorno de audio.",
    longDescription:
      "Cable HDMI 2.0 de alta velocidad con soporte para resoluciones 4K@60Hz, HDR, 3D y ethernet. Conductores de cobre libre de oxígeno, conector chapado en oro para máxima durabilidad y conducción. Compatible con TVs, monitores, proyectores, consolas y PCs.",
    price: 5,
    currency: "USD",
    stock: 100,
    isFeatured: false,
    brand: "Generic",
    model: "HDMI-15-4K",
    imageColor: "#66BB6A",
    imageEmoji: "🔌",
    specs: [
      { label: "Versión", value: "HDMI 2.0" },
      { label: "Resolución máxima", value: "4K@60Hz" },
      { label: "Longitud", value: "1.5 metros" },
      { label: "Conector", value: "Chapado en oro" },
      { label: "Soporta", value: "HDR, 3D, Ethernet, ARC" },
    ],
    tags: ["hdmi", "4k", "cable", "video"],
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: "prod-ssd-5",
    categoryId: "cat-accesorios-pc",
    sku: "IVMN-PC-005",
    name: "Disco SSD 240GB SATA 2.5\"",
    slug: "disco-ssd-240gb-sata-25",
    shortDescription:
      "Disco SSD SATA III de 240GB, 10x más rápido que un disco mecánico.",
    longDescription:
      "Disco SSD de estado sólido de 240GB formato 2.5\" SATA III. Velocidades de lectura hasta 550MB/s y escritura hasta 450MB/s. Hasta 10x más rápido que un disco duro mecánico tradicional. Bajo consumo, operación silenciosa y resistencia a golpes. Ideal para revivir laptops y PCs antiguas.",
    price: 24,
    compareAtPrice: 30,
    currency: "USD",
    stock: 25,
    isFeatured: true,
    brand: "Generic",
    model: "SSD-240-SATA",
    imageColor: "#388E3C",
    imageEmoji: "⚡",
    specs: [
      { label: "Capacidad", value: "240GB" },
      { label: "Form factor", value: "2.5 pulgadas" },
      { label: "Interfaz", value: "SATA III 6Gb/s" },
      { label: "Lectura", value: "Hasta 550MB/s" },
      { label: "Escritura", value: "Hasta 450MB/s" },
      { label: "Garantía", value: "3 años" },
    ],
    tags: ["ssd", "240gb", "sata", "upgrade"],
    rating: 4.7,
    reviewCount: 41,
  },
  {
    id: "prod-ram-6",
    categoryId: "cat-accesorios-pc",
    sku: "IVMN-PC-006",
    name: "Memoria RAM 8GB DDR4 3200MHz",
    slug: "memoria-ram-8gb-ddr4-3200mhz",
    shortDescription:
      "Módulo de memoria RAM 8GB DDR4 a 3200MHz para laptops y desktops.",
    longDescription:
      "Módulo de memoria RAM DDR4 de 8GB a 3200MHz. Compatible con laptops y desktops modernos que soporten DDR4. Bajo consumo de energía (1.2V) y alta velocidad. Mejora notablemente el rendimiento multitarea de tu equipo.",
    price: 18,
    currency: "USD",
    stock: 28,
    isFeatured: false,
    brand: "Generic",
    model: "RAM-8-DDR4",
    imageColor: "#4CAF50",
    imageEmoji: "🔀",
    specs: [
      { label: "Capacidad", value: "8GB" },
      { label: "Tipo", value: "DDR4" },
      { label: "Velocidad", value: "3200MHz" },
      { label: "Voltaje", value: "1.2V" },
      { label: "Formato", value: "SO-DIMM / DIMM (especificar)" },
    ],
    tags: ["ram", "8gb", "ddr4", "memoria"],
    rating: 4.5,
    reviewCount: 29,
  },
  {
    id: "prod-pendrive-7",
    categoryId: "cat-accesorios-pc",
    sku: "IVMN-PC-007",
    name: "Pendrive USB 3.0 64GB",
    slug: "pendrive-usb-30-64gb",
    shortDescription:
      "Memoria USB 3.0 de 64GB con alta velocidad de transferencia.",
    longDescription:
      "Pendrive USB 3.0 de 64GB con velocidades de lectura hasta 100MB/s. Diseño compacto con tapa protectora. Compatible con USB 2.0 y 3.0. Formateado en exFAT para compatibilidad universal entre Windows y Mac.",
    price: 9,
    compareAtPrice: 12,
    currency: "USD",
    stock: 70,
    isFeatured: false,
    brand: "Generic",
    model: "USB-64-30",
    imageColor: "#5CB85C",
    imageEmoji: "💾",
    specs: [
      { label: "Capacidad", value: "64GB" },
      { label: "Interfaz", value: "USB 3.0" },
      { label: "Lectura", value: "Hasta 100MB/s" },
      { label: "Compatibilidad", value: "USB 2.0 y 3.0" },
      { label: "Formato", value: "exFAT" },
    ],
    tags: ["pendrive", "usb", "64gb", "memoria"],
    rating: 4.4,
    reviewCount: 62,
  },
  {
    id: "prod-adaptador-8",
    categoryId: "cat-accesorios-pc",
    sku: "IVMN-PC-008",
    name: "Adaptador Hub USB-C 4 en 1",
    slug: "adaptador-hub-usb-c-4-en-1",
    shortDescription:
      "Hub USB-C con 3 puertos USB 3.0 + lector de tarjetas SD.",
    longDescription:
      "Adaptador USB-C 4 en 1 con 3 puertos USB 3.0 (hasta 5Gbps) y 1 lector de tarjetas SD/MicroSD. Compatible con laptops MacBook, Dell, HP, Lenovo y cualquier dispositivo con puerto USB-C. Compacto, plug & play, sin drivers.",
    price: 16,
    currency: "USD",
    stock: 35,
    isFeatured: false,
    brand: "Generic",
    model: "HUB-USBC-4",
    imageColor: "#1B5E20",
    imageEmoji: "🔀",
    specs: [
      { label: "Puertos", value: "3× USB 3.0 + 1× SD/MicroSD" },
      { label: "Velocidad USB", value: "5Gbps" },
      { label: "Conexión", value: "USB-C" },
      { label: "Plug & Play", value: "Sí" },
      { label: "Compatibilidad", value: "Mac/Windows/Linux" },
    ],
    tags: ["adaptador", "hub", "usb-c", "lector tarjetas"],
    rating: 4.5,
    reviewCount: 18,
  },

  // ============================================================
  // ACCESORIOS PARA CELULARES — Secundario
  // ============================================================
  {
    id: "prod-cargador-1",
    categoryId: "cat-celulares",
    sku: "IVMN-CEL-001",
    name: "Cargador Rápido USB 18W QC 3.0",
    slug: "cargador-rapido-usb-18w-qc-30",
    shortDescription:
      "Cargador rápido Quick Charge 3.0 18W para Android y iPhone.",
    longDescription:
      "Cargador de pared USB de 18W con tecnología Quick Charge 3.0. Carga tu celular hasta 4x más rápido que un cargador convencional. Compatible con smartphones Android y iPhone (hasta iPhone 14 con cable Lightning-USB). Protección inteligente contra sobrecalentamiento, sobrecorriente y cortocircuitos.",
    price: 9,
    compareAtPrice: 13,
    currency: "USD",
    stock: 80,
    isFeatured: true,
    brand: "Generic",
    model: "CHG-QC30-18W",
    imageColor: "#4CAF50",
    imageEmoji: "🔌",
    specs: [
      { label: "Potencia", value: "18W" },
      { label: "Tecnología", value: "Quick Charge 3.0" },
      { label: "Puertos", value: "1× USB-A" },
      { label: "Voltaje entrada", value: "100-240V AC" },
      { label: "Protección", value: "Sobrecalentamiento / sobrecorriente" },
      { label: "Compatibilidad", value: "Android / iPhone" },
    ],
    tags: ["cargador", "rápido", "qc 3.0", "18w"],
    rating: 4.6,
    reviewCount: 51,
  },
  {
    id: "prod-cable-usbc-2",
    categoryId: "cat-celulares",
    sku: "IVMN-CEL-002",
    name: "Cable USB-C a USB-C 1m Carga Rápida",
    slug: "cable-usb-c-usb-c-1m-carga-rapida",
    shortDescription:
      "Cable USB-C trenzado de 1 metro con soporte de carga rápida hasta 60W.",
    longDescription:
      "Cable USB-C a USB-C trenzado de alta durabilidad. Soporta carga rápida hasta 60W (20V/3A) y transferencia de datos hasta 480Mbps. Compatible con iPhone 15/16, Samsung Galaxy, iPad Pro, MacBook y cualquier dispositivo USB-C. Capa exterior de nailon trenzado resistente a más de 10,000 flexiones.",
    price: 6,
    currency: "USD",
    stock: 90,
    isFeatured: false,
    brand: "Generic",
    model: "CBL-USBC-1M",
    imageColor: "#5CB85C",
    imageEmoji: "🔌",
    specs: [
      { label: "Tipo", value: "USB-C a USB-C" },
      { label: "Longitud", value: "1 metro" },
      { label: "Carga máxima", value: "60W (20V/3A)" },
      { label: "Transferencia", value: "480Mbps" },
      { label: "Material", value: "Nailon trenzado" },
      { label: "Durabilidad", value: "10,000+ flexiones" },
    ],
    tags: ["cable", "usb-c", "carga rápida", "60w"],
    rating: 4.7,
    reviewCount: 43,
  },
  {
    id: "prod-cable-lightning-3",
    categoryId: "cat-celulares",
    sku: "IVMN-CEL-003",
    name: "Cable Lightning a USB para iPhone 1m",
    slug: "cable-lightning-usb-iphone-1m",
    shortDescription:
      "Cable Lightning certificado MFi para iPhone/iPad, 1 metro.",
    longDescription:
      "Cable Lightning a USB-A certificado MFi por Apple. Compatible con iPhone 5 hasta iPhone 14, iPad y AirPods. Carga y sincronización a alta velocidad. Conector reforzado para evitar roturas. Disponible en colores varios.",
    price: 7,
    compareAtPrice: 10,
    currency: "USD",
    stock: 75,
    isFeatured: false,
    brand: "Generic",
    model: "CBL-LIGHT-1M",
    imageColor: "#2E7D32",
    imageEmoji: "🔌",
    specs: [
      { label: "Tipo", value: "Lightning a USB-A" },
      { label: "Certificación", value: "MFi Apple" },
      { label: "Longitud", value: "1 metro" },
      { label: "Compatible", value: "iPhone 5-14 / iPad / AirPods" },
      { label: "Carga + datos", value: "Sí" },
    ],
    tags: ["cable", "lightning", "iphone", "mfi"],
    rating: 4.5,
    reviewCount: 38,
  },
  {
    id: "prod-powerbank-4",
    categoryId: "cat-celulares",
    sku: "IVMN-CEL-004",
    name: "Power Bank 10000mAh Carga Rápida",
    slug: "power-bank-10000mah-carga-rapida",
    shortDescription:
      "Batería externa 10000mAh con carga rápida QC 3.0 y 2 puertos USB.",
    longDescription:
      "Power bank de 10000mAh con carga rápida Quick Charge 3.0. 2 puertos USB de salida + 1 entrada USB-C/MicroUSB. Pantalla LED digital de batería. Carga un iPhone hasta 2.5 veces o un Android promedio 2 veces. Carcasa de aluminio resistente y compacta para llevar a cualquier lado.",
    price: 18,
    compareAtPrice: 24,
    currency: "USD",
    stock: 40,
    isFeatured: true,
    brand: "Generic",
    model: "PB-10K-QC",
    imageColor: "#1B5E20",
    imageEmoji: "🔋",
    specs: [
      { label: "Capacidad", value: "10000mAh" },
      { label: "Tecnología", value: "Quick Charge 3.0" },
      { label: "Puertos salida", value: "2× USB-A" },
      { label: "Entrada", value: "USB-C / MicroUSB" },
      { label: "Display", value: "LED digital de batería" },
      { label: "Material", value: "Aluminio" },
    ],
    tags: ["power bank", "10000mah", "carga rápida", "batería"],
    rating: 4.6,
    reviewCount: 34,
  },
  {
    id: "prod-funda-5",
    categoryId: "cat-celulares",
    sku: "IVMN-CEL-005",
    name: "Funda Silicona Universal Anti-impacto",
    slug: "funda-silicona-universal-anti-impacto",
    shortDescription:
      "Funda de silicona TPU transparente con protección anti-caída.",
    longDescription:
      "Funda de silicona TPU de alta calidad transparente que mantiene la estética original de tu celular. Esquinas reforzadas con tecnología anti-impacto. Material lavable y resistente a amarillamiento. Disponible para múltiples modelos (especificar al cotizar).",
    price: 5,
    currency: "USD",
    stock: 120,
    isFeatured: false,
    brand: "Generic",
    model: "CASE-TPU-CLR",
    imageColor: "#66BB6A",
    imageEmoji: "📱",
    specs: [
      { label: "Material", value: "Silicona TPU" },
      { label: "Color", value: "Transparente" },
      { label: "Protección", value: "Anti-impacto / esquinas reforzadas" },
      { label: "Compatibilidad", value: "Múltiples modelos" },
    ],
    tags: ["funda", "silicona", "tpu", "protección"],
    rating: 4.3,
    reviewCount: 27,
  },
  {
    id: "prod-vidrio-6",
    categoryId: "cat-celulares",
    sku: "IVMN-CEL-006",
    name: "Vidrio Templado 9H Anti-ralladuras",
    slug: "vidrio-templado-9h-anti-ralladuras",
    shortDescription:
      "Protector de pantalla de vidrio templado 9H con oleofóbico.",
    longDescription:
      "Vidrio templado 9H de alta dureza que protege tu pantalla de caídas, golpes y ralladuras. Recubrimiento oleofóbico que evita huellas y facilita la limpieza. Alta sensibilidad al tacto, no afecta la respuesta del touchscreen. Disponible para múltiples modelos.",
    price: 4,
    compareAtPrice: 6,
    currency: "USD",
    stock: 200,
    isFeatured: false,
    brand: "Generic",
    model: "GLASS-9H",
    imageColor: "#5CB85C",
    imageEmoji: "🛡️",
    specs: [
      { label: "Dureza", value: "9H" },
      { label: "Grosor", value: "0.3mm" },
      { label: "Recubrimiento", value: "Oleofóbico" },
      { label: "Transparencia", value: "99%" },
      { label: "Sensibilidad", value: "Táctil completa" },
    ],
    tags: ["vidrio", "templado", "9h", "protector"],
    rating: 4.5,
    reviewCount: 89,
  },
  {
    id: "prod-audifonos-7",
    categoryId: "cat-celulares",
    sku: "IVMN-CEL-007",
    name: "Audífonos In-Ear con Micrófono",
    slug: "audifonos-in-ear-microfono",
    shortDescription:
      "Audífonos intrauditivos con micrófono y control remoto.",
    longDescription:
      "Audífonos in-ear con micrófono integrado y control remoto para contestar llamadas, controlar volumen y reproducir música. Sonido nítido con buenos bajos gracias a los drivers de 10mm. Cable plano anti-enredo de 1.2m. Conector Jack 3.5mm universal.",
    price: 6,
    currency: "USD",
    stock: 85,
    isFeatured: false,
    brand: "Generic",
    model: "EAR-IN-MIC",
    imageColor: "#4CAF50",
    imageEmoji: "🎧",
    specs: [
      { label: "Tipo", value: "In-Ear (intrauditivo)" },
      { label: "Drivers", value: "10mm" },
      { label: "Micrófono", value: "Sí, con control remoto" },
      { label: "Conector", value: "Jack 3.5mm" },
      { label: "Cable", value: "1.2m anti-enredo" },
    ],
    tags: ["audífonos", "in-ear", "micrófono", "música"],
    rating: 4.4,
    reviewCount: 45,
  },

  // ============================================================
  // REDES Y CONECTIVIDAD
  // ============================================================
  {
    id: "prod-router-1",
    categoryId: "cat-redes",
    sku: "IVMN-RED-001",
    name: "Router WiFi Dual Band AC1200",
    slug: "router-wifi-dual-band-ac1200",
    shortDescription:
      "Router WiFi de doble banda 2.4GHz + 5GHz con 4 antenas de alta ganancia.",
    longDescription:
      "Router WiFi de doble banda AC1200 que ofrece velocidades combinadas de hasta 1200Mbps (300Mbps en 2.4GHz + 867Mbps en 5GHz). 4 antenas externas de alta ganancia para máxima cobertura. 4 puertos LAN + 1 WAN Gigabit. Control parental, QoS y modo access point / repetidor. Ideal para hogares y pequeñas oficinas.",
    price: 32,
    compareAtPrice: 40,
    currency: "USD",
    stock: 18,
    isFeatured: true,
    brand: "Generic",
    model: "RTR-AC1200",
    imageColor: "#2E7D32",
    imageEmoji: "📡",
    specs: [
      { label: "Velocidad", value: "AC1200 (300+867Mbps)" },
      { label: "Bandas", value: "Dual Band 2.4 + 5GHz" },
      { label: "Antenas", value: "4 externas" },
      { label: "Puertos", value: "1 WAN + 4 LAN Gigabit" },
      { label: "Modos", value: "Router / AP / Repetidor" },
      { label: "Control parental", value: "Sí" },
    ],
    tags: ["router", "wifi", "dual band", "ac1200"],
    rating: 4.5,
    reviewCount: 23,
  },
  {
    id: "prod-cable-utp-2",
    categoryId: "cat-redes",
    sku: "IVMN-RED-002",
    name: "Cable UTP Cat6 Caja 305m",
    slug: "cable-utp-cat6-caja-305m",
    shortDescription:
      "Caja de cable UTP Categoría 6 de 305 metros para instalaciones de red.",
    longDescription:
      "Caja de cable UTP Categoría 6 de 305 metros (1000 pies). 4 pares trenzados de cobre puro 23AWG. Soporta velocidades de hasta 10Gbps en distancias cortas y 1Gbps en 100m. Ideal para instalaciones de red CCTV IP, oficinas y hogares. Certificado por EIA/TIA.",
    price: 75,
    currency: "USD",
    stock: 10,
    isFeatured: false,
    brand: "Generic",
    model: "UTP-CAT6-305",
    imageColor: "#4CAF50",
    imageEmoji: "📦",
    specs: [
      { label: "Categoría", value: "Cat6" },
      { label: "Longitud", value: "305 metros (caja)" },
      { label: "Calibre", value: "23 AWG" },
      { label: "Velocidad", value: "1Gbps @100m / 10Gbps @55m" },
      { label: "Material", value: "Cobre puro" },
      { label: "Certificación", value: "EIA/TIA" },
    ],
    tags: ["utp", "cat6", "cable", "red"],
    rating: 4.7,
    reviewCount: 14,
  },
  {
    id: "prod-switch-3",
    categoryId: "cat-redes",
    sku: "IVMN-RED-003",
    name: "Switch Gigabit 8 Puertos",
    slug: "switch-gigabit-8-puertos",
    shortDescription:
      "Switch Ethernet no administrable de 8 puertos Gigabit, plug & play.",
    longDescription:
      "Switch Ethernet de 8 puertos Gigabit (10/100/1000Mbps). Plug & play, sin configuración. Auto-MDIX, soporte para frame jumbo de 10KB, indicadores LED por puerto. Carcasa metálica con disipación pasiva. Ideal para extender tu red a más dispositivos: cámaras IP, PCs, smart TVs, consolas.",
    price: 22,
    compareAtPrice: 28,
    currency: "USD",
    stock: 16,
    isFeatured: false,
    brand: "Generic",
    model: "SW-8-GIG",
    imageColor: "#388E3C",
    imageEmoji: "🔀",
    specs: [
      { label: "Puertos", value: "8× Gigabit" },
      { label: "Velocidad", value: "10/100/1000 Mbps" },
      { label: "Configuración", value: "Plug & play (no administrable)" },
      { label: "Auto-MDIX", value: "Sí" },
      { label: "Frame jumbo", value: "10KB" },
      { label: "Carcasa", value: "Metal" },
    ],
    tags: ["switch", "gigabit", "8 puertos", "red"],
    rating: 4.6,
    reviewCount: 18,
  },
];

// ============================================================
// Helpers
// ============================================================
export const WHATSAPP_NUMBER = "584169726126"; // +58 416-9726126 (sin +)
export const WHATSAPP_DISPLAY = "+58 416-9726126";

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function buildProductWhatsAppLink(product: Product): string {
  const msg = `Hola *Inversiones Valencia Mundo Net*, estoy interesado en el producto:

📦 *${product.name}*
SKU: ${product.sku}
Precio: $${product.price} ${product.currency}

¿Tienen disponibilidad? Quisiera más información y cotización. ¡Gracias!`;
  return buildWhatsAppLink(msg);
}

export function buildCartWhatsAppLink(
  items: { product: Product; quantity: number }[]
): string {
  if (items.length === 0) {
    return buildWhatsAppLink(
      "Hola *Inversiones Valencia Mundo Net*, quisiera información sobre sus productos y servicios. ¡Gracias!"
    );
  }
  let msg = `Hola *Inversiones Valencia Mundo Net*, quisiera cotizar los siguientes productos:\n\n`;
  let subtotal = 0;
  items.forEach((item, idx) => {
    const lineTotal = item.product.price * item.quantity;
    subtotal += lineTotal;
    msg += `${idx + 1}. *${item.product.name}*\n`;
    msg += `   Cantidad: ${item.quantity}\n`;
    msg += `   Precio: $${item.product.price} ${item.product.currency}\n`;
    msg += `   Subtotal: $${lineTotal.toFixed(2)} ${item.product.currency}\n\n`;
  });
  msg += `🧾 *TOTAL ESTIMADO: $${subtotal.toFixed(2)} USD*\n\n`;
  msg += `¿Tienen disponibilidad? ¿Cuál sería el costo de envío a Valencia? ¡Gracias!`;
  return buildWhatsAppLink(msg);
}
