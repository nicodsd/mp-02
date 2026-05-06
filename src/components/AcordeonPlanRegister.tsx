import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { URI } from '@/src/lib/const';

const PlanSelector = ({ values, setFieldValue }: { values: any, setFieldValue: any }) => {
    // Estado para controlar qué acordeón está abierto manualmente, 
    // aunque por defecto se abrirá el que esté seleccionado en Formik.
    const plans = [
        {
            id: "free",
            name: "Gratuito",
            price: 0,
            btn: false,
            color: "bg-white",
            textColor: "text-stone-800",
            features: [
                "Hasta 10 platos.",
                "Código QR con tu logo.",
                "Fotos básicas.",
                "Actualización en tiempo real.",
                "Los pedidos te llegan al WhatsApp."
            ],
        },
        {
            id: "plus",
            name: "Plus+",
            btn: true,
            price: 100,
            color: "bg-primary",
            textColor: "text-white",
            features: [
                "Platos ilimitados.",
                "Códigos QR personalizables con tu logo.",
                "Fotos de alta calidad.",
                "Analíticas de visitas.",
                "Menú personalizable según estética.",
                "Compras por WhatsApp.",
                "Gestión de promociones."
            ],
        },
        {
            id: "premium",
            name: "Premium",
            btn: true,
            price: 100,
            color: "bg-black",
            textColor: "text-white",
            features: [
                "Platos ilimitados.",
                "Códigos QR personalizables con tu logo.",
                "Fotos de alta calidad.",
                "Analíticas de visitas.",
                "Menú altamente personalizable, diferenciate de la competencia.",
                "Compras por WhatsApp.",
                "Seccion para gestión de pedidos.",
                "Multi sucursal.",
                "Botón de 'Descanso' para vacaciones.",
                "Agrega promociones a tus productos.",
                "Menús diferenciados por zona.",
                "Soporte prioritario."
            ],
        }
    ];
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
    const [openAccordion, setOpenAccordion] = useState(values.plan || 'plus');
    const [loading, setLoading] = useState(false);

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
                        email: values?.email,
                        password: values?.password,
                        name: values?.name,
                        page: 1
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
                className="space-y-2"
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
                                    className={`w-full flex items-center ${plan.id === 'premium' ? 'btn-god-rays' : ''} justify-between cursor-pointer transition-all duration-300 ease-in-out outline-none ${plan.color} ${isOpen ? 'px-3 py-2' : 'py-5 px-3'} ${plan.textColor}`}
                                >
                                    <div className="flex items-center gap-3">

                                        <div className="text-start">
                                            <span className={`text-lg ${plan.id !== 'free' ? 'font-bold' : 'font-regular text-gray-600'} block leading-none`}>
                                                {plan.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <span className="font-black text-xl tracking-">
                                            {plan.id !== "free" && <span className="text-gray-200 font-normal line-through text-sm decoration-primary"> ${new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(plan.price as number + 5000)}</span>} $
                                            {new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(plan.price as number)}<span className="text-[10px] opacity-70">/mes</span>
                                        </span>
                                        <ChevronDown onClick={() => handlePlanClick(plan.id)} className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* Cuerpo Desplegable */}
                                <div
                                    className={`transition-all duration-500 ease-in-out bg-white ${isOpen ? 'max-h-[600px] px-4 pb-4 border-t border-stone-100' : 'max-h-0'
                                        } overflow-hidden`}
                                >
                                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                        {plan.features.map((feature, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={isOpen ? { opacity: 1, x: 0 } : {}}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-center gap-2 text-[13px] leading-3 text-stone-600"
                                            >
                                                <div className={`h-1.5 ${plan.id === 'premium' ? 'bg-black' : 'bg-stone-400'} w-1.5 rounded-full shrink-0`} />
                                                {feature}
                                            </motion.div>
                                        ))}
                                    </div>
                                    <button type='button' className={`w-full cursor-pointer mt-3 ${plan.id !== 'free' ? 'font-bold' : 'font-medium'} ${plan.id !== 'free' ? 'text-white' : 'text-gray-600'} ${plan.id !== 'free' ? 'border border-transparent' : 'border border-gray-300'} ${plan.color} py-2 rounded-lg`} onClick={() => handleSubscribe(plan)}>
                                        {plan.btn ? 'Proceder al pago' : 'Seleccionar Plan'}
                                    </button>
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