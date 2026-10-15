export type BarinasCapital = {
  slug: string;
  municipio: string;
  capital: string;
  title: string;
  description: string;
  whatsappMessage: string;
  /** "municipio" = capital municipal; "lugar" = parroquia, sector o urbanización */
  tipo?: "municipio" | "lugar";
};

export const BARINAS_CAPITALES: BarinasCapital[] = [
  {
    slug: "sabaneta",
    municipio: "Alberto Arvelo Torrealba",
    capital: "Sabaneta",
    title: "Instalación de cámaras de seguridad en Sabaneta",
    description:
      "Servicio profesional de instalación de cámaras de seguridad en Sabaneta, Alberto Arvelo Torrealba. Protección para hogares, negocios y propiedades rurales con tecnología CCTV moderna y atención directa.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, estoy interesado en instalar cámaras de seguridad en Sabaneta, Estado Barinas. Quiero información y una cotización.",
  },
  {
    slug: "el-canton",
    municipio: "Andrés Eloy Blanco",
    capital: "El Cantón",
    title: "Instalación de cámaras de seguridad en El Cantón",
    description:
      "Instalación de cámaras de seguridad en El Cantón, municipio Andrés Eloy Blanco. Soluciones para vigilancia residencial, comercial o institucional con asesoría técnica personalizada.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, necesito instalar cámaras de seguridad en El Cantón, Estado Barinas. Me gustaría una cotización y asesoría.",
  },
  {
    slug: "socopo",
    municipio: "Antonio José de Sucre",
    capital: "Socopó",
    title: "Instalación de cámaras de seguridad en Socopó",
    description:
      "Especialistas en cámaras de seguridad en Socopó, municipio Antonio José de Sucre. Instalación, mantenimiento y asesoría para hogares, comercios y oficinas.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, estoy buscando una instalación de cámaras de seguridad en Socopó, Estado Barinas. Quiero más información.",
  },
  {
    slug: "arismendi",
    municipio: "Arismendi",
    capital: "Arismendi",
    title: "Instalación de cámaras de seguridad en Arismendi",
    description:
      "Instalación de cámaras de seguridad para hogares, negocios y comunidades en Arismendi, Estado Barinas. Atención rápida y soluciones adaptadas a tu entorno.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, estoy interesado en cámaras de seguridad para Arismendi, Estado Barinas. Necesito una cotización.",
  },
  {
    slug: "barinas",
    municipio: "Barinas",
    capital: "Barinas",
    title: "Instalación de cámaras de seguridad en Barinas",
    description:
      "Instalación de cámaras de seguridad en Barinas capital del estado. Seguridad moderna, vigilancia IP, redes y mantenimiento para hogares y negocios.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, quiero instalar cámaras de seguridad en Barinas y necesito una cotización. Gracias.",
  },
  {
    slug: "barinitas",
    municipio: "Bolívar",
    capital: "Barinitas",
    title: "Instalación de cámaras de seguridad en Barinitas",
    description:
      "Instalación de cámaras de seguridad en Barinitas, municipio Bolívar. Soluciones de vigilancia con equipos de calidad y atención profesional.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, necesito una instalación de cámaras de seguridad en Barinitas, Estado Barinas. ¿Me colaboran con información?",
  },
  {
    slug: "barrancas",
    municipio: "Cruz Paredes",
    capital: "Barrancas",
    title: "Instalación de cámaras de seguridad en Barrancas",
    description:
      "Cámaras de seguridad en Barrancas, municipio Cruz Paredes. Instalación confiable para viviendas, comercios y grandes propiedades.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, estoy interesado en cámaras de seguridad para Barrancas, Estado Barinas. Quiero cotizar.",
  },
  {
    slug: "santa-barbara",
    municipio: "Ezequiel Zamora",
    capital: "Santa Bárbara",
    title: "Instalación de cámaras de seguridad en Santa Bárbara",
    description:
      "Servicio de cámaras de seguridad en Santa Bárbara, municipio Ezequiel Zamora. Soluciones para vigilancia residencial, empresarial y comunitaria.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, necesito cámaras de seguridad en Santa Bárbara, Estado Barinas. Me gustaría asesoría y precio.",
  },
  {
    slug: "obispos",
    municipio: "Obispos",
    capital: "Obispos",
    title: "Instalación de cámaras de seguridad en Obispos",
    description:
      "Instalación de cámaras de seguridad en Obispos, municipio Obispos. Soluciones modernas y servicio técnico con garantía para vigilancia permanente.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, quiero instalar cámaras de seguridad en Obispos, Estado Barinas. Quiero información y cotización.",
  },
  {
    slug: "ciudad-bolivia",
    municipio: "Pedraza",
    capital: "Ciudad Bolivia",
    title: "Instalación de cámaras de seguridad en Ciudad Bolivia",
    description:
      "Instalación de cámaras de seguridad en Ciudad Bolivia, municipio Pedraza. Soluciones de videovigilancia para hogares, negocios y zonas comerciales.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, estoy buscando instalar cámaras de seguridad en Ciudad Bolivia, Estado Barinas. Necesito asesoría.",
  },
  {
    slug: "libertad",
    municipio: "Rojas",
    capital: "Libertad",
    title: "Instalación de cámaras de seguridad en Libertad",
    description:
      "Servicio de instalación de cámaras de seguridad en Libertad, municipio Rojas. Soluciones de vigilancia para protección total de tu propiedad.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, quiero cámaras de seguridad en Libertad, Estado Barinas. ¿Me pueden cotizar?",
  },
  {
    slug: "ciudad-de-nutrias",
    municipio: "Sosa",
    capital: "Ciudad de Nutrias",
    title: "Instalación de cámaras de seguridad en Ciudad de Nutrias",
    description:
      "Instalación de cámaras de seguridad en Ciudad de Nutrias, municipio Sosa. Tecnología de seguridad, monitoreo y soporte técnico profesional.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, estoy interesado en cámaras de seguridad para Ciudad de Nutrias, Estado Barinas. Necesito una cotización.",
  },
  {
    slug: "santa-lucia",
    municipio: "Barinas",
    capital: "Santa Lucía",
    title: "Instalación de cámaras de seguridad en Santa Lucía, Barinas",
    description:
      "Instalación de cámaras de seguridad para casas, fincas y comercios de la parroquia Santa Lucía, municipio Barinas. Vamos hasta tu propiedad con equipos CCTV, IP y WiFi y te dejamos todo configurado en tu celular.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, quiero instalar cámaras de seguridad en Santa Lucía, Estado Barinas. Necesito información y una cotización.",
    tipo: "lugar",
  },
  {
    slug: "santa-rosa",
    municipio: "Barinas",
    capital: "Santa Rosa",
    title: "Instalación de cámaras de seguridad en Santa Rosa, Barinas",
    description:
      "Instalación de cámaras de seguridad en la parroquia Santa Rosa, municipio Barinas. Protegemos hogares, bodegas, fincas y negocios con cámaras de alta definición y monitoreo remoto.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, quiero instalar cámaras de seguridad en Santa Rosa, Estado Barinas. Necesito información y una cotización.",
    tipo: "lugar",
  },
  {
    slug: "la-luz",
    municipio: "Obispos",
    capital: "La Luz",
    title: "Instalación de cámaras de seguridad en La Luz, Barinas",
    description:
      "Instalación de cámaras de seguridad en La Luz, municipio Obispos. Soluciones de videovigilancia para viviendas, comercios y propiedades rurales, con instalación y soporte técnico.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, quiero instalar cámaras de seguridad en La Luz, Estado Barinas. Necesito información y una cotización.",
    tipo: "lugar",
  },
  {
    slug: "san-silvestre",
    municipio: "Barinas",
    capital: "San Silvestre",
    title: "Instalación de cámaras de seguridad en San Silvestre, Barinas",
    description:
      "Instalación de cámaras de seguridad en San Silvestre, municipio Barinas. Cámaras para fincas, hatos, viviendas y comercios, con acceso remoto desde tu teléfono.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, quiero instalar cámaras de seguridad en San Silvestre, Estado Barinas. Necesito información y una cotización.",
    tipo: "lugar",
  },
  {
    slug: "alto-barinas",
    municipio: "Barinas",
    capital: "Alto Barinas",
    title: "Instalación de cámaras de seguridad en Alto Barinas, Barinas",
    description:
      "Instalación de cámaras de seguridad en Alto Barinas, ciudad de Barinas. Vigilancia para casas, quintas, conjuntos residenciales, consultorios y negocios, con visita técnica el mismo día.",
    whatsappMessage:
      "Hola *Inversiones Valencia Mundo Net*, quiero instalar cámaras de seguridad en Alto Barinas, Estado Barinas. Necesito información y una cotización.",
    tipo: "lugar",
  },
];
