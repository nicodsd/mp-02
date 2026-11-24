import type { Metadata } from 'next';
import React from 'react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import CookiePreferencesButton from "@/src/components/common/CookiePreferencesButton";
import JsonLd from "@/src/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/src/lib/seo/site";
import { buildBreadcrumbSchema, WEBSITE_ID } from "@/src/lib/seo/jsonLd";

const PAGE_PATH = "/politicas";

export const metadata: Metadata = buildPageMetadata({
    title: "Política de Privacidad",
    description: "Lee la política de privacidad de QMenú y cómo protegemos los datos de tu restaurante y tus clientes.",
    path: PAGE_PATH,
});

export default function PoliticasPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${SITE_URL}${PAGE_PATH}#webpage`,
                url: `${SITE_URL}${PAGE_PATH}`,
                name: "Política de Privacidad | QMenú",
                inLanguage: "es-AR",
                isPartOf: { "@id": WEBSITE_ID },
            },
            buildBreadcrumbSchema([
                { name: "Inicio", path: "/" },
                { name: "Política de Privacidad", path: PAGE_PATH },
            ]),
        ],
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <div className="flex selection:bg-primary selection:text-white relative bg-background-2 flex-col items-center w-full min-h-auto">
                <Navbar isIndex={false} />
                <main className="grow w-full relative flex flex-col items-start justify-start md:max-w-7xl mx-auto px-4 sm:px-6 md:px-14 pt-40 pb-20">
                    <h1 className="text-5xl font-bold text-stone-900 mb-8">Política de Privacidad</h1>

                    <div className="space-y-8 text-stone-600 text-base md:text-lg">
                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">1. Información que recopilamos</h2>
                            <p>
                                Para brindarte el servicio de creación de menú digital en <strong>QMenú</strong>, recopilamos los siguientes datos personales y de tu negocio:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Datos de cuenta:</strong> Nombre, correo electrónico, contraseña y número de teléfono (WhatsApp).</li>
                                <li><strong>Datos del perfil/negocio:</strong> Ubicación, descripción del negocio, horarios de atención y enlaces a redes sociales (Instagram, Facebook, TikTok).</li>
                                <li><strong>Archivos multimedia:</strong> Logotipo y foto de portada del negocio.</li>
                                <li><strong>Datos de pago:</strong> QMenú <strong>no procesa ni almacena directamente datos de tarjetas de crédito o débito</strong>. Los pagos de las suscripciones se realizan a través de <strong>Mercado Pago</strong> (para Argentina en ARS) o <strong>Paddle</strong> (para pagos internacionales en USD, actuando como Merchant of Record). Únicamente almacenamos identificadores de suscripción/transacción y el estado del plan elegido para habilitar las funciones correspondientes en la plataforma.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">2. Uso de la información</h2>
                            <p>
                                Utilizamos la información recopilada exclusivamente para los siguientes fines:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Crear, configurar y personalizar el menú digital de tu negocio.</li>
                                <li>Verificar la identidad del usuario mediante códigos de confirmación enviados por correo electrónico.</li>
                                <li>Gestionar el estado de las suscripciones y habilitar las funciones premium cuando corresponda (procesado en conjunto con Mercado Pago o Paddle).</li>
                                <li>Permitir que tus clientes se contacten directamente contigo vía WhatsApp para realizar pedidos.</li>
                                <li>Mejorar y optimizar nuestros servicios.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">3. Procesamiento y Almacenamiento Seguro</h2>
                            <p>
                                Nos tomamos muy en serio la seguridad de tus datos. Para proteger tu información implementamos las siguientes medidas:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Contraseñas encriptadas:</strong> Tus contraseñas se almacenan de manera segura utilizando algoritmos de hash unidireccionales; no guardamos contraseñas en texto plano.</li>
                                <li><strong>Procesamiento de pagos seguro:</strong> Al delegar los pagos a Mercado Pago y Paddle, garantizamos que tu información financiera sensible viaje por canales seguros y encriptados, cumpliendo con los más altos estándares de la industria (PCI-DSS).</li>
                                <li><strong>Almacenamiento en la nube:</strong> Las imágenes (logos y portadas) y los datos de tu menú son almacenados en proveedores de servicios en la nube de alta confiabilidad (ej. Cloudinary), con estrictos controles de acceso.</li>
                                <li><strong>Conexión segura:</strong> Todo el tráfico entre tu navegador y nuestros servidores viaja encriptado mediante SSL/TLS (HTTPS).</li>
                            </ul>
                            <span className='text-xs md:text-lg p-4 bg-red-300/50 rounded-xl text-stone-800 shadow-md mt-2 block'> En caso de hackeo o robo de datos, los atacantes no tendrían acceso a tus tarjetas, ya que son procesados directamente por Mercado Pago o Paddle.</span>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">4. Compartir información con terceros</h2>
                            <p>
                                No vendemos, alquilamos ni compartimos tus datos personales con terceros para fines comerciales o publicitarios. Solo compartimos la información estrictamente necesaria con proveedores de servicios esenciales (como Mercado Pago y Paddle para procesar pagos o servicios de alojamiento en la nube para guardar imágenes y base de datos) bajo acuerdos de confidencialidad.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">5. Derechos del usuario</h2>
                            <p>
                                Tienes el derecho de acceder, modificar o eliminar tu información personal y los datos de tu negocio en cualquier momento desde tu panel de usuario. Si deseas darte de baja por completo o revocar permisos, puedes contactarnos a través de nuestra página de <a href="/contacto" className="text-primary underline font-medium">Contacto</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">6. Política de Cookies y Almacenamiento Local</h2>
                            <p>
                                En <strong>QMenú</strong> utilizamos cookies propias y de terceros, así como almacenamiento local (LocalStorage), clasificados en las siguientes categorías:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Cookies técnicas esenciales (siempre activas):</strong> Mantienen tu sesión activa, gestionan la autenticación, aplican configuraciones de seguridad y recuerdan el estado de tu carrito de pedidos y consentimiento.</li>
                                <li><strong>Cookies de preferencias y funcionalidad:</strong> Permiten recordar configuraciones de interfaz y personalización para ofrecerte una experiencia adaptada.</li>
                                <li><strong>Cookies analíticas y de rendimiento:</strong> Mediante Google Tag Manager, Google Analytics y herramientas de medición (Vercel Analytics y Speed Insights), recopilamos métricas agregadas de uso y rendimiento para mejorar la plataforma. Solo se activan si otorgas tu consentimiento.</li>
                                <li><strong>Cookies de marketing y publicidad:</strong> Gestionadas a través de Google Tag Manager para medir campañas y atribución publicitaria únicamente cuando las habilitas en tus preferencias.</li>
                                <li><strong>Menús con pedidos por WhatsApp:</strong> Para los menús que tienen habilitada la recepción de pedidos, utilizamos el almacenamiento local para recordar los ítems en el carrito y, únicamente al momento de confirmar un pedido a domicilio, solicitar tu <strong>nombre y ubicación geográfica</strong> con el fin de remitir la comanda al comercio vía WhatsApp.</li>
                                <li><strong>Gestión del consentimiento:</strong> Puedes aceptar todas, rechazar las opcionales o elegir qué categorías habilitar en cualquier momento.</li>
                            </ul>
                            <CookiePreferencesButton />
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">7. Cambios en esta política</h2>
                            <p>
                                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Te notificaremos sobre cambios significativos a través de un aviso en la plataforma o por correo electrónico.
                            </p>
                        </section>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
