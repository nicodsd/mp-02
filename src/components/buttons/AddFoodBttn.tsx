import Link from "next/link";
import { FaPlus } from "react-icons/fa";
export default function AddFoodBttn({ state }: { state: boolean }) {
    return (
        <Link
            href="/nuevo-plato"
            className={`rounded-full bg-[#ffffff]  ${!state === true ? "border-gray-500 border h-[45px] max-w-[50px] hover:border-gray-500 text-gray-700 hover:border-3" : " p-4 text-orange-500 h-15 w-15 border-orange-500 border-2 hover:border-orange-500 hover:border-3"} flex items-center justify-center cursor-pointer hover:opacity-80 hover:scale-105 transition-transform`}
        >
            <span className="cursor-pointer"><FaPlus className="" size={20} /></span>
        </Link>
    );
}