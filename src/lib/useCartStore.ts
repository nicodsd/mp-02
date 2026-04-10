import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
    selectedIds: string[];
    quantities: Record<string, number>;
    addId: (id: string | number) => void;
    removeId: (id: string | number) => void;
    clearCart: () => void;
    incrementQuantity: (id: string | number) => void;
    decrementQuantity: (id: string | number) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            selectedIds: [],
            quantities: {},
            addId: (id) => set((state) => {
                const strId = String(id);
                if (state.selectedIds.includes(strId)) {
                    return {
                        quantities: { ...state.quantities, [strId]: (state.quantities[strId] || 1) + 1 }
                    };
                }
                return {
                    selectedIds: [...state.selectedIds, strId],
                    quantities: { ...state.quantities, [strId]: 1 }
                };
            }),
            removeId: (id) => set((state) => {
                const strId = String(id);
                const newQuantities = { ...state.quantities };
                delete newQuantities[strId];
                return {
                    selectedIds: state.selectedIds.filter(selectedId => selectedId !== strId),
                    quantities: newQuantities
                };
            }),
            clearCart: () => set({ selectedIds: [], quantities: {} }),
            incrementQuantity: (id) => set((state) => {
                const strId = String(id);
                if (!state.selectedIds.includes(strId)) return state;
                return {
                    quantities: { ...state.quantities, [strId]: (state.quantities[strId] || 1) + 1 }
                };
            }),
            decrementQuantity: (id) => set((state) => {
                const strId = String(id);
                if (!state.selectedIds.includes(strId)) return state;
                const newQuantity = (state.quantities[strId] || 1) - 1;
                if (newQuantity <= 0) {
                    const newQuantities = { ...state.quantities };
                    delete newQuantities[strId];
                    return {
                        selectedIds: state.selectedIds.filter(selectedId => selectedId !== strId),
                        quantities: newQuantities
                    };
                }
                return {
                    quantities: { ...state.quantities, [strId]: newQuantity }
                };
            }),
        }),
        {
            name: 'cart-storage', // key for localStorage
        }
    )
);
