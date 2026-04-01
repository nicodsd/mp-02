"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Loading from "@/src/skeleton/Loading";
import { FaEdit, FaTrash, FaCheckSquare, FaRegSquare, FaTimes } from "react-icons/fa";
import { URI } from "@/src/lib/const";
import EditFoodModal from "@/src/components/modals/EditFoodModal";
import { refreshPage } from "@/app/actions";
import { useFoodStore } from "@/src/lib/useFoodStore";

// DND Kit Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableFoodCard } from "@/src/components/user_index/user_foods_cards/SortableFoodCard";
import { GripVertical } from "lucide-react";

// --- Sub-componente de Fila ---
function SortableRow({ food, context, onEdit, isSelectionMode, isSelected, onToggleSelect }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: food._id });

    const style = {
        // Cambiamos Translate por Transform para mayor suavidad en el renderizado
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex justify-between items-center rounded-xl transition-all border bg-white
                ${context ? "mb-1" : ""} 
                ${isSelected ? "border-blue-500 bg-blue-50/50" : "border-gray-200"} 
                ${isDragging ? "shadow-xl opacity-80 rotate-1 scale-[1.02] z-50" : ""}`}
        >
            <div className="w-full h-full flex items-center">
                {/* 1. CHECKBOX O GRIP */}
                {isSelectionMode ? (
                    <div
                        onClick={() => onToggleSelect(food._id)}
                        className="pl-4 pr-2 cursor-pointer text-blue-600 active:scale-90 transition-transform"
                    >
                        {isSelected ? <FaCheckSquare size={22} /> : <FaRegSquare size={22} className="text-gray-300" />}
                    </div>
                ) : (
                    /* MANIJA DE ARRASTRE: Solo habilitada si no hay selección */
                    <GripVertical className="w-6 h-6 mr-1 touch-none cursor-grab active:cursor-grabbing" {...attributes} {...listeners} />
                )}

                {/* 2. CARD (Contenido visual) */}
                <SortableFoodCard
                    food={food}
                    context={!!context}
                />
            </div>

            {/* 3. ACCIONES */}
            {context && !isSelectionMode && (
                <div className="flex items-center justify-center px-4 h-full border-l border-gray-100 bg-gray-50/30 min-w-[80px]">
                    <button
                        onClick={() => onEdit(food)}
                        className="p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-90"
                    >
                        <FaEdit size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function RenderSortCards({ foods: initialFoods, count, context }: any) {
    const { foods, setFoods, removeFoodLocal } = useFoodStore();

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [selectedFood, setSelectedFood] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const platos = useMemo(() =>
        foods.filter(f => f.category !== "Bebidas" && f.category !== "Postres"),
        [foods]);

    useEffect(() => {
        if (initialFoods) setFoods(initialFoods);
    }, [initialFoods, setFoods]);

    const toggleSelect = (id: string) => {
        if (window.navigator.vibrate) window.navigator.vibrate(10);
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        const confirmDelete = confirm(`¿Estás seguro de eliminar ${selectedIds.length} ítems?`);
        if (!confirmDelete) return;

        // Eliminación local optimista
        selectedIds.forEach(id => removeFoodLocal(id));

        try {
            // Aquí deberías tener un endpoint en tu backend que acepte un array de IDs
            await fetch(`${URI}foods/delete-multiple`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
                credentials: "include",
            });

            // Limpiar estados
            setSelectedIds([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error("Error en eliminación múltiple", error);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = foods.findIndex((f) => f._id === active.id);
            const newIndex = foods.findIndex((f) => f._id === over.id);
            setFoods(arrayMove(foods, oldIndex, newIndex));
        }
    };

    const selectAll = () => {
        setSelectedIds(platos.map(p => p._id));
    };

    return (
        <div className="w-full flex flex-col h-full relative">
            {context && (
                <div className="flex items-center justify-between p-2 sticky top-0 bg-white/80 backdrop-blur-md z-20 mb-2 rounded-xl border border-gray-100 shadow-sm">
                    {!isSelectionMode ? (
                        <button
                            onClick={() => setIsSelectionMode(true)}
                            className="text-xs font-bold flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                        >
                            <FaCheckSquare className="text-gray-500" /> Seleccionar platos
                        </button>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { setIsSelectionMode(false); setSelectedIds([]); }}
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                >
                                    <FaTimes size={18} />
                                </button>
                                <span className="text-sm font-black text-blue-600">
                                    {selectedIds.length} seleccionados
                                </span>
                            </div>

                            <button
                                onClick={handleBulkDelete}
                                disabled={selectedIds.length === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0
                                    ? "bg-red-500 text-white shadow-lg shadow-red-200"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                <FaTrash /> Eliminar seleccionados
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {foods.length === 0 ? (
                    <Loading count={count ?? 4} />
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={platos.map((f) => f._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {platos.map((food: any) => (
                                <SortableRow
                                    key={food._id}
                                    food={food}
                                    context={context}
                                    isSelectionMode={isSelectionMode}
                                    isSelected={selectedIds.includes(food._id)}
                                    onToggleSelect={toggleSelect}
                                    onEdit={(f: any) => {
                                        setSelectedFood(f);
                                        setIsEditOpen(true);
                                    }}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {selectedFood && (
                <EditFoodModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    food={selectedFood}
                    onUpdate={() => refreshPage()}
                />
            )}
        </div>
    );
}