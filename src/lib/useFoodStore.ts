import { create } from 'zustand';
import { URI } from '@/src/lib/const';

export interface AnalyticsData {
    visits: number;
    topDishes: string[];
}

interface FoodStore {
    user: any | null;
    token: string;
    foods: any[];
    menus: any[];
    analytics: AnalyticsData;
    loadedUserId: string | null;
    isInitialized: boolean;
    needsRefresh: boolean;
    isLoadingPanel: boolean;

    fetchPanelData: (user: any, token: string, force?: boolean) => Promise<void>;
    refreshPanelData: () => Promise<void>;
    markNeedsRefresh: () => void;
    clearPanelStore: () => void;

    setUser: (user: any) => void;
    updateUserLocal: (partialUser: Record<string, any>) => void;
    setMenus: (menus: any[]) => void;
    setFoods: (foods: any[]) => void;
    updateFood: (updatedFood: any) => void;
    removeFoodLocal: (foodId: string) => void; // Para ocultarlo de la lista
    updatePromo: (foodId: string | number, is_promo: boolean, promo_price: number) => void;
    updateArchive: (foodId: string | number, is_archived: boolean) => void;
    reorderFoods: (newOrder: any[]) => void;
}

const initialAnalytics: AnalyticsData = {
    visits: 0,
    topDishes: [],
};

export const useFoodStore = create<FoodStore>((set, get) => ({
    user: null,
    token: "",
    foods: [],
    menus: [],
    analytics: initialAnalytics,
    loadedUserId: null,
    isInitialized: false,
    needsRefresh: false,
    isLoadingPanel: false,

    fetchPanelData: async (user, token, force = false) => {
        const userId = user?.id || user?._id;
        if (!userId) return;

        const state = get();

        // Si ya tenemos los datos cargados para este usuario y no hubo cambios, no repetimos la petición
        if (
            state.isInitialized &&
            !state.needsRefresh &&
            !force &&
            state.loadedUserId === String(userId)
        ) {
            if (!state.user && user) {
                set({ user, token: token || state.token });
            }
            return;
        }

        // Evitar peticiones duplicadas simultáneas en la carga inicial
        if (state.isLoadingPanel && !force) {
            return;
        }

        set({
            isLoadingPanel: true,
            user: state.user && state.loadedUserId === String(userId) ? { ...user, ...state.user } : user,
            token: token || state.token,
        });

        try {
            const effectiveToken = token || state.token;
            const currentUser = get().user || user;

            const [foodsRes, menusRes, analyticsRes] = await Promise.all([
                fetch(`${URI}/foods?user_id=${userId}`, {
                    credentials: "include",
                }).catch(() => null),
                fetch(`${URI}/menu/get-menus/${userId}`, {
                    credentials: "include",
                }).catch(() => null),
                effectiveToken && currentUser?.plan !== "free"
                    ? fetch(`${URI}/analytics`, {
                        credentials: "include",
                    }).catch(() => null)
                    : Promise.resolve(null),
            ]);

            let fetchedFoods = get().foods;
            if (foodsRes && foodsRes.ok) {
                const foodsData = await foodsRes.json().catch(() => null);
                if (Array.isArray(foodsData?.foods)) {
                    const belongsToUser = foodsData.foods
                        .map((food: any) => String(food?.user_id))
                        .includes(String(userId));
                    fetchedFoods = belongsToUser ? foodsData.foods : [];
                } else {
                    fetchedFoods = [];
                }
            }

            let fetchedMenus = get().menus;
            let centralMenuData: Record<string, any> | null = null;
            if (menusRes && menusRes.ok) {
                const menusData = await menusRes.json().catch(() => null);
                if (Array.isArray(menusData?.menus)) {
                    fetchedMenus = menusData.menus;
                    const central =
                        menusData.menus.find((m: any) => m.menuEnlisted === 0) ||
                        menusData.menus[0];
                    if (central) {
                        const { _id, ...restCentral } = central;
                        centralMenuData = restCentral;
                    }
                }
            }

            let fetchedAnalytics = get().analytics;
            if (analyticsRes && analyticsRes.ok) {
                const analyticsData = await analyticsRes.json().catch(() => null);
                if (analyticsData?.success && analyticsData?.analytics) {
                    fetchedAnalytics = analyticsData.analytics;
                }
            }

            set((prev) => ({
                foods: fetchedFoods,
                menus: fetchedMenus,
                analytics: fetchedAnalytics,
                user: centralMenuData
                    ? { ...user, ...prev.user, ...centralMenuData, id: userId }
                    : { ...user, ...prev.user, id: userId },
                loadedUserId: String(userId),
                isInitialized: true,
                needsRefresh: false,
                isLoadingPanel: false,
            }));
        } catch (error) {
            console.error("Error al sincronizar datos del panel:", error);
            set({ isLoadingPanel: false });
        }
    },

    refreshPanelData: async () => {
        const { user, token, fetchPanelData } = get();
        if (!user) {
            set({ needsRefresh: true });
            return;
        }
        await fetchPanelData(user, token, true);
    },

    markNeedsRefresh: () => set({ needsRefresh: true }),

    clearPanelStore: () =>
        set({
            user: null,
            token: "",
            foods: [],
            menus: [],
            analytics: initialAnalytics,
            loadedUserId: null,
            isInitialized: false,
            needsRefresh: false,
            isLoadingPanel: false,
        }),

    setUser: (user) => set({ user }),
    updateUserLocal: (partialUser) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...partialUser } : partialUser,
        })),
    setMenus: (menus) => set({ menus }),
    setFoods: (foods) => set({ foods }),
    reorderFoods: (newOrder: any[]) => set({ foods: newOrder }),
    updateFood: (updatedFood) =>
        set((state) => ({
            foods: state.foods.map((f) => (f._id === updatedFood._id ? { ...f, ...updatedFood } : f)),
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

