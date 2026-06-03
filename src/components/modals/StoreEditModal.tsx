import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import React, { Fragment, useState, useEffect } from 'react'
import Image from 'next/image'
import { refreshPage } from '@/app/actions';
import { Field, Formik, Form, ErrorMessage } from 'formik';
import { URI } from '@/src/lib/const';
import * as Yup from 'yup';
import {
    FaInstagram,
    FaFacebook,
    FaTiktok,
    FaCamera,
    FaMapMarkerAlt,
} from "react-icons/fa";

// Esquema de validación para mantener la integridad de los datos
const StoreSchema = Yup.object().shape({
    photo: Yup.mixed().nullable().optional(),
    cover: Yup.mixed().nullable().optional(),
    location: Yup.string().optional(),
    description: Yup.string()
        .test("len", "Mínimo 5 caracteres", (val) => !val || val.length >= 5)
        .test("len", `Máximo 30 caracteres`, (val) => !val || val.length <= 30)
        .optional(),
    schedule: Yup.string().optional(),
    instagram: Yup.string().optional(),
    facebook: Yup.string().optional(),
    tiktok: Yup.string().optional(),
    phonePrefix: Yup.number().when('phone', {
        is: (val: string) => val && val.length > 0,
        then: (schema) => schema.required('Ingrese un prefijo'),
        otherwise: (schema) => schema.optional(),
    }),
    phone: Yup.number().optional().min(7, "Mínimo 7 dígitos")
});

