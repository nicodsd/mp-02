import React from 'react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Image as ImageIcon, Tags, Edit3 } from 'lucide-react';

export const metadata = {
  title: 'Cómo crear platos perfectos para tu menú digital | QMenu',
  description: 'Guía paso a paso para crear platos irresistibles en tu menú digital. Aprende a subir fotos, escribir descripciones que vendan y configurar variantes.',
};

export default function CrearPlatosPage() {
  return (
    <>
      <div className="flex selection:bg-primary selection:text-white relative bg-background flex-col items-center w-full min-h-screen mb-20">
        <Navbar isIndex={false} />

        <main className="grow pt-30 pb-4 md:rounded-b-2xl md:shadow-[4px_20px_50px_4px] md:shadow-gray-200/60 bg-background w-full relative flex flex-col items-center md:max-w-7xl mx-auto px-4">

          <article className="bg-white rounded-3xl p-2 md:p-12 shadow-sm border border-slate-100">
            <Link href="/guias" className="inline-flex items-center hover:text-orange-600 font-medium mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Guías / Creación de platos
            </Link>
            <header className="mb-10 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6">
                Creación de Platos
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                El Arte de Crear Platos que <span className="text-primary">Venden Solos</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                Un menú digital no es solo una lista de precios; es tu principal herramienta de ventas. Descubre cómo cargar tus productos de forma atractiva para aumentar el ticket promedio de tu restaurante.
              </p>
            </header>

            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-primary">
              <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-2" />
                  Lo que aprenderás
                </h3>
                <ul className="space-y-2 mb-0">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></span>La importancia de las fotografías de alta calidad.</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></span>Cómo escribir descripciones que despierten el apetito.</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></span>Configuración de variantes, adicionales y modificadores.</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <ImageIcon className="w-8 h-8 text-primary mr-3 bg-orange-50 p-1.5 rounded-lg" />
                1. La Imagen lo es Todo
              </h2>
              <p>
                Los clientes comen primero con los ojos. Un plato con una buena fotografía se vende hasta un <strong>30% más</strong> que uno sin imagen.
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><strong>Iluminación natural:</strong> Siempre que puedas, toma las fotos cerca de una ventana. La luz natural resalta los colores reales de la comida.</li>
                <li><strong>Ángulo a 45 grados:</strong> Es el ángulo natural en el que un comensal ve su plato al sentarse en la mesa.</li>
                <li><strong>Fondo limpio:</strong> Evita distracciones. Un fondo blanco, de madera o liso funciona perfecto.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <Edit3 className="w-8 h-8 text-primary mr-3 bg-orange-50 p-1.5 rounded-lg" />
                2. Descripciones que Despiertan Antojos
              </h2>
              <p>
                Evita descripciones aburridas como <em>"Hamburguesa con queso y papas"</em>. Utiliza palabras sensoriales que describan texturas y métodos de cocción.
              </p>
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 my-6">
                <p className="font-medium text-green-800 mb-0">
                  <strong>Ejemplo perfecto:</strong> "Doble medallón de carne 100% vacuna smash, costra crujiente, queso cheddar fundido, cebolla caramelizada y nuestra salsa secreta, servida en pan brioche artesanal tostado con mantequilla. Acompañada de papas rústicas crujientes."
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <Tags className="w-8 h-8 text-primary mr-3 bg-orange-50 p-1.5 rounded-lg" />
                3. Opciones, Variantes y Adicionales (Upselling)
              </h2>
              <p>
                El secreto para aumentar tu ticket promedio está en los adicionales. Al crear un plato en nuestro panel, puedes configurar grupos de opciones:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><strong>Modificadores obligatorios:</strong> Por ejemplo, el punto de la carne (Jugoso, A punto, Cocido) o el tipo de guarnición.</li>
                <li><strong>Adicionales (con costo extra):</strong> Permite a tus clientes agregar extra queso, bacon o agrandar su porción. ¡Es la forma más fácil de ganar más por pedido!</li>
              </ul>

              <hr className="my-10 border-slate-100" />

              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">¿Listo para cargar tus platos?</h3>
                <Link href="/panel-de-usuario" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition-colors">
                  Ir al Panel de Control
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
