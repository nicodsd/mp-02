"use client";
import React, { useState, useEffect, useMemo } from "react";
import Loading from "@/src/skeleton/Loading";
import { FaEdit, FaTrash, FaCheckSquare, FaRegSquare, FaTimes } from "react-icons/fa";
import { URI } from "@/src/lib/const";
import EditFoodModal from "@/src/components/modals/EditFoodModal";
import { refreshPage } from "@/app/actions";
import { useFoodStore } from "@/src/lib/useFoodStore";
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

function SortableRow({ food, context, onEdit, isSelectionMode, isSelected, onToggleSelect, template }: any) {
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
            className={`flex justify-between items-center rounded-xl transition-all border bg-background}
                ${context ? "mb-1" : ""} 
                ${isSelected ? `border-${template?.accentColors[0]} bg-blue-50/50` : `${template?.border}`} 
                ${isDragging ? "shadow-xl opacity-80 rotate-1 scale-[1.02] z-50" : ""}`}
        >
            <div className="w-full h-full flex items-center">
                {isSelectionMode ? (
                    <div
                        onClick={() => onToggleSelect(food._id)}
                        className="px-1 cursor-pointer text-blue-600 active:scale-90 transition-transform"
                    >
                        {isSelected ? <FaCheckSquare size={20} /> : <FaRegSquare size={20} className={`${template?.textColor}`} />}
                    </div>
                ) : (
                    <GripVertical size={24} className={`mx-1 touch-none cursor-grab active:cursor-grabbing ${template?.textColor}`} {...attributes} {...listeners} />
                )}
                <SortableFoodCard
                    food={food}
                    context={!!context}
                    template={template}
                />

            </div>

            {context && !isSelectionMode && (
                <div className={`flex items-center justify-center h-full border-l ${template?.border} bg-gray-50/30 min-w-[60px]`}>
                    <button
                        onClick={() => onEdit(food)}
                        className={`p-3 ${template?.backgroundColor} border ${template?.border} rounded-full hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-90`}
                    >
                        <FaEdit size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function RenderSortCards({ foods: initialFoods, count, context, template }: any) {
    const { foods, setFoods, removeFoodLocal, reorderFoods } = useFoodStore();
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

        selectedIds.forEach(id => removeFoodLocal(id));

        try {
            await fetch(`${URI}foods/delete-multiple`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
                credentials: "include",
            });

            setSelectedIds([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error("Error en eliminación múltiple", error);
        }
    };

    useEffect(() => {
        if (initialFoods && foods.length === 0) {
            setFoods(initialFoods);
        }
    }, [initialFoods, setFoods, foods.length]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = foods.findIndex((f) => f._id === active.id);
            const newIndex = foods.findIndex((f) => f._id === over.id);

            const updatedFoods = arrayMove(foods, oldIndex, newIndex);
            setFoods(updatedFoods);

            const orderPayload = updatedFoods.map((f, index) => ({
                _id: f._id,
                order: index
            }));

            try {
                const response = await fetch(`${URI}foods/update-order`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ order: orderPayload }),
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`Error en servidor: ${response.status}`);
                }

                console.log("Orden guardado correctamente");
            } catch (error) {
                console.error("Error crítico en la petición:", error);
            }
        }
    };

    const selectAll = () => {
        setSelectedIds(platos.map(p => p._id));
    };

    return (
        <div className="w-full flex flex-col h-full relative">
            {context && (
                <div className="flex items-center justify-start py-2 sticky top-0 backdrop-blur-md z-20 mb-2 rounded-xl">
                    {!isSelectionMode ? (
                        <button
                            onClick={() => setIsSelectionMode(true)}
                            className="text-xs flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                        >
                            <FaRegSquare className={`${template?.textColor} text-base`} /> Seleccionar Platos
                        </button>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { setIsSelectionMode(false); setSelectedIds([]); }}
                                    className={`p-2 ${template?.textColor} hover:bg-gray-100 rounded-full`}
                                >
                                    <FaTimes size={16} />
                                </button>
                                <span className={`text-sm font-black ${template?.textColor}`}>
                                    {selectedIds.length} seleccionados
                                </span>
                            </div>

                            <button
                                onClick={handleBulkDelete}
                                disabled={selectedIds.length === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0
                                    ? `bg-${template?.accentColors[0]} ${template?.textColor} shadow-lg shadow-${template?.accentColors[0]}-200`
                                    : `bg-gray-200 text-gray-400 cursor-not-allowed`
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
                                    template={template}
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
                    template={template}
                />
            )}
        </div>
    );
}