export default function StoreEditModal({ user_id, menu, isOpen, setIsOpen }: { user_id: string, menu: any, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(menu?.photo || null);
    const [coverPreview, setCoverPreview] = useState<string | null>(menu?.cover || null);

    useEffect(() => {
        if (menu) {
            setPhotoPreview(menu.photo || null);
            setCoverPreview(menu.cover || null);
        }
    }, [menu]);

    const handleEditStore = async (values: any) => {
        setIsOpen(false);
        const formData = new FormData();
        if (values.photo instanceof File) {
            formData.append("photo", values.photo);
        }
        if (values.cover instanceof File) {
            formData.append("cover", values.cover);
        }
        formData.append("menu_id", menu._id);
        formData.append("location", values.location);
        formData.append("phonePrefix", values.phonePrefix);
        formData.append("phone", String((values.phonePrefix || "") + (values.phone || "")));
        formData.append("description", values.description);
        formData.append("schedule", values.schedule);
        formData.append("instagram", values.instagram);
        formData.append("facebook", values.facebook);
        formData.append("tiktok", values.tiktok);

        try {
            const response = await fetch(`${URI}/menu/update/info/${user_id}`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });
            if (response.ok) {
                alert(`Tienda actualizada exitosamente`);
                setIsOpen(false);
                refreshPage();
            } else {
                console.log("Error al actualizar la tienda");
                alert(`Error al actualizar la tienda`);
            }
        } catch (error) {
            console.error("Error al actualizar la tienda:", error);
        }
    }

    const initialValues = {
        photo: null,
        cover: null,
        location: menu?.location || '',
        phonePrefix: menu?.phone ? menu.phone.slice(0, 3) : '', // A simple heuristic to extract prefix if possible, adjust if needed
        phone: menu?.phone ? menu.phone.slice(3) : '',
        description: menu?.description || '',
        schedule: menu?.schedule || '',
        instagram: menu?.instagram || '',
        facebook: menu?.facebook || '',
        tiktok: menu?.tiktok || '',
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm" />
                </TransitionChild>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Editar Menú</h2>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="flex h-full items-center justify-end">
                        <TransitionChild
                            enter="transform transition ease-in-out duration-500"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <DialogPanel className="pointer-events-auto relative w-screen p-4 sm:max-w-lg h-full pb-26 flex flex-col overflow-y-auto items-center justify-center bg-background">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={StoreSchema}
                                    onSubmit={(values) => {
                                        handleEditStore(values);
                                    }}
                                >
                                    {({ setFieldValue, isSubmitting, values }) => (
                                        <Form className="flex flex-col gap-6 pt-10 w-full">
                                            <div className={`flex justify-evenly w-full mb-5`}>
                                                {/* LOGO SECTION */}
                                                <div className="relative flex items-center justify-center gap-2 flex-col">
                                                    <h3 className="text-md text-gray-700">Logo</h3>
                                                    <div className={`w-30 md:w-40 h-30 md:h-40 relative ${photoPreview ? "border-gray-200" : "border-transparent"} border rounded-full overflow-hidden`}>
                                                        {photoPreview && <Image
                                                            src={photoPreview}
                                                            alt="Profile"
                                                            width={200}
                                                            height={200}
                                                            quality={75}
                                                            loading="eager"
                                                            className="object-cover w-full h-full"
                                                        />}
                                                        <label className={`absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black/50 ${!photoPreview ? "bg-[#00000040]" : "bg-transparent"} py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition`}>
                                                            <input
                                                                id="photo"
                                                                name="photo"
                                                                type="file"
                                                                accept="image/*"
                                                                className="sr-only"
                                                                onChange={(e) => {
                                                                    const file = e.currentTarget.files?.[0] || null;
                                                                    setFieldValue("photo", file);
                                                                    if (file) setPhotoPreview(URL.createObjectURL(file));
                                                                }}
                                                            />
                                                            <FaCamera />
                                                            {!photoPreview && "Agregar"}
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* COVER SECTION */}
                                                <div className="flex flex-col rounded-lg w-fit justify-center items-center">
                                                    <div className="relative flex items-center justify-center gap-2 flex-col">
                                                        <h3 className="text-lg text-gray-700">Fondo</h3>
                                                        <div className={`w-45 md:w-60 h-30 md:h-40 relative ${coverPreview ? "border-gray-200" : "border-transparent"} border rounded-lg overflow-hidden`}>
                                                            {coverPreview && <Image
                                                                src={coverPreview}
                                                                alt="background"
                                                                width={200}
                                                                height={200}
                                                                quality={75}
                                                                loading="eager"
                                                                className="object-cover w-full h-full"
                                                            />}
                                                            <label className={`absolute top-0 w-full h-full right-1/2 text-center -translate-x-1/2 left-1/2 font-semibold text-white/70 text-xl gap-1 flex flex-col items-center justify-center active:bg-black ${!coverPreview ? "bg-[#00000040]" : "bg-transparent"} py-2.5 px-2 rounded-lg cursor-pointer hover:scale-110 transition`}>
                                                                <input
                                                                    id="cover"
                                                                    name="cover"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="sr-only"
                                                                    onChange={(e) => {
                                                                        const file = e.currentTarget.files?.[0] || null;
                                                                        setFieldValue("cover", file);
                                                                        if (file) setCoverPreview(URL.createObjectURL(file));
                                                                    }}
                                                                />
                                                                <FaCamera />
                                                                {!coverPreview && "Agregar"}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* LOCATION AND PHONE */}
                                            <div className="flex w-full space-x-5 justify-between">
                                                <div className="flex flex-col items-start justify-around">
                                                    <label htmlFor="location" className="block text-md text-gray-700">Ubicación</label>
                                                    <label htmlFor="phone" className="block text-md text-gray-700">WhatsApp</label>
                                                </div>

                                                <div className="flex gap-3 w-full flex-col items-center justify-between">
                                                    <div className="flex items-center justify-end relative w-full">
                                                        <FaMapMarkerAlt className="absolute left-3 text-gray-400" />
                                                        <Field
                                                            id="location"
                                                            name="location"
                                                            maxLength={20}
                                                            type="text"
                                                            placeholder="Av. Alvear 123"
                                                            className="block w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                                        />
                                                        <ErrorMessage name="location" component="div" className="text-[10px] mr-1 text-red-500 font-medium absolute -bottom-4 right-0" />
                                                    </div>
                                                    <div className="flex items-center justify-end relative w-full">
                                                        <Field
                                                            id="phonePrefix"
                                                            name="phonePrefix"
                                                            maxLength={3}
                                                            type="tel"
                                                            inputMode="numeric"
                                                            placeholder="385"
                                                            className="text-gray-700 appearance-none overflow-hidden w-13 text-center text-xl bg-stone-100 border border-gray-300 h-full mr-1 font-bold px-2 py-2 rounded-lg flex items-center"
                                                        />
                                                        <Field
                                                            id="phone"
                                                            name="phone"
                                                            type="tel"
                                                            inputMode="numeric"
                                                            placeholder="1234567"
                                                            maxLength={7}
                                                            className="text-gray-700 appearance-none overflow-hidden w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                                        />
                                                        <ErrorMessage name="phone" component="div" className="text-[10px] mr-1 text-red-500 font-medium absolute -bottom-4 right-0" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DESCRIPTION */}
                                            <div className="relative">
                                                <label htmlFor="description" className="block text-md text-gray-700 mb-1">Descripción</label>
                                                <Field
                                                    id="description"
                                                    name="description"
                                                    as="textarea"
                                                    rows={2}
                                                    maxLength={30}
                                                    placeholder="Cuenta en pocas líneas qué ofreces y tu propuesta de valor."
                                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                                />
                                                <ErrorMessage name="description" component="div" className="mt-0.5 text-sm text-red-500 font-medium absolute" />
                                            </div>

                                            {/* SCHEDULE */}
                                            <div className="relative">
                                                <label htmlFor="schedule" className="block text-md text-gray-700 mb-1">Horarios de Atención</label>
                                                <Field
                                                    id="schedule"
                                                    name="schedule"
                                                    type="text"
                                                    maxLength={50}
                                                    placeholder="Ej. Lun a Vie: 10:00 a 22:00 hs"
                                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                                />
                                                <ErrorMessage name="schedule" component="div" className="mt-0.5 text-sm text-red-500 font-medium absolute" />
                                            </div>

                                            {/* SOCIAL MEDIA */}
                                            <div className="border-t border-gray-300 pt-2">
                                                <label className="block text-md text-gray-700 mt-2 mb-2">Redes</label>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 text-xl text-gray-700"><FaInstagram /></span>
                                                        <Field name="instagram" type="text" maxLength={15} placeholder="@tu_usuario" className="block flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 text-xl text-gray-700"><FaFacebook /></span>
                                                        <Field name="facebook" type="text" maxLength={15} placeholder="Nombre de usuario" className="block flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 text-xl text-gray-700"><FaTiktok /></span>
                                                        <Field name="tiktok" type="text" maxLength={15} placeholder="@tu_usuario" className="block flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* BOTÓN DE ENVÍO */}
                                            {values &&
                                                <div className="bg-background flex justify-end gap-3 fixed bottom-0 left-0 right-0 p-3 w-full">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex-1 px-4 py-2 h-fit max-w-30 text-stone-600 rounded-lg hover:bg-gray-50 transition"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="bg-black text-white py-3 w-50 rounded-lg font-bold hover:opacity-90 transition-opacity"
                                                    >
                                                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                                    </button>
                                                </div>
                                            }

                                        </Form>
                                    )}
                                </Formik>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
