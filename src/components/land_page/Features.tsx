import { Camera, QrCode, Smartphone, CloudLightning, Globe, ShieldCheck, PieChart, Printer } from 'lucide-react';

const featuresList = [
  {
    icon: <QrCode className="h-6 w-6" />,
    title: "Códigos QR Personalizables",
    description: "Genera QRs únicos para cada mesa o local. Descárgalos en alta resolución listos para imprimir."
  },
  {
    icon: <CloudLightning className="h-6 w-6" />,
    title: "Actualizaciones en Tiempo Real",
    description: "Modifica precios, oculta platos agotados o cambia descripciones instantáneamente sin reimprimir."
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Galería de Fotos HD",
    description: "Sube fotos apetitosas de tus platos. La comida entra por los ojos y aumenta el ticket promedio."
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "100% Responsive",
    description: "Diseño optimizado para cargar rápido en cualquier smartphone, sin necesidad de instalar apps."
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "Analíticas de Visitas",
    description: "Conoce qué platos son los más vistos y en qué horarios tienes más tráfico en tu menú digital."
  },
  {
    icon: <Printer className="h-6 w-6" />,
    title: "Soporte para Impresión",
    description: "¿Necesitas una carta física? Exporta tu menú digital a PDF con un diseño elegante en un clic."
  }
];

export default function Features() {
  return (
    <section id="caracteristicas" className="py-16 md:py-24 lg:pb-40 relative overflow-hidden w-full">
      <div className="w-full relative z-10">
        <div className="text-start mb-12 md:mb-16 px-2">
          <h2 className="text-primary font-bold tracking-wide uppercase text-xs md:text-sm mb-3">Características</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6">Todo lo que tu restaurante necesita</h3>
          <p className="text-stone-600 text-base md:text-lg">
            Una herramienta potente y fácil de usar para digitalizar tu negocio gastronómico.
          </p>
        </div>

        {/* Grid: 1 col móvil, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {featuresList.map((feature, index) => (
            <div key={index} className="py-4 px-6 md:p-6 rounded-3xl border border-bone-300 hover:shadow-lg transition-all duration-100 group">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">{feature.title}</h4>
              <p className="text-stone-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}