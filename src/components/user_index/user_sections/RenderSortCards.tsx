"use client";
import React, { useState, useEffect, useMemo } from "react";
import { refreshPage } from "@/app/actions";
import { URI } from "@/src/lib/const";
import EditFoodModal from "@/src/components/modals/EditFoodModal";
import { useFoodStore } from "@/src/lib/useFoodStore";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

// Importamos los nuevos componentes
import { SelectionToolbar } from "@/src/components/dashboard/components/dishComponents/SelectionToolbar";
import { SortableRow } from "@/src/components/dashboard/components/dishComponents/SortableRow";

export default function RenderSortCards({ foods: initialFoods, count, user, context, template }: any) {
    const { foods, setFoods, removeFoodLocal } = useFoodStore();
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedFood, setSelectedFood] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Configuración de sensores
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Filtrado de platos
    const platos = useMemo(() =>
        foods.filter(f => f.sub_category !== "Bebidas" && f.sub_category !== "Postres"),
        [foods]);

    useEffect(() => {
        if (initialFoods) setFoods(initialFoods);
    }, [initialFoods, setFoods]);

    const toggleSelect = (id: string) => {
        if (window.navigator.vibrate) window.navigator.vibrate(10);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0 || !confirm(`¿Eliminar ${selectedIds.length} ítems?`)) return;

        selectedIds.forEach(id => removeFoodLocal(id));
        console.log(selectedIds)
        try {
            await fetch(`${URI}/foods/delete-multiple`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
                credentials: "include",
            });
            refreshPage();
            setSelectedIds([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error("Error delete", error);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = platos.findIndex((f) => f._id === active.id);
            const newIndex = platos.findIndex((f) => f._id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const updatedPlatos = arrayMove(platos, oldIndex, newIndex);

                let platoIndex = 0;
                const updatedFoods = foods.map((f) => {
                    if (f.sub_category !== "Bebidas" && f.sub_category !== "Postres") {
                        return updatedPlatos[platoIndex++];
                    }
                    return f;
                });

                setFoods(updatedFoods);

                try {
                    const response = await fetch(`${URI}/foods/update-order`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order: updatedFoods.map((f, i) => ({ _id: f._id, order: i })) }),
                        credentials: "include",
                    });
                    if (response.status === 200) {
                        refreshPage();
                    }
                } catch (error) {
                    console.error("Error order", error);
                }
            }
        }
    };

    return (
        <div className="w-full flex flex-col h-full relative">
            {context && foods.length > 0 && (
                <SelectionToolbar
                    isSelectionMode={isSelectionMode}
                    selectedCount={selectedIds.length}
                    setIsSelectionMode={setIsSelectionMode}
                    onCancelSelection={() => { setIsSelectionMode(false); setSelectedIds([]); }}
                    onBulkDelete={handleBulkDelete}
                    template={template}
                />
            )}

            <div className={`flex flex-col overflow-y-auto overflow-x-hidden ${context ? "p-1 xl:grid lg:grid-cols-2 lg:gap-0.5" : ""} rounded-xl`}>
                {foods.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <span className={`text-center ${context ? "text-gray-800 py-30" : template?.textColor} py-20`}>No hay platos que mostrar</span>
                    </div>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={platos.map(f => f._id)} strategy={verticalListSortingStrategy}>
                            {platos.map((food) => (
                                <SortableRow
                                    user={user}
                                    key={food._id}
                                    food={food}
                                    context={context}
                                    template={template}
                                    isSelectionMode={isSelectionMode}
                                    isSelected={selectedIds.includes(food._id)}
                                    onToggleSelect={toggleSelect}
                                    onEdit={(f: any) => { setSelectedFood(f); setIsEditOpen(true); }}
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