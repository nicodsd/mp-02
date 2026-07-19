import React from 'react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";


export const metadata = {
    title: "Políticas de Privacidad | QMenú",
    description: "Lee nuestras políticas de privacidad y cómo protegemos tus datos.",
};

export default function PoliticasPage() {
    return (
        <>
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
                                <li><strong>Datos de pago:</strong> QMenú <strong>no procesa ni almacena directamente datos de tarjetas de crédito o débito</strong>. Los pagos de las suscripciones se realizan a través de <strong>Mercado Pago</strong>. Únicamente almacenamos un identificador de suscripción (ID de preaprobación) y el estado del plan elegido para habilitar las funciones correspondientes en la plataforma.</li>
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
                                <li>Gestionar el estado de las suscripciones y habilitar las funciones premium cuando corresponda (procesado en conjunto con Mercado Pago).</li>
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
                                <li><strong>Procesamiento de pagos seguro:</strong> Al delegar los pagos a Mercado Pago, garantizamos que tu información financiera sensible viaje por canales seguros y encriptados, cumpliendo con los más altos estándares de la industria (PCI-DSS).</li>
                                <li><strong>Almacenamiento en la nube:</strong> Las imágenes (logos y portadas) y los datos de tu menú son almacenados en proveedores de servicios en la nube de alta confiabilidad (ej. Cloudinary), con estrictos controles de acceso.</li>
                                <li><strong>Conexión segura:</strong> Todo el tráfico entre tu navegador y nuestros servidores viaja encriptado mediante SSL/TLS (HTTPS).</li>
                            </ul>
                            <span className='text-xs md:text-lg p-4 bg-red-300/50 rounded-xl text-stone-800 shadow-md mt-2 block'> En caso de hackeo o robo de datos, los atacantes no tendrían acceso a tus tarjetas, ya que son procesados por Mercado Pago.</span>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">4. Compartir información con terceros</h2>
                            <p>
                                No vendemos, alquilamos ni compartimos tus datos personales con terceros para fines comerciales o publicitarios. Solo compartimos la información estrictamente necesaria con proveedores de servicios esenciales (como Mercado Pago para procesar pagos o servicios de alojamiento en la nube para guardar imágenes y base de datos) bajo acuerdos de confidencialidad.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">5. Derechos del usuario</h2>
                            <p>
                                Tienes el derecho de acceder, modificar o eliminar tu información personal y los datos de tu negocio en cualquier momento desde tu panel de usuario. Si deseas darte de baja por completo o revocar permisos, puedes contactarnos a través de nuestra página de <a href="/contacto" className="text-primary underline font-medium">Contacto</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">6. Cambios en esta política</h2>
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
