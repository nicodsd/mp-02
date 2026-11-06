"use client";
import React, { useState, useEffect, useMemo, useId } from "react";
import { refreshPage } from "@/app/actions";
import { URI } from "@/src/lib/const";
import EditFoodModal from "@/src/components/modals/EditFoodModal";
import { useFoodStore } from "@/src/lib/useFoodStore";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, rectSortingStrategy } from "@dnd-kit/sortable";
import { FoodCategoryIcon, getCategoryIconFromFoods } from "@/src/components/icons/foods";

// Importamos los componentes
import { SelectionToolbar } from "@/src/components/dashboard/components/dishComponents/SelectionToolbar";
import { SortableRow } from "@/src/components/dashboard/components/dishComponents/SortableRow";

export type SortOption =
    | "category"
    | "category_asc"
    | "category_desc"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";

const CATEGORY_BADGE_STYLES = [
    "bg-orange-100/80 text-orange-600 border-orange-200/60",
    "bg-teal-100/80 text-teal-600 border-teal-200/60",
    "bg-indigo-100/80 text-indigo-600 border-indigo-200/60",
    "bg-amber-100/80 text-amber-600 border-amber-200/60",
    "bg-rose-100/80 text-rose-600 border-rose-200/60",
];

function getEffectivePrice(food: any): number {
    if (food?.is_promo && food?.promo_price !== undefined && food?.promo_price !== null && Number(food.promo_price) > 0) {
        return Number(food.promo_price);
    }
    return Number(food?.price) || 0;
}

