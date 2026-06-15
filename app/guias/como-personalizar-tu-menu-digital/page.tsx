import React from 'react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import Link from 'next/link';
import { ArrowLeft, Palette, Smartphone, Sparkles, Layout } from 'lucide-react';

export const metadata = {
  title: 'Cómo personalizar el diseño de tu menú digital | QMenu',
  description: 'Guía sobre cómo adaptar el diseño de tu menú digital a la identidad visual de tu marca: colores, logo, tipografías y portadas.',
};

export default function PersonalizarMenuPage() {
  return (
    <>
      <div className="flex selection:bg-primary selection:text-white relative bg-background flex-col items-center w-full min-h-screen">
        <Navbar isIndex={false} />

        <main className="grow pt-30 pb-4 bg-background w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-4">
          <article className="bg-white rounded-3xl p-2 md:p-12 shadow-sm border border-slate-100">
            <Link href="/guias" className="inline-flex items-center hover:text-orange-600 font-medium mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Guías / Personalización
            </Link>
            <header className="mb-10 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 font-semibold text-sm mb-6">
                Personalización
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 text-pretty">
                Haz que el menú <span className="text-primary">Grite el Nombre de tu Marca</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                La consistencia de marca genera confianza. Tu menú digital no debería verse como una plantilla genérica, sino como una extensión real de tu restaurante.
              </p>
            </header>

            <div className="prose prose-lg prose-slate max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center text-center">
                  <Palette className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Colores de Marca</h3>
                  <p className="text-slate-600 text-sm">Aplica tus colores principales a botones, títulos y elementos de acento.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center text-center">
                  <Layout className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Logo y Portada</h3>
                  <p className="text-slate-600 text-sm">Sube tu logo en alta calidad y una imagen de portada que impacte de inmediato.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <Sparkles className="w-8 h-8 text-primary mr-3 bg-orange-50 p-1.5 rounded-lg" />
                Configuración del Tema Principal
              </h2>
              <p>
                Desde el panel de configuración de diseño, tienes acceso a definir la paleta de colores de tu carta. Te recomendamos:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><strong>Color Primario:</strong> Utilízalo para botones de "Agregar al pedido", iconos principales y etiquetas de precio. Debe ser tu color de marca más distintivo.</li>
                <li><strong>Color de Fondo:</strong> Puedes optar por un fondo claro (blanco o gris sutil) para restaurantes de día o comidas rápidas, y fondos oscuros (negro mate, azul noche) para bares, pubs o cenas elegantes.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <Smartphone className="w-8 h-8 text-primary mr-3 bg-orange-50 p-1.5 rounded-lg" />
                Diseñado para Móviles
              </h2>
              <p>
                Recuerda que el 90% de tus clientes verán el menú en su celular. Mientras personalizas tu menú, revisa constantemente la vista previa móvil.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 my-6">
                <p className="font-medium text-blue-800 mb-0">
                  <strong>Tip de Diseño:</strong> Asegúrate de que el contraste entre el texto y el color de fondo sea lo suficientemente alto para que el menú pueda leerse fácilmente incluso al aire libre o en lugares con poca luz.
                </p>
              </div>
            </div>
          </article>
        </main>
      </div>
      <Footer />
    </>
  );
}
