export interface FaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQS: readonly FaqItem[] = [
  {
    question: "¿Qué es QMenú y cómo ayuda a mi restaurante?",
    answer:
      "Nuestra plataforma te permite crear tu propio menú digital con código QR en minutos. Agilizás la toma de pedidos, mejorás la experiencia de tus clientes y le das a tu negocio gastronómico una imagen mucho más profesional.",
  },
  {
    question: "¿Cómo acceden mis clientes al menú digital QR?",
    answer:
      "Es muy sencillo. Tus clientes solo tienen que escanear el código QR que colocás en las mesas, o ingresar desde un link directo en tus redes sociales (Instagram, WhatsApp, Google Maps).",
  },
  {
    question: "¿Puedo personalizar el diseño de mi carta digital?",
    answer:
      "¡Totalmente! En tu panel de usuario contás con una sección de Personalización donde podés elegir entre diferentes diseños, opciones y colores para que el menú se adapte a la marca de tu restaurante, bar o cafetería.",
  },
  {
    question: "¿Puedo modificar los precios o agregar promociones en cualquier momento?",
    answer:
      "Sí, todos los cambios que hagas en el panel (actualizar precios, agregar nuevos platos o activar promociones) se reflejan en tiempo real. ¡Olvidate de imprimir cartas nuevas cada vez que cambian los precios!",
  },
  {
    question: "¿Necesito descargar alguna aplicación o tienen que hacerlo mis clientes?",
    answer:
      "No, la plataforma es 100% web. Tanto vos como tus clientes acceden directamente desde el navegador de cualquier celular, tablet o computadora sin instalar nada.",
  },
] as const;
