import { FaSearch } from "react-icons/fa";

export default function FilterHeader({ foods, onSearch, onOpenModal, template }: any) {
    return (
        <div className={`${template?.backgroundColor || "bg-background"} rounded-2xl px-2 py-2 w-full shadow-md sticky top-13 z-20`}>
            <div onClick={() => onOpenModal(true)} className="relative flex items-center w-full">
                <input
                    type="search"
                    placeholder="Busca tu comida..."
                    className={`pl-10 pr-2 py-3 border ${template?.backgroundColor || "bg-background"} ${template?.border || "border-gray-300"} placeholder:${template?.textColorOpacity} ${template?.textColor} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
                />
                <FaSearch className={`absolute left-3 ${template?.icons || "text-primary"}`} />
            </div>
        </div>
    );
}