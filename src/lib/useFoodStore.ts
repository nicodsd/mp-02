import { create } from 'zustand';

interface FoodStore {
    foods: any[];
    setFoods: (foods: any[]) => void;
    updateFood: (updatedFood: any) => void;
    removeFoodLocal: (foodId: string) => void; // Para ocultarlo de la lista
    updatePromo: (foodId: string | number, is_promo: boolean, promo_price: number) => void;
}

export const useFoodStore = create<FoodStore>((set) => ({
    foods: [],
    setFoods: (foods) => set({ foods }),
    updateFood: (updatedFood) =>
        set((state) => ({
            foods: state.foods.map((f) => (f._id === updatedFood._id ? updatedFood : f)),
        })),
    removeFoodLocal: (foodId) =>
        set((state) => ({
            foods: state.foods.filter((f) => f._id !== foodId),
        })),
    // Agrega esto a tu FoodStore
    updatePromo: (foodId: string | number, is_promo: boolean, promo_price: number) =>
        set((state) => ({
            foods: state.foods.map((f) =>
                f._id === foodId ? { ...f, is_promo, promo_price } : f
            ),
        })),
}));
