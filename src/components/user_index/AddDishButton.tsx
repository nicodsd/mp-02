import { FaPlus } from "react-icons/fa";

export default function AddDishButton() {
    return (
        <div className="flex h-28 w-full flex-col justify-center items-center text-gray-800">
            <a
                href="/nuevo-plato"
                className="group cursor-pointer flex flex-col items-center justify-center h-full w-full bg-lime-50 border-2 border-dashed border-lime-500 rounded-2xl hover:bg-lime-600 transition duration-300"
            >
                <FaPlus className="text-2xl mb-2 text-lime-600 group-hover:text-white" />
                <span className="text-lime-700 font-bold group-hover:text-white">Toca aquí para agregar nuevo plato</span>
            </a>
        </div>
    );
}