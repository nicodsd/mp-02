import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePathname } from 'next/navigation';

interface Cart {
    selectedIds: string[];
    quantities: Record<string, number>;
}

interface CartsState {
    // Un carrito independiente por menú y por sucursal.
    // Clave: "<menu>" para el menú principal o "<menu>/<sucursal>" para cada sucursal.
    carts: Record<string, Cart>;
    addId: (cartKey: string, id: string | number) => void;
    removeId: (cartKey: string, id: string | number) => void;
    clearCart: (cartKey: string) => void;
    incrementQuantity: (cartKey: string, id: string | number) => void;
    decrementQuantity: (cartKey: string, id: string | number) => void;
}

interface CartStore extends Cart {
    cartKey: string;
    addId: (id: string | number) => void;
    removeId: (id: string | number) => void;
    clearCart: () => void;
    incrementQuantity: (id: string | number) => void;
    decrementQuantity: (id: string | number) => void;
}

const EMPTY_CART: Cart = { selectedIds: [], quantities: {} };

const updateCart = (
    carts: Record<string, Cart>,
    cartKey: string,
    updater: (cart: Cart) => Cart | null
): Record<string, Cart> | null => {
    const current = carts[cartKey] || EMPTY_CART;
    const next = updater(current);
    if (!next || next === current) return null;
    const newCarts = { ...carts };
    if (next.selectedIds.length === 0) {
        delete newCarts[cartKey];
    } else {
        newCarts[cartKey] = next;
    }
    return newCarts;
};

const useCartsStore = create<CartsState>()(
    persist(
        (set) => {
            const apply = (cartKey: string, updater: (cart: Cart) => Cart | null) =>
                set((state) => {
                    const carts = updateCart(state.carts, cartKey, updater);
                    return carts ? { carts } : state;
                });

            return {
                carts: {},
                addId: (cartKey, id) => apply(cartKey, (cart) => {
                    const strId = String(id);
                    if (cart.selectedIds.includes(strId)) {
                        return {
                            ...cart,
                            quantities: { ...cart.quantities, [strId]: (cart.quantities[strId] || 1) + 1 },
                        };
                    }
                    return {
                        selectedIds: [...cart.selectedIds, strId],
                        quantities: { ...cart.quantities, [strId]: 1 },
                    };
                }),
                removeId: (cartKey, id) => apply(cartKey, (cart) => {
                    const strId = String(id);
                    const newQuantities = { ...cart.quantities };
                    delete newQuantities[strId];
                    return {
                        selectedIds: cart.selectedIds.filter((selectedId) => selectedId !== strId),
                        quantities: newQuantities,
                    };
                }),
                clearCart: (cartKey) => apply(cartKey, () => ({ selectedIds: [], quantities: {} })),
                incrementQuantity: (cartKey, id) => apply(cartKey, (cart) => {
                    const strId = String(id);
                    if (!cart.selectedIds.includes(strId)) return null;
                    return {
                        ...cart,
                        quantities: { ...cart.quantities, [strId]: (cart.quantities[strId] || 1) + 1 },
                    };
                }),
                decrementQuantity: (cartKey, id) => apply(cartKey, (cart) => {
                    const strId = String(id);
                    if (!cart.selectedIds.includes(strId)) return null;
                    const newQuantity = (cart.quantities[strId] || 1) - 1;
                    if (newQuantity <= 0) {
                        const newQuantities = { ...cart.quantities };
                        delete newQuantities[strId];
                        return {
                            selectedIds: cart.selectedIds.filter((selectedId) => selectedId !== strId),
                            quantities: newQuantities,
                        };
                    }
                    return {
                        ...cart,
                        quantities: { ...cart.quantities, [strId]: newQuantity },
                    };
                }),
            };
        },
        {
            name: 'cart-storage', // key for localStorage
            version: 1,
            // El formato anterior era un único carrito global: se descarta para no mezclar menús.
            migrate: () => ({ carts: {} }) as unknown as CartsState,
        }
    )
);

/**
 * Obtiene la clave del carrito a partir de la URL:
 *   /menu-digital/[name]            -> "name"
 *   /menu-digital/[name]/[location] -> "name/location"
 */
export const getCartKeyFromPathname = (pathname: string | null | undefined): string => {
    if (!pathname) return 'default';
    const segments = pathname.split('/').filter(Boolean);
    const idx = segments.indexOf('menu-digital');
    const relevant = idx >= 0 ? segments.slice(idx + 1, idx + 3) : segments;
    if (relevant.length === 0) return 'default';
    return relevant
        .map((segment) => {
            try {
                return decodeURIComponent(segment).toLowerCase();
            } catch {
                return segment.toLowerCase();
            }
        })
        .join('/');
};

/**
 * Hook del carrito. Cada menú y cada sucursal tienen su propio carrito,
 * determinado automáticamente por la ruta actual (o por `cartKeyOverride`).
 */
export const useCartStore = (cartKeyOverride?: string): CartStore => {
    const pathname = usePathname();
    const cartKey = cartKeyOverride || getCartKeyFromPathname(pathname);

    const cart = useCartsStore((state) => state.carts[cartKey]) || EMPTY_CART;
    const addId = useCartsStore((state) => state.addId);
    const removeId = useCartsStore((state) => state.removeId);
    const clearCart = useCartsStore((state) => state.clearCart);
    const incrementQuantity = useCartsStore((state) => state.incrementQuantity);
    const decrementQuantity = useCartsStore((state) => state.decrementQuantity);

    return {
        cartKey,
        selectedIds: cart.selectedIds,
        quantities: cart.quantities,
        addId: (id) => addId(cartKey, id),
        removeId: (id) => removeId(cartKey, id),
        clearCart: () => clearCart(cartKey),
        incrementQuantity: (id) => incrementQuantity(cartKey, id),
        decrementQuantity: (id) => decrementQuantity(cartKey, id),
    };
};
