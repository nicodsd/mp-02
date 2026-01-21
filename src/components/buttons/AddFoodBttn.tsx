import Link from "next/link";
import { FaPlus } from "react-icons/fa";
export default function AddFoodBttn({ state }: { state: boolean }) {
    return (
        <Link
            href="/nuevo-plato"
            className={`rounded-full ${!state === true ? "border-gray-500 border p-2 max-w-[50px] hover:border-gray-500 text-gray-700" : "text-white flex-col px-2 h-15 w-25 rounded-xl py-2 bg-red-600 gap-1 shadow"} flex items-center justify-center cursor-pointer hover:opacity-80 hover:scale-105 transition-transform`}
        >
            <FaPlus className="cursor-pointer h-8 w-8" />
            {
                state === true ? (
                    <p className="text-xs">Agregar plato</p>
                ) : null
            }
        </Link>
    );
}