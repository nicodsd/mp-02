import React from 'react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import Link from 'next/link';
import { ArrowLeft, Gift, Megaphone, Clock, Star } from 'lucide-react';

export const metadata = {
  title: 'Cómo crear promociones efectivas para tu restaurante | QMenu',
  description: 'Aprende a diseñar y publicar promociones, combos y ofertas en tu menú digital para impulsar tus ventas en días de baja demanda.',
};

export default function CrearPromocionesPage() {
  return (
    <>
      <div className="flex selection:bg-primary selection:text-white relative bg-background-2 flex-col items-center w-full min-h-screen">
        <Navbar isIndex={false} />

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30 grow">

          <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <Link href="/guias" className="inline-flex items-center hover:text-orange-600 font-medium mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Guías / Aplicar Promociones
            </Link>
            <header className="mb-10 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-600 font-semibold text-sm mb-6">
                Promociones y Ofertas
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                Atrae más Clientes con <span className="text-primary">Promociones Estratégicas</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                Las promociones bien diseñadas no solo atraen clientes nuevos, sino que ayudan a liquidar inventario y mejorar las ventas en los días más flojos de la semana.
              </p>
            </header>

            <div className="prose prose-lg prose-slate max-w-none">
              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <Gift className="w-8 h-8 text-primary mr-3 bg-orange-50 p-1.5 rounded-lg" />
                1. Creación de Combos Irresistibles
              </h2>
              <p>
                Los clientes aman los combos porque perciben un mayor valor por su dinero. En lugar de bajar el precio de un plato principal, acompáñalo con bebida y postre.
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><strong>El Combo Familiar:</strong> Ideal para los domingos. Combina 4 platos principales con bebidas grandes.</li>
                <li><strong>El Combo Ejecutivo:</strong> Perfecto para los mediodías. Debe ser económico y rápido de preparar.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <Clock className="w-8 h-8 text-primary mr-3 bg-orange-50 p-1.5 rounded-lg" />
                2. Ofertas por Tiempo Limitado (Happy Hour)
              </h2>
              <p>
                La urgencia es una de las tácticas de marketing más efectivas. Configura promociones que solo estén disponibles en ciertas franjas horarias.
              </p>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 my-6">
                <p className="font-medium text-purple-800 mb-0">
                  <strong>Estrategia de días de baja demanda:</strong> Si los martes tienes poca gente, lanza una promoción de "2x1 en Pizzas solo los martes". Verás cómo se reactivan tus ventas de inmediato.
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <Megaphone className="w-8 h-8 text-primary mr-3 bg-orange-50 p-1.5 rounded-lg" />
                3. Cómo destacar las promociones en QMenu
              </h2>
              <p>
                Una promoción no sirve si nadie la ve. Te explicamos cómo asegurar que tus clientes noten tus ofertas:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><strong>Categoría Destacada:</strong> Crea una categoría llamada "🔥 Promociones" o "⚡ Ofertas Especiales" y colócala de primera en la lista de tu menú digital.</li>
                <li><strong>Etiquetas de Descuento:</strong> Utiliza el precio tachado. Mostrar el precio original tachado junto al precio promocional resalta el ahorro que está obteniendo el cliente.</li>
              </ul>

              <hr className="my-10 border-slate-100" />

              <div className="bg-slate-900 rounded-2xl p-8 text-white text-center">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-white">Lanza tu primera promoción hoy mismo</h3>
                <p className="text-slate-300 mb-6 max-w-lg mx-auto">
                  Entra a tu panel, selecciona 2 productos de alto margen y combínalos en una oferta especial.
                </p>
                <Link href="/panel-de-usuario" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition-colors">
                  Configurar Ofertas
                </Link>
              </div>
            </div>
          </article>
        </main>
      </div>
      <Footer />
    </>
  );
}
