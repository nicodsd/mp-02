import { FaPlus } from "react-icons/fa";
export default function AddDishButton({ template }: any) {
    return (
        <div className={`flex h-28 w-full flex-col hover:opacity-60 active:scale-90 justify-center transition-all duration-200 items-center ${template?.textColor}`}>
            <a
                href="/nuevo-plato"
                className={`group cursor-pointer flex flex-col items-center justify-center h-full w-full ${template?.backgroundColor2} hover:${template?.backgroundColor} border-2 border-dashed border-${template?.accentColors[0]} rounded-2xl hover:bg-${template?.accentColors[0]} transition duration-300 ${template?.textColor}`}
            >
                <FaPlus size={28} className={`mb-2 ${template?.textColor} `} />
                <span className={`font-bold`}>Toca aquí para agregar nuevo plato</span>
            </a>
        </div>
    );
}