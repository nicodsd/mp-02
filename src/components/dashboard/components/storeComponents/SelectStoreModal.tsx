"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
interface SelectStoreModalProps {
    isOpen: boolean;
    storeId: string;
    menu: any;
    onClose: () => void;
    handleBulkDelete: () => void;
    handleEditStore: () => void;
}

export default function SelectStoreModal({
    isOpen,
    storeId,
    menu,
    onClose,
    handleBulkDelete,
    handleEditStore
}: SelectStoreModalProps) {

    if (!isOpen) return null;
    //console.log("menu", menu);
    return (
        <div className="fixed backdrop-blur-sm top-0 left-0 w-full h-full z-50 flex items-center justify-center">
            <div onClick={onClose} className="w-full relative h-full flex flex-col items-center justify-center px-4">
                {/* Contenedor de la tarjeta interna del modal */}
                <div onClick={e => e.stopPropagation()} className="bg-white border relative border-gray-200/50 p-6 rounded-xl shadow-xl flex flex-col items-center justify-center max-w-sm w-full gap-5 text-center">
                    <span className="text-lg text-gray-700 font-semibold">Menu #{menu?.menuEnlisted}</span>
                    <div className="flex items-center relative justify-around w-full h-50">
                        <Image
                            src={menu?.cover}
                            alt="Cover"
                            fill
                            className="object-cover absolute rounded-lg"
                        />
                        <div className="flex flex-col items-center relative justify-evenly w-full bg-linear-to-t from-black/70 to-transparent h-full rounded-lg">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-sm">
                                <Image src={menu?.photo} alt="Logo" fill className="object-cover" />
                            </div>
                            <h3 className="text-xl font-bold
                             text-gray-800 flex items-center gap-1 p-3 rounded-full bg-background shadow-inner"><FaMapMarkerAlt size={20} className="text-primary" />{menu?.location}</h3>

                        </div>
                    </div>

                    {/* Contenedor de los 3 botones principales */}
                    <div className="flex flex-col w-full gap-2 mt-2">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-transform"
                        >
                            Entrar a la sucursal
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-transform"
                        >
                            Compartir
                        </button>
                        <button
                            onClick={() => { handleEditStore() }}
                            className="w-full py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-transform"
                        >
                            Editar sucursal
                        </button>
                    </div>
                    <button
                        onClick={() => { handleBulkDelete() }}
                        className="w-full py-2 text-primary bg-red-50 border border-primary rounded-lg font-bold hover:bg-red-100 active:scale-95 transition-transform"
                    >
                        Borrar
                    </button>

                    {/* Botón de cerrar */}
                    <button
                        onClick={onClose}
                        className="mt-2 text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors underline underline-offset-4"
                    >
                        Cancelar y Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}