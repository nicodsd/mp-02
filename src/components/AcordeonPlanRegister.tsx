import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { URI } from '@/src/lib/const';

const plans = [
    {
        id: "free",
        name: "Gratuito",
        price: 0,
        btn: false,
        color: "bg-white",
        textColor: "text-stone-800",
        features: [
            "Hasta 10 platos",
            "Código QR para compartir",
            "Fotos básicas",
            "Los pedidos te llegan al WhatsApp"
        ],
    },
    {
        id: "plus",
        name: "Plus+",
        btn: true,
        price: 24000,
        color: "bg-primary",
        textColor: "text-white",
        features: [
            "Platos ilimitados, permanente",
            "Códigos QR personalizables con tu logo",
            "Fotos de alta calidad",
            "Analíticas de visitas",
            "Paleta de colores que mejor se adapte a tu marca",
            "Pedidos por WhatsApp",
            "Gestión de promociones",
            "Botón de 'Descanso' para vacaciones",
            "Soporte prioritario"
        ],
    },
    {
        id: "premium",
        name: "Premium",
        btn: true,
        price: 34900,
        color: "bg-black",
        textColor: "text-white",
        features: [
            "Platos ilimitados, permanente",
            "Códigos QR personalizables con tu logo",
            "Fotos de alta calidad",
            "Analíticas de visitas",
            "Menú altamente personalizable, diferenciate de la competencia",
            "Compras por WhatsApp",
            "Seccion para gestión de pedidos",
            "Multi sucursal",
            "Botón de 'Descanso' para vacaciones",
            "Agrega promociones a tus productos",
            "Menús diferenciados por zona",
            "Soporte prioritario"
        ],
    },
    {
        id: "lifetime",
        name: "Pago Único",
        btn: false,
        price: 0,
        color: "bg-blue-800",
        textColor: "text-white",
        features: [
            "Muchas gracias por usar QMenú, ahora creá tu cuenta gratis, en breve nos pondremos en contacto contigo."
        ],
    }
];

const PlanSelector = ({ values, setFieldValue }: { values: any, setFieldValue: any }) => {
    // Estado para controlar qué acordeón está abierto manualmente, 
    // aunque por defecto se abrirá el que esté seleccionado en Formik.
    const [openAccordion, setOpenAccordion] = useState(values.plan || 'plus');
    const [loading, setLoading] = useState(false);
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.20, // Tiempo entre la aparición de cada plan
            },
        },
    };
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: "easeOut" }
        },
        exit: { opacity: 0, y: -20 }
    };

    const handlePlanClick = (planId: string) => {
        setFieldValue('plan', planId); // Actualiza Formik
        setOpenAccordion(openAccordion === planId ? null : planId); // Toggle del acordeón
    };
    const handleSubscribe = async (plan: any) => {
        setLoading(true);
        if (plan.id === 'free') {
            return;
        }
        try {
            // Llamamos a tu API
            const response = await fetch(`${URI}/auth/subscribe`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        reason: `Plan ${plan.name} para QMenú`,
                        transaction_amount: plan.price,
                        plan: plan.id,
                        email: values.email,
                        password: values.password,
                        name: values.name
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
            const data = await response.json();
            if (data.init_point) {
                // Redirigimos al usuario al Checkout de Mercado Pago
                window.location.href = data.init_point;
            }
        } catch (error) {
            alert("Hubo un error al procesar el pago");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                role="group"
                aria-labelledby="checkbox-group"
                className="space-y-1"
            >
                <AnimatePresence>
                    {plans.map((plan) => {
                        const isSelected = values.plan === plan.id;
                        const isOpen = openAccordion === plan.id;

                        return (
                            <motion.div
                                variants={itemVariants}
                                key={plan.id}
                                layout // Añade fluidez cuando uno se abre y los otros se desplazan
                                className={`border rounded-lg overflow-hidden transition-all duration-300 ${isSelected
                                    ? 'ring-2 ring-offset-1 ring-blue-400 border-transparent shadow-sm'
                                    : 'border-stone-200'
                                    }`}
                            >
                                {/* Card Header */}
                                <div onClick={() => handlePlanClick(plan.id)}
                                    className={`w-full flex items-center justify-between cursor-pointer transition-all duration-300 ease-in-out outline-none ${plan.color} ${isOpen ? 'px-3 py-2' : 'py-5 px-3'} ${plan.textColor}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-start">
                                            <span className={`text-lg ${plan.id !== 'free' ? 'font-bold' : 'font-regular text-gray-600'} block leading-none`}>
                                                {plan.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {plan.id === 'lifetime' ? (
                                            <span className="font-black text-xl tracking-">Cotizar</span>
                                        ) : (
                                            <span className="font-black text-xl tracking-"> $
                                                {new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(plan.price as number)}<span className="text-[10px] opacity-70">/mes</span>
                                            </span>
                                        )}
                                        <ChevronDown onClick={() => handlePlanClick(plan.id)} className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* Cuerpo Desplegable */}
                                <div
                                    className={`transition-all duration-500 ease-in-out bg-white ${isOpen ? 'max-h-150 px-4 pb-4 border-t border-stone-100' : 'max-h-0'
                                        } overflow-hidden`}
                                >
                                    <div className={`p-3 md:p-6 grid grid-cols-1 gap-x-4 gap-y-1`}>
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className='flex flex-col'>
                                                {plan.name === "Pago Único" && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 w-fit rounded-full font-bold uppercase tracking-wider">Negocios internacionales</span>}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={isOpen ? { opacity: 1, x: 0 } : {}}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`flex items-center gap-2 ${plan.id === 'lifetime' ? 'text-sm' : 'text-xs'} leading-3 text-stone-600 ${plan.id === 'lifetime' ? 'col-span-1 mt-2 leading-relaxed' : ''}`}
                                                >
                                                    {plan.id !== 'lifetime' && <div className={`h-1.5 ${plan.id === 'premium' ? 'bg-black' : 'bg-stone-400'} w-1.5 rounded-full shrink-0`} />}
                                                    {feature}
                                                </motion.div>
                                            </div>
                                        ))}
                                    </div>
                                    {plan.id === 'lifetime' && (
                                        <div className="px-4 pb-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={values.lifetime_accepted || false}
                                                    onChange={(e) => setFieldValue('lifetime_accepted', e.target.checked)}
                                                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded"
                                                />
                                                <span className="text-xs text-stone-600 font-medium">Entiendo que crearé mi cuenta y luego seré contactado para cotizar.</span>
                                            </label>
                                            {values.plan === 'lifetime' && !values.lifetime_accepted && (
                                                <p className="text-red-500 text-[10px] font-bold mt-1">Debes aceptar para continuar</p>
                                            )}
                                        </div>
                                    )}
                                    {plan.btn && <button type='button' className={`w-full cursor-pointer mt-3 font-bold ${plan.id !== 'free' ? 'text-white' : 'text-gray-600'}  ${plan.color} py-2 rounded-lg`} onClick={() => handleSubscribe(plan)}>
                                        Proceder al pago
                                    </button>}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default PlanSelector;
