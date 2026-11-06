"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaEdit, FaCheckSquare, FaRegSquare, FaArchive } from "react-icons/fa";
import { GripVertical, Pencil } from "lucide-react";
import { SortableFoodCard } from "@/src/components/user_index/user_foods_cards/SortableFoodCard";

export function SortableRow({ food, user, context, onEdit, isSelectionMode, isSelected, onToggleSelect, template, isLast }: any) {
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

    if (context) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`flex justify-between items-center transition-all w-full
                    bg-background/95 hover:bg-white
                    ${!isLast ? "border-b border-gray-100" : ""}
                    ${isSelected ? "bg-orange-50/60" : ""}
                    ${isDragging ? "shadow-xl opacity-90 scale-[1.01] z-50 rounded-xl ring-2 ring-orange-400/50 bg-white" : ""}`}
            >
                <div className="w-full min-w-0 h-full relative flex items-center px-1.5 md:px-3 py-0">
                    <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
                        {!food.is_archived && (
                            <button
                                type="button"
                                aria-label="Reordenar plato"
                                className={`${isSelectionMode ? "hidden md:inline-flex" : "inline-flex"} p-1 touch-none text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing transition-colors`}
                                {...attributes}
                                {...listeners}
                            >
                                <GripVertical size={18} />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onToggleSelect(food._id)}
                            aria-label="Seleccionar plato"
                            className={`${isSelectionMode ? "inline-flex" : "hidden md:inline-flex"} p-1 cursor-pointer transition-transform active:scale-90 ${isSelected ? "text-orange-500" : "text-gray-300 hover:text-gray-500"}`}
                        >
                            {isSelected ? <FaCheckSquare size={16} /> : <FaRegSquare size={16} />}
                        </button>
                    </div>

                    <SortableFoodCard
                        user={user}
                        food={food}
                        context={true}
                        template={template}
                    />

                    <div className="flex items-center shrink-0 pl-1 md:pl-2">
                        <button
                            type="button"
                            onClick={() => onEdit(food)}
                            title="Editar plato"
                            className="p-1.5 md:p-2 border border-gray-200 bg-background hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg active:scale-90 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                        >
                            <Pencil size={14} className="md:w-3.75 md:h-3.75" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex justify-between items-center transition-all 
                ${isSelected ? `border-blue-500 bg-blue-50/50` : ``} 
                ${isDragging ? "shadow-xl opacity-80 rotate-1 scale-[1.02] z-50" : ""}`}
        >
            <div className={`w-full h-full relative flex border ${isSelected ? "border-red-500" : `border-transparent`} rounded-lg items-center`}>
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
                                <div className={`absolute top-0 left-0 w-full h-full text-2xl px-3 py-3 rounded-lg z-20 font-bold flex items-end justify-start gap-2 ${template?.textColor} bg-slate-400/60`}>
                                    <FaArchive />
                                    <span className="text-lg leading-none">Este plato no será visible</span>
                                </div>
                            ) : (
                                <GripVertical
                                    size={24}
                                    className={`mx-1 touch-none ${template?.textColor} cursor-grab active:cursor-grabbing`}
                                    {...attributes}
                                    {...listeners}
                                />
                            )
                        }
                    </>
                )}
                <SortableFoodCard
                    user={user}
                    food={food}
                    context={false}
                    template={template}
                />
                {!isSelectionMode && (
                    <button
                        onClick={() => onEdit(food)}
                        className={`${template?.icons} ${template?.backgroundColor2} w-fit h-fit text-lg p-2.5 ml-2 absolute top-2 right-2 z-30 active:scale-70 active:opacity-80 transition-transform duration-300 rounded-full flex items-center justify-center`}
                    >
                        <FaEdit />
                    </button>
                )}
            </div>
        </div>
    );
}
