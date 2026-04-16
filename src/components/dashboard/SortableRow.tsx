"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaEdit, FaCheckSquare, FaRegSquare } from "react-icons/fa";
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
            className={`flex justify-between items-center rounded-lg transition-all border bg-background border-gray-300
                ${context ? "mb-1" : ""} 
                ${isSelected ? `border-blue-500 bg-blue-50/50` : ``} 
                ${isDragging ? "shadow-xl opacity-80 rotate-1 scale-[1.02] z-50" : ""}`}
        >
            <div className="w-full h-full flex items-center">
                {isSelectionMode ? (
                    <div
                        onClick={() => onToggleSelect(food._id)}
                        className="px-2 cursor-pointer text-blue-600 active:scale-90 transition-transform"
                    >
                        {isSelected ? <FaCheckSquare size={20} /> : <FaRegSquare size={20} className={`${template?.textColor}`} />}
                    </div>
                ) : (
                    <GripVertical
                        size={24}
                        className={`mx-1 touch-none cursor-grab active:cursor-grabbing ${template?.textColor}`}
                        {...attributes}
                        {...listeners}
                    />
                )}
                <SortableFoodCard
                    food={food}
                    context={!!context}
                    template={template}
                />
            </div>

            {context && !isSelectionMode && (
                <div className="flex items-center text-blue-600 justify-center h-full border-gray-200 bg-gray-50/30 min-w-[60px]">
                    <button
                        onClick={() => onEdit(food)}
                        className={`p-3 ${template?.backgroundColor} border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-90`}
                    >
                        <FaEdit size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}