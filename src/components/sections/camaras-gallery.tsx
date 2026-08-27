import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/data/catalog";

const gallery = [
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-calencia.jpeg",
    alt: "Instalación de cámaras en Calencia",
    title: "Calencia",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-crear-app.jpeg",
    alt: "Instalación de cámaras en Crear App",
    title: "Crear App",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-dosenodeaplicaciones.jpeg",
    alt: "Instalación de cámaras en diseño de aplicaciones",
    title: "Diseño de aplicaciones",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-la-luz-santa-lucia.jpeg",
    alt: "Instalación de cámaras en La Luz Santa Lucía",
    title: "La Luz Santa Lucía",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-merida-sancristobal.jpeg",
    alt: "Instalación de cámaras en Mérida San Cristóbal",
    title: "Mérida / San Cristóbal",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-valencia.jpeg",
    alt: "Instalación de cámaras en Valencia",
    title: "Valencia",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-libertad-canagua.jpeg",
    alt: "Instalación de cámaras en Libertad Cañagua",
    title: "Libertad / Cañagua",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-acarigua.jpeg",
    alt: "Instalación de cámaras en Acarigua",
    title: "Acarigua",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-canagua-santa-rosa.jpeg",
    alt: "Instalación de cámaras en Cañagua Santa Rosa",
    title: "Cañagua / Santa Rosa",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-caracas.jpeg",
    alt: "Instalación de cámaras en Caracas",
    title: "Caracas",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-guanare-socopo-santabarbara.jpeg",
    alt: "Instalación de cámaras en Guanare, Socopo y Santabarbara",
    title: "Guanare / Socopo",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-merida.jpeg",
    alt: "Instalación de cámaras en Mérida",
    title: "Mérida",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-pedraza-socopo.jpeg",
    alt: "Instalación de cámaras en Pedraza Socopo",
    title: "Pedraza / Socopo",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-san-silbestre.jpeg",
    alt: "Instalación de cámaras en San Silvestre",
    title: "San Silvestre",
  },
  {
    src: "/camaras/instalacion-de-camaras-de-seguridad-en-barinas-mundonet-santa-rosa-libertad.jpeg",
    alt: "Instalación de cámaras en Santa Rosa Libertad",
    title: "Santa Rosa / Libertad",
  },
];

const whatsappMessage =
  "hola te escribo desde la web estoy intereseado en uno de tus productos o servicios";

export function CamarasGallery() {
  const whatsappLink = buildWhatsAppLink(whatsappMessage);

  return (
    <section className="bg-gradient-to-b from-white to-emerald-50/40 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            Cámaras de seguridad
          </div>
          <h2 className="font-display text-3xl font-extrabold text-gray-900 lg:text-4xl">
            Proyectos realizados en toda Venezuela
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 lg:text-lg">
            Instalaciones profesionales, atención personalizada y soluciones de seguridad para hogares, negocios y comunidades.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gallery.map((image) => (
            <a
              key={image.src}
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
              aria-label={`Contactar por WhatsApp sobre ${image.title}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Cotizar
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-4">
                <span className="text-sm font-bold text-gray-900">{image.title}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  WhatsApp
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
