import Link from "next/link";
import { FaPlus } from "react-icons/fa";
export default function AddFoodBttn({ state }: { state: boolean }) {
    return (
        <Link
            href="/nuevo-plato"
            className={`rounded-full bg-[#ffffff] ${!state === true ? "border-gray-500 border h-[45px] w-[50px] hover:border-gray-500 text-gray-700 hover:border-3" : " p-4 text-green-500 border-green-500 border-2 hover:border-green-500 hover:border-3"} flex items-center justify-center cursor-pointer  hover:opacity-80 hover:scale-105 transition-transform`}
        >
            <span className="cursor-pointer"><FaPlus className="" size={20} /></span>
        </Link>
    );
}