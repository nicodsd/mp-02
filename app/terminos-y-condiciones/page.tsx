import type { Metadata } from "next";
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";
import JsonLd from "@/src/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL } from "@/src/lib/seo/site";
import { buildBreadcrumbSchema, WEBSITE_ID } from "@/src/lib/seo/jsonLd";

const PAGE_PATH = "/terminos-y-condiciones";

export const metadata: Metadata = buildPageMetadata({
    title: "Términos y Condiciones",
    description: "Revisa los términos y condiciones de uso de la plataforma de menús digitales QMenú.",
    path: PAGE_PATH,
});

export default function TerminosPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${SITE_URL}${PAGE_PATH}#webpage`,
                url: `${SITE_URL}${PAGE_PATH}`,
                name: "Términos y Condiciones | QMenú",
                inLanguage: "es-AR",
                isPartOf: { "@id": WEBSITE_ID },
            },
            buildBreadcrumbSchema([
                { name: "Inicio", path: "/" },
                { name: "Términos y Condiciones", path: PAGE_PATH },
            ]),
        ],
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <div className="flex selection:bg-primary selection:text-white relative bg-background-2 flex-col items-center w-full min-h-auto">
                <Navbar isIndex={false} />
                <main className="grow w-full relative flex flex-col items-start justify-start md:max-w-7xl mx-auto px-4 sm:px-6 md:px-14 pt-40 pb-20">
                    <h1 className="text-5xl font-bold text-stone-900 mb-8">Términos y Condiciones</h1>

                    <div className="space-y-8 text-stone-600 text-base md:text-lg">
                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">1. Aceptación de los Términos</h2>
                            <p>
                                Al acceder y utilizar la plataforma <strong>QMenú</strong>, aceptas estar sujeto a los presentes Términos y Condiciones. Si no estás de acuerdo con alguna de las condiciones establecidas, no deberás utilizar nuestros servicios.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">2. Descripción del Servicio</h2>
                            <p>
                                QMenú proporciona una plataforma digital que permite a los restaurantes, bares y negocios gastronómicos crear, gestionar y compartir un menú digital a través de códigos QR. Nuestro sistema permite la interacción directa con los clientes, derivando los pedidos a través de WhatsApp.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">3. Registro y Seguridad de la Cuenta</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Para utilizar el servicio, debes registrarte proporcionando información veraz, actual y completa (nombre, correo electrónico, datos del local).</li>
                                <li>Eres responsable de mantener la confidencialidad de tu contraseña, la cual es procesada de forma encriptada en nuestros servidores para mayor seguridad.</li>
                                <li>Deberás notificarnos de inmediato cualquier uso no autorizado de tu cuenta.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">4. Pagos, Suscripciones, Mercado Pago y Paddle</h2>
                            <p>
                                Algunos de nuestros planes y funciones adicionales requieren el pago de una suscripción mensual periódica. En relación a los pagos, aceptas lo siguiente:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Procesamiento por terceros:</strong> Los pagos dentro de Argentina (en ARS) son gestionados por <strong>Mercado Pago</strong>. Los pagos internacionales con tarjeta (en USD) son procesados por <strong>Paddle</strong> (Paddle.com), quien actúa como nuestro <em>Merchant of Record</em> (revendedor autorizado y procesador de pagos e impuestos internacionales). QMenú no retiene, procesa ni almacena datos de tus tarjetas de crédito, débito o cuentas bancarias.</li>
                                <li><strong>Identificación de Suscripción:</strong> Al suscribirte, almacenamos únicamente los identificadores únicos proveídos por Mercado Pago o Paddle para vincular tu cuenta al plan correspondiente y activar las funciones premium.</li>
                                <li><strong>Cancelación:</strong> Puedes cancelar o modificar tu suscripción en cualquier momento desde tu panel de usuario, directamente desde tu cuenta de Mercado Pago o a través del portal/enlace de gestión de suscripción de Paddle. La cancelación detiene las renovaciones futuras y tu acceso permanece activo hasta el final del período ya abonado.</li>
                                <li><strong>Reembolsos (Política de Reembolso):</strong> Para suscripciones procesadas mediante <strong>Paddle</strong>, puedes solicitar un reembolso completo dentro de los <strong>14 días posteriores a la compra inicial</strong> si el servicio no cumple con lo esperado o tuviste algún inconveniente técnico, comunicándote mediante nuestra sección de <a href="/contacto" className="text-primary underline font-medium">Contacto</a> o a través del soporte de Paddle. Para pagos locales vía Mercado Pago, las solicitudes se evalúan dentro de los 14 días posteriores al cobro mediante <a href="/contacto" className="text-primary underline font-medium">Contacto</a>.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">5. Contenido del Usuario</h2>
                            <p>
                                Eres el único responsable de toda la información, imágenes (logos, portadas, fotos de platos), precios y descripciones que subas a tu menú digital.
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Garantizas que posees los derechos necesarios sobre todo el contenido que publicas.</li>
                                <li>QMenú se reserva el derecho de suspender cuentas que suban contenido ilegal, ofensivo o que infrinja derechos de autor.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">6. Limitación de Responsabilidad</h2>
                            <p>
                                QMenú actúa únicamente como una herramienta tecnológica para mostrar tu menú y facilitar el contacto con tus clientes. No somos responsables de:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>La calidad de los productos o servicios ofrecidos por tu negocio.</li>
                                <li>Las transacciones comerciales o acuerdos entre tu negocio y tus clientes (los pedidos se manejan exclusivamente por tu WhatsApp).</li>
                                <li>Interrupciones temporales del servicio debido a mantenimiento o fallos en proveedores externos (como caídas en Mercado Pago, Paddle o en nuestros servicios de alojamiento).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">7. Modificaciones a los Términos</h2>
                            <p>
                                Podemos actualizar estos Términos y Condiciones periódicamente. El uso continuo del servicio después de cualquier modificación constituye tu aceptación de los nuevos términos.
                            </p>
                        </section>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
