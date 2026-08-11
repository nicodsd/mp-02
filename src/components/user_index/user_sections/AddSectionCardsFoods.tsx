import { useState } from "react";
import { ListPlus } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import ManageSectionsModal from "@/src/components/modals/ManageSectionsModal";

export default function AddSectionCardsFoods({ template, user, foods }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1">
            <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                <h2 className="text-xl font-normal">Administrar secciones</h2>
                <ListPlus className="w-5 h-5" />
            </div>
            <div
                onClick={() => setIsModalOpen(true)}
                className={`group cursor-pointer flex flex-col items-center justify-center h-fit py-1 w-full ${template?.backgroundColor2} hover:${template?.backgroundColor} border-2 border-dashed border-${template?.accentColors[0]} rounded-xl hover:bg-${template?.accentColors[0]} transition duration-300 ${template?.textColor}`}
            >
                <div className={`h-full w-full flex gap-1 justify-center transition-all duration-300 items-center ${template?.textColor}`}>
                    <FaPlus size={20} className={` ${template?.textColor} group-hover:text-white`} />
                </div>
            </div>

            {isModalOpen && (
                <ManageSectionsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={user}
                    foods={foods}
                    template={template}
                />
            )}
        </div>
    );
}