import { create } from 'zustand';

interface FoodStore {
    foods: any[];
    setFoods: (foods: any[]) => void;
    updateFood: (updatedFood: any) => void;
    removeFoodLocal: (foodId: string) => void; // Para ocultarlo de la lista
    updatePromo: (foodId: string | number, is_promo: boolean, promo_price: number) => void;
    updateArchive: (foodId: string | number, is_archived: boolean) => void;
    reorderFoods: (newOrder: any[]) => void;
}

export const useFoodStore = create<FoodStore>((set) => ({
    foods: [],
    setFoods: (foods) => set({ foods }),
    reorderFoods: (newOrder: any[]) => set({ foods: newOrder }),
    updateFood: (updatedFood) =>
        set((state) => ({
            foods: state.foods.map((f) => (f._id === updatedFood._id ? updatedFood : f)),
        })),
    removeFoodLocal: (foodId) =>
        set((state) => ({
            foods: state.foods.filter((f) => f._id !== foodId),
        })),
    updatePromo: (foodId: string | number, is_promo: boolean, promo_price: number) =>
        set((state) => ({
            foods: state.foods.map((f) =>
                f._id === foodId ? { ...f, is_promo, promo_price } : f
            ),
        })),
    updateArchive: (foodId: string | number, is_archived: boolean) =>
        set((state) => ({
            foods: state.foods.map((f) =>
                f._id === foodId ? { ...f, is_archived } : f
            ),
        })),
}));
