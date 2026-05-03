"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaEdit, FaCheckSquare, FaRegSquare, FaArchive } from "react-icons/fa";
import { GripVertical } from "lucide-react";
import { SortableFoodCard } from "@/src/components/user_index/user_foods_cards/SortableFoodCard";

export function SortableRow({ food, context, onEdit, isSelectionMode, isSelected, onToggleSelect, template }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: food._id });

    const style = {
        transform: isDragging
            ? CSS.Transform.toString(transform)
            : CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex justify-between items-center transition-all 
                ${context ? "mb-0.5 rounded-xl" : ""} 
                ${isSelected ? `border-blue-500 bg-blue-50/50` : ``} 
                ${isDragging ? "shadow-xl opacity-80 rotate-1 scale-[1.02] z-50" : ""}`}
        >
            <div className={`w-full h-full relative flex border ${isSelected ? "border-red-500" : `border-transparent`} ${context ? "rounded-xl" : "rounded-lg"} ${context ? "bg-background" : ""} items-center`}>
                {isSelectionMode ? (
                    <div
                        onClick={() => onToggleSelect(food._id)}
                        className={`px-1 cursor-pointer text-gray-500 active:scale-90 transition-transform`}
                    >
                        {isSelected ? <FaCheckSquare size={18} /> : <FaRegSquare size={18} />}
                    </div>
                ) : (
                    <>
                        {
                            food.is_archived ? (
                                <div className="absolute top-0 left-0 bg-linear-to-r from-gray-900 to-background/20 text-gray-100 w-full h-full text-2xl px-3 py-3 rounded-lg z-20 font-bold flex items-end justify-start gap-1">
                                    <FaArchive />
                                    <span className="text-sm">Archivado</span>
                                </div>
                            ) : (
                                <GripVertical
                                    size={24}
                                    className={`mx-1 touch-none ${context ? "text-gray-700" : template?.textColor} cursor-grab active:cursor-grabbing`}
                                    {...attributes}
                                    {...listeners}
                                />
                            )
                        }
                    </>
                )}
                <SortableFoodCard
                    food={food}
                    context={!!context}
                    template={template}
                />
                {!isSelectionMode && (
                    <button
                        onClick={() => onEdit(food)}
                        className={`
                            ${context ? "static z-50 h-full bg-background/50 rounded-none" : `${template?.icons} ${template?.backgroundColor2}`
                            }
                            "w-fit h-fit text-lg p-2.5 ml-2 absolute top-2 right-2 z-30 active:scale-70 active:opacity-80 transition-transform duration-300 rounded-full flex items-center justify-center"`}
                    >
                        <FaEdit />
                    </button>
                )}
            </div>
        </div>
    );
}