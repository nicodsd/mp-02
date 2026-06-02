import Image from "next/image";
import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

export const SucursalCard = ({ m, isSelected, isSelectionMode, onToggle }: any) => {
    return (
        <div className="relative group">
            {/* Indicador de check solo en modo selección */}
            {isSelectionMode && (
                <div className={`absolute top-2 right-2 z-20 transition-all duration-200 ${isSelected ? "scale-110 opacity-100" : "scale-100 opacity-70"}`}>
                    <FaCheckCircle className={`${isSelected ? "text-blue-500" : "text-gray-300"} bg-white rounded-full text-2xl shadow-md`} />
                </div>
            )}

            <button
                onClick={() => isSelectionMode ? onToggle(m._id) : console.log("Ver menú", m._id)}
                className={`flex flex-col h-50 w-full rounded-xl border-4 transition-all duration-200 justify-end relative items-center overflow-hidden 
                    ${isSelected ? "border-blue-500 scale-[0.97]" : "border-gray-900"} 
                    bg-gray-200`}
            >
                {m.cover && <Image priority src={m.cover} alt="Cover" fill className={`object-cover z-0 transition-opacity ${isSelected ? "opacity-60" : "opacity-100"}`} />}

                <div className={`flex flex-col pb-3 text-stone-800 items-center border border-white backdrop-blur-sm justify-end relative z-10 min-h-[50%] w-full ${isSelected ? "bg-blue-50/70" : "bg-white/70"} rounded-t-xl`}>
                    <div className={`w-18 h-18 bg-gray-300 absolute -top-10 shadow-lg rounded-full border-4 overflow-hidden transition-all ${isSelected ? "border-blue-500" : "border-white"}`}>
                        {m.photo && <Image priority src={m.photo} alt="Logo" fill className="object-cover" />}
                    </div>
                    <span className="font-bold text-md mt-6">Sucursal #{m.menuEnlisted}</span>
                    <div className="flex items-center mt-1 text-stone-700 justify-center gap-1 px-2">
                        <FaMapMarkerAlt size={14} className="text-primary" />
                        <span className="text-[10px] truncate leading-none uppercase font-semibold ">{m.location}</span>
                    </div>
                </div>
            </button>
        </div>
    );
};