export default function RenderSortCards({
    foods: initialFoods,
    count,
    user,
    context,
    template,
    sortBy = "category",
    onResetSort,
}: {
    foods: any[];
    count?: number;
    user: any;
    context?: boolean;
    template?: any;
    sortBy?: SortOption;
    onResetSort?: () => void;
}) {
    const dndContextId = useId();
    const { foods: storeFoods, setFoods, removeFoodLocal, refreshPanelData } = useFoodStore();
    const [foods, setLocalFoods] = useState<any[]>(initialFoods || []);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedFood, setSelectedFood] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Configuración de sensores para Drag & Drop
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (initialFoods) setLocalFoods(initialFoods);
    }, [initialFoods]);

    const toggleSelect = (id: string) => {
        if (typeof window !== "undefined" && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
        setSelectedIds((prev) => {
            const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
            if (next.length > 0 && !isSelectionMode) {
                setIsSelectionMode(true);
            }
            return next;
        });
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0 || !confirm(`¿Eliminar ${selectedIds.length} ítems?`)) return;

        setLocalFoods((prev) => prev.filter((f) => !selectedIds.includes(f._id)));
        selectedIds.forEach((id) => removeFoodLocal(id));
        try {
            await fetch(`${URI}/foods/delete-multiple`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
                credentials: "include",
            });
            await refreshPanelData();
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
            const oldIndex = foods.findIndex((f) => f._id === active.id);
            const newIndex = foods.findIndex((f) => f._id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const updatedFoods = arrayMove(foods, oldIndex, newIndex);
                setLocalFoods(updatedFoods);

                // Sincronizar también el orden en la lista global del store
                const storeOldIdx = storeFoods.findIndex((f) => f._id === active.id);
                const storeNewIdx = storeFoods.findIndex((f) => f._id === over.id);
                const fullOrderFoods =
                    storeOldIdx !== -1 && storeNewIdx !== -1
                        ? arrayMove(storeFoods, storeOldIdx, storeNewIdx)
                        : updatedFoods;
                if (storeOldIdx !== -1 && storeNewIdx !== -1) {
                    setFoods(fullOrderFoods);
                }

                if (sortBy.startsWith("price") || sortBy.startsWith("name")) {
                    onResetSort?.();
                }

                try {
                    const response = await fetch(`${URI}/foods/update-order`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            order: fullOrderFoods.map((f, i) => ({ _id: f._id, order: i })),
                        }),
                        credentials: "include",
                    });
                    if (response.status === 200) {
                        await refreshPanelData();
                        refreshPage();
                    }
                } catch (error) {
                    console.error("Error order", error);
                }
            }
        }
    };

    // Agrupación y ordenamiento por categoría para el panel de control (context === true)
    const groupedCategories = useMemo(() => {
        if (!context) return [];

        const map = new Map<string, any[]>();
        foods.forEach((food) => {
            const catName = food?.sub_category?.trim() || "Sin categoría";
            if (!map.has(catName)) {
                map.set(catName, []);
            }
            map.get(catName)!.push(food);
        });

        let entries = Array.from(map.entries()).map(([categoryName, items]) => {
            const sortedItems = [...items];
            if (sortBy === "price_asc") {
                sortedItems.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
            } else if (sortBy === "price_desc") {
                sortedItems.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
            } else if (sortBy === "name_asc") {
                sortedItems.sort((a, b) => (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" }));
            } else if (sortBy === "name_desc") {
                sortedItems.sort((a, b) => (b.name || "").localeCompare(a.name || "", "es", { sensitivity: "base" }));
            }
            return { categoryName, items: sortedItems };
        });

        if (sortBy === "category_asc") {
            entries.sort((a, b) => a.categoryName.localeCompare(b.categoryName, "es", { sensitivity: "base" }));
        } else if (sortBy === "category_desc") {
            entries.sort((a, b) => b.categoryName.localeCompare(a.categoryName, "es", { sensitivity: "base" }));
        }

        return entries;
    }, [foods, context, sortBy]);

    if (context) {
        return (
            <div className="w-full min-w-0 flex flex-col h-full relative z-10">
                {foods.length > 0 && (
                    <SelectionToolbar
                        isSelectionMode={isSelectionMode || selectedIds.length > 0}
                        selectedCount={selectedIds.length}
                        setIsSelectionMode={setIsSelectionMode}
                        onCancelSelection={() => {
                            setIsSelectionMode(false);
                            setSelectedIds([]);
                        }}
                        onBulkDelete={handleBulkDelete}
                        template={template}
                    />
                )}

                <div className="flex flex-col gap-5 overflow-y-auto overflow-x-hidden pt-3 md:p-2 rounded-xl w-full min-w-0">
                    {foods.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <span className="text-center text-gray-600 py-24 text-sm font-medium">
                                No hay platos que mostrar
                            </span>
                        </div>
                    ) : (
                        <DndContext id={dndContextId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            {groupedCategories.map(({ categoryName, items }, idx) => {
                                const categoryIcon = getCategoryIconFromFoods(items, categoryName);
                                const badgeStyle = CATEGORY_BADGE_STYLES[idx % CATEGORY_BADGE_STYLES.length];

                                return (
                                    <section key={categoryName} className="flex flex-col gap-1 w-full min-w-0">
                                        {/* Encabezado de la categoría */}
                                        <div className="flex items-center gap-2.5 px-1">
                                            <div className={`w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 ${badgeStyle}`}>
                                                <FoodCategoryIcon
                                                    iconName={categoryIcon}
                                                    categoryName={categoryName}
                                                    size={15}
                                                />
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-lg md:text-lg font-semibold text-gray-500">
                                                    {categoryName}
                                                </h3>
                                                <span className="text-xs font-medium text-gray-400">
                                                    {items.length} {items.length === 1 ? "plato" : "platos"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Lista de platos: Alineados verticalmente en cascada */}
                                        <SortableContext
                                            items={items.map((f) => f._id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="flex flex-col w-full min-w-0 bg-background/95 border border-gray-200/90 rounded-xl overflow-hidden shadow-2xs">
                                                {items.map((food, itemIdx) => (
                                                    <SortableRow
                                                        user={user}
                                                        key={food._id}
                                                        food={food}
                                                        context={true}
                                                        template={template}
                                                        isSelectionMode={isSelectionMode || selectedIds.length > 0}
                                                        isSelected={selectedIds.includes(food._id)}
                                                        onToggleSelect={toggleSelect}
                                                        onEdit={(f: any) => {
                                                            setSelectedFood(f);
                                                            setIsEditOpen(true);
                                                        }}
                                                        isLast={itemIdx === items.length - 1}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </section>
                                );
                            })}
                        </DndContext>
                    )}
                </div>

                {selectedFood && (
                    <EditFoodModal
                        user={user}
                        isOpen={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                        food={selectedFood}
                        onUpdate={() => refreshPage()}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col h-full relative">
            <div className="flex flex-col overflow-y-auto overflow-x-hidden rounded-xl">
                {foods.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <span className={`text-center ${template?.textColor} py-20`}>No hay platos que mostrar</span>
                    </div>
                ) : (
                    <DndContext id={dndContextId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={foods.map((f) => f._id)} strategy={verticalListSortingStrategy}>
                            {foods.map((food) => (
                                <SortableRow
                                    user={user}
                                    key={food._id}
                                    food={food}
                                    context={false}
                                    template={template}
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
                    user={user}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    food={selectedFood}
                    onUpdate={() => refreshPage()}
                />
            )}
        </div>
    );
}
