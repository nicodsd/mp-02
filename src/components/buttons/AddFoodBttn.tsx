import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";
export default function AddFoodBttn({ state }: { state: boolean }) {
    return (
        <Link
            href="/nuevo-plato"
            className={`rounded-full ${!state === true ? "max-w-12.5 text-gray-700" : "text-white flex-col px-2 h-15 w-25 rounded-xl py-2 bg-red-600 gap-1 shadow"} flex items-center justify-center cursor-pointer hover:opacity-80 hover:scale-105 transition-transform`}
        >
            <FaPlusCircle size={40} className="cursor-pointer" />
            {
                state === true ? (
                    <p className="text-xs">Agregar plato</p>
                ) : null
            }
        </Link>
    );
}