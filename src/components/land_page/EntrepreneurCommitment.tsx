import { Rocket, TrendingUp, Star, HeartHandshake } from "lucide-react";

export default function EntrepreneurCommitment() {
  return (
    <section className="py-6 mt-10 md:mt-6 relative w-full rounded-3xl md:mb-30 shadow-lg bg-white">

      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 text-center">
        <div className="flex justify-center mb-6 bg-white p-4 md:p-6 absolute -top-20 md:-top-26 left-1/2 rounded-full -translate-x-1/2">
          <div>
            <HeartHandshake className="w-20 h-20 md:w-26 md:h-26 text-primary" aria-hidden="true" />
          </div>
        </div>

        <h2 className="tracking-tight text-lg md:text-3xl text-stone-700 mb-3 pt-10">
          De la mano con los <span className="text-red-700">emprendedores</span>
        </h2>

        <p className="text-sm md:text-md text-stone-600 max-w-4xl mx-auto text-balance">
          Sabemos lo desafiante que puede ser empezar desde cero. Por eso, creamos QMenú con un propósito claro: darte las herramientas necesarias para que puedas crecer, destacarte y llevar tu negocio a las redes y <strong>facilitar la toma de pedidos</strong> sin barreras iniciales.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 pt-6 gap-4 md:gap-6">
          <div className="flex flex-col items-center md:p-6">
            <div className="flex items-center justify-center mb-1 text-primary">
              <Rocket className="md:w-10 md:h-10 w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-stone-700 mb-1">Empieza sin costos</h3>
            <p className="text-stone-600 text-center text-xs">Creemos que el presupuesto no debe ser un freno. Digitaliza tu menú totalmente gratis.</p>
          </div>

          <div className="flex flex-col items-center md:p-6">
            <div className="flex items-center justify-center mb-1 text-primary">
              <TrendingUp className="md:w-10 md:h-10 w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-stone-700 mb-1">Crece sin límites</h3>
            <p className="text-stone-600 text-center text-xs">Te acompañamos en cada paso con herramientas que escalan a medida que tu negocio crece.</p>
          </div>

          <div className="flex flex-col items-center md:p-6">
            <div className="flex items-center justify-center mb-1 text-primary">
              <Star className="md:w-10 md:h-10 w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-stone-700 mb-1">Destácate del resto</h3>
            <p className="text-stone-600 text-center text-xs">Ofrece una experiencia moderna y profesional que enamorará a tus clientes desde el primer escaneo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
