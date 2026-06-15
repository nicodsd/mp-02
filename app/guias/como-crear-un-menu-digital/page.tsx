import React from 'react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import Link from 'next/link';
import { ArrowLeft, Rocket, MonitorPlay, QrCode, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Cómo crear un menú digital para tu restaurante paso a paso | QMenu',
  description: 'Guía definitiva para digitalizar el menú de tu restaurante en minutos. Aumenta tus ventas y mejora la experiencia de tus clientes sin conocimientos técnicos.',
};

export default function CrearMenuDigitalPage() {
  return (
    <>
      <div className="flex selection:bg-primary selection:text-white relative bg-background flex-col items-center w-full min-h-screen">
        <Navbar isIndex={false} />
        <main className="w-full max-w-7xl mx-auto px-4 pt-30 grow">
          <article className="bg-white rounded-3xl p-2 md:p-12 shadow-sm border border-slate-100">
            <Link href="/guias" className="inline-flex items-center hover:text-orange-600 font-medium mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Guías / Empezar
            </Link>
            <header className="mb-10 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                Guía Paso a Paso
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                Cómo Crear un <span className="text-primary">Menú Digital</span> desde Cero
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                La digitalización gastronómica ya no es el futuro, es el presente. Aprende cómo transformar tu antigua carta de papel en un menú interactivo que vende por ti.
              </p>
            </header>

            <div className="prose prose-lg prose-slate max-w-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start">
                  <MonitorPlay className="w-8 h-8  text-primary mr-4 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 m-0">100% Autogestionable</h4>
                    <p className="text-sm text-slate-600 m-0 mt-1">Sube tus platos y cambia precios cuando quieras.</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start">
                  <QrCode className="w-8 h-8 text-primary mr-4 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 m-0">Pedidos por WhatsApp</h4>
                    <p className="text-sm text-slate-600 m-0 mt-1">Recibe las órdenes directo en tu celular.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <span className="bg-primary aspect-square text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">1</span>
                Registro y Configuración Básica
              </h2>
              <p>
                El primer paso es crear tu cuenta en QMenu. Solo necesitas el nombre de tu restaurante y un correo electrónico. Una vez dentro, configura la información básica:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><strong>Datos del Local:</strong> Dirección, horarios de atención y números de WhatsApp para recibir pedidos.</li>
                <li><strong>Estética:</strong> Sube tu logotipo y una foto de portada atractiva. Selecciona los colores que representan a tu marca.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <span className="bg-primary aspect-square text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2</span>
                Creación de Categorías
              </h2>
              <p>
                Antes de subir los platos, debes organizar tu menú. Una carta bien estructurada facilita la compra. Piensa en cómo organizarías un menú físico:
              </p>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 my-6">
                <p className="font-medium text-orange-800 mb-0">
                  <strong>Estructura Recomendada:</strong> Entradas {'>'} Platos Principales {'>'} Bebidas {'>'} Postres. <br />
                  Recuerda siempre poner las promociones y los platos más rentables en la parte superior.
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <span className="bg-primary aspect-square text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">3</span>
                Carga de Platos
              </h2>
              <p>
                Añade tus productos a cada categoría. Asegúrate de incluir:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><strong>Fotos reales:</strong> Es fundamental para generar apetito y confianza.</li>
                <li><strong>Descripciones detalladas:</strong> Explica los ingredientes y el método de cocción.</li>
                <li><strong>Precios claros:</strong> Y si tienes opciones (como tamaños de pizza), configura las variantes.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                <span className="bg-primary aspect-square text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">4</span>
                Genera tu Código QR y Empieza a Vender
              </h2>
              <p>
                ¡Listo! Tu menú ya está online. El sistema generará automáticamente un Código QR. Puedes descargarlo en alta resolución para imprimirlo y colocarlo en tus mesas, o compartir el enlace de tu menú en la biografía de Instagram de tu restaurante.
              </p>

              <div className="mt-12 text-center">
                <Link href="/registro-de-usuario" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Rocket className="w-5 h-5 mr-2" />
                  Crear mi Menú Gratis Ahora
                </Link>
                <p className="text-sm text-slate-500 mt-4">No se requiere tarjeta de crédito.</p>
              </div>
            </div>
          </article>
        </main>
      </div>
      <Footer />
    </>
  );
}