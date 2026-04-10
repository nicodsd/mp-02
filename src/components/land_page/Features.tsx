import { Camera, QrCode, Smartphone, CloudLightning, Globe, ShieldCheck, PieChart, Zap } from 'lucide-react';

const featuresList = [
  {
    icon: <QrCode className="h-6 w-6" />,
    title: "Códigos QR Personalizables",
    description: "Genera QRs únicos para cada mesa o local. Descárgalos en alta resolución listos para imprimir."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Ultra rápido",
    description: "Tu menú cargará en segundos, garantizando una experiencia fluida para tus clientes."
  },
  {
    icon: <CloudLightning className="h-6 w-6" />,
    title: "Actualizaciones en Tiempo Real",
    description: "Modifica precios, oculta platos agotados o cambia descripciones al instante."
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Galería de Fotos HD",
    description: "Sube fotos de tus platos en alta calidad. La comida entra por los ojos y aumenta el ticket promedio."
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "100% Responsive",
    description: "Diseño optimizado para usarse en cualquier dispositivo, fluidez sin necesidad de instalar apps."
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "Analíticas",
    description: "Lleva la cuenta de tus platos cargados, tu gestión de promociones y también los pedidos que recibas."
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
            <div key={index} className="py-4 px-4 md:p-6 md:px-6 gap-3 h-fit flex md:flex-col md:items-start rounded-3xl border border-gray-300 items-start group">
              <div className="w-12 h-12 md:bg-primary-50 rounded-xl flex items-center justify-center md:mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="text-lg font-bold text-stone-900 mb-2">{feature.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}