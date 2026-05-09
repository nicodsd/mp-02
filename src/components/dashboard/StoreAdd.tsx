"use client";
import React, { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import StoreAddModal from "@/src/components/modals/StoreAddModal";
import { SelectionToolbar } from "@/src/components/dashboard/SelectionToolbarStoreDelete";
import { SucursalCard } from "@/src/components/dashboard/SucursalCard";

export default function Sucursales({ menus, user_id }: { menus: any[], user_id: string }) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    let menusCount = (menus?.length || 0) + 1;

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCancel = () => {
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handleBulkDelete = () => {
        if (confirm(`¿Eliminar ${selectedIds.length} sucursales?`)) {
            console.log("Eliminando IDs:", selectedIds);
            // Aquí llamarías a tu action o API
            handleCancel();
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <StoreAddModal
                isOpen={isOpenModal}
                menusCount={menusCount}
                user_id={user_id}
                setIsOpen={setIsOpenModal}
            />

            <div className="p-3 flex h-full w-full flex-col gap-2">
                <header className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-800">Sucursales</h1>
                    <p className="text-gray-500 text-sm">Agrega y gestiona tus menús para tus diferentes sucursales.</p>
                </header>

                <div>
                    {/* Toolbar con el estilo referenciado */}
                    <SelectionToolbar
                        isSelectionMode={isSelectionMode}
                        selectedCount={selectedIds.length}
                        setIsSelectionMode={setIsSelectionMode}
                        onCancelSelection={handleCancel}
                        onBulkDelete={handleBulkDelete}
                    />

                    <div className="gap-4 grid grid-cols-2 px-2 py-2">
                        {menus?.map((m) => (
                            <SucursalCard
                                key={m._id}
                                m={m}
                                isSelected={selectedIds.includes(m._id)}
                                isSelectionMode={isSelectionMode}
                                onToggle={toggleSelection}
                            />
                        ))}

                        {/* El botón de agregar solo aparece si no estamos eliminando */}
                        {!isSelectionMode && (
                            <button
                                onClick={() => setIsOpenModal(true)}
                                className="flex flex-col h-50 items-center justify-center gap-2 border-2 border-dashed bg-red-50 border-primary rounded-xl hover:bg-gray-50 transition-colors text-gray-400"
                            >
                                <div className="bg-primary p-2 rounded-full text-white shadow-lg">
                                    <HiOutlinePlus size={24} />
                                </div>
                                <span className="text-lg font-bold text-gray-600">Nuevo menú</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}