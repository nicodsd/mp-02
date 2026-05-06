"use client";
import React from "react";
import { FaRegSquare, FaTimes, FaTrash } from "react-icons/fa";

interface SelectionToolbarProps {
    isSelectionMode: boolean;
    selectedCount: number;
    setIsSelectionMode: (mode: boolean) => void;
    onCancelSelection: () => void;
    onBulkDelete: () => void;
    template: any;
}

export const SelectionToolbar = ({
    isSelectionMode,
    selectedCount,
    setIsSelectionMode,
    onCancelSelection,
    onBulkDelete,
    template
}: SelectionToolbarProps) => {
    if (!isSelectionMode) {
        return (
            <div className="flex items-center justify-start py-1 sticky top-0 backdrop-blur-lg z-20 mb-1 rounded-xl">
                <button
                    onClick={() => setIsSelectionMode(true)}
                    className="text-xs flex text-gray-500 items-center gap-2 px-3 py-2 rounded-lg transition-all"
                >
                    <FaRegSquare className={`text-base text-gray-500`} /> Seleccionar para eliminar
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-start py-1 sticky top-0 backdrop-blur-md z-20 mb-1 rounded-xl">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onCancelSelection}
                        className={`p-2 hover:bg-gray-100 rounded-full`}
                    >
                        <FaTimes size={18} />
                    </button>
                    <span className={`text-sm`}>
                        {selectedCount} seleccionados
                    </span>
                </div>

                <button
                    onClick={onBulkDelete}
                    disabled={selectedCount === 0}
                    className={`flex items-center px-4 py-2 rounded-lg text-xs transition-all ${selectedCount > 0
                        ? `bg-primary text-white font-semibold cursor-pointer shadow`
                        : `bg-gray-200 text-gray-400 cursor-not-allowed`
                        }`}
                > Eliminar seleccionados
                </button>
            </div>
        </div>
    );
};