"use client";
import React, { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { URI } from "@/src/lib/const";
import StoreAddModal from "@/src/components/modals/StoreAddModal";
import StoreEditModal from "@/src/components/modals/StoreEditModal";
import { SelectionToolbar } from "@/src/components/dashboard/components/storeComponents/SelectionToolbarStoreDelete";
import { SucursalCard } from "@/src/components/dashboard/components/storeComponents/SucursalCard";
import { refreshPage } from "@/app/actions";
import SelectStoreModal from "./components/storeComponents/SelectStoreModal";

export default function Sucursales({ menus, user_id, user }: { menus: any[], user_id: string, user: any }) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [openSelectStore, setOpenSelectStore] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [storeId, setStoreId] = useState("");
    const [menu, setMenu] = useState<any>({});
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    let menusCount = (menus?.length || 0) + 1;

    //console.log("menus", menus);
    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCancel = () => {
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handleEditStore = async () => {
        setOpenSelectStore(false);
        setIsEditModalOpen(true);
    };

    const handleBulkDelete = async () => {
        if (confirm(`¿Eliminar ${selectedIds.length} sucursales?`)) {
            try {
                const res = await fetch(`${URI}/menu/delete-menus/${selectedIds}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Error al eliminar');
                const data = await res.json();
                if (data.success) {
                    alert("Menús eliminados correctamente");
                    await refreshPage();
                }
            } catch (error) {
                console.error(error);
            }
            handleCancel();
        }
    }

    const handleSelectStore = (storeId: string) => {
        setStoreId(storeId);
        setMenu(menus.find((m: any) => m._id === storeId));
        setOpenSelectStore(true);
    }

    const handleDeleteSingleStore = async () => {
        if (confirm(`¿Eliminar la sucursal actual?`)) {
            try {
                const res = await fetch(`${URI}/menu/delete-menus/${storeId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Error al eliminar');
                const data = await res.json();
                if (data.success) {
                    alert("Menú eliminado correctamente");
                    setOpenSelectStore(false);
                    await refreshPage();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <StoreAddModal
                isOpen={isOpenModal}
                menusCount={menusCount}
                user_id={user_id}
                setIsOpen={setIsOpenModal}
            />

            {openSelectStore && (
                <SelectStoreModal
                    isOpen={openSelectStore}
                    storeId={storeId}
                    menu={menu}
                    user={user}
                    onClose={() => setOpenSelectStore(false)}
                    handleBulkDelete={handleDeleteSingleStore}
                    handleEditStore={handleEditStore}
                />
            )}

            <div className="p-3 flex h-full w-full flex-col gap-2">
                <header className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-800">Sucursales</h1>
                    <p className="text-gray-500 text-sm">Agrega y gestiona tus menús para tus diferentes sucursales.</p>
                </header>

                <div>
                    <SelectionToolbar
                        isSelectionMode={isSelectionMode}
                        selectedCount={selectedIds.length}
                        setIsSelectionMode={setIsSelectionMode}
                        onCancelSelection={handleCancel}
                        onBulkDelete={handleBulkDelete}
                    />

                    <div className="gap-4 grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 py-2">

                        {menus?.map((m) => (
                            !isSelectionMode ? (
                                <div key={m._id} onClick={() => handleSelectStore(m._id)}>
                                    <SucursalCard
                                        m={m}
                                        isSelected={selectedIds.includes(m._id)}
                                        isSelectionMode={isSelectionMode}
                                        onToggle={toggleSelection}
                                    />
                                </div>)
                                :
                                (
                                    <SucursalCard
                                        m={m}
                                        isSelected={selectedIds.includes(m._id)}
                                        isSelectionMode={isSelectionMode}
                                        onToggle={toggleSelection}
                                    />
                                )
                        ))}

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
            {isEditModalOpen && (
                <StoreEditModal
                    user_id={user_id}
                    menu={menu}
                    isOpen={isEditModalOpen}
                    setIsOpen={setIsEditModalOpen}
                />
            )}
        </div>
    );
}