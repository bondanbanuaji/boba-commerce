import { atom, map, computed } from 'nanostores';
import type { CartItem, Product } from '@/types';

// Atomic store for cart open/close state
export const $isCartOpen = atom<boolean>(false);

// Map store for cart items (key: variantId)
export const $cartItems = map<Record<string, CartItem>>({});

// Computed store for derived values
export const $cartCount = computed($cartItems, (items) =>
    Object.values(items).reduce((sum, item) => sum + item.quantity, 0)
);

export const $cartTotal = computed($cartItems, (items) =>
    Object.values(items).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )
);

// Actions
import { actions } from 'astro:actions';

export async function addToCart(product: Product, quantity: number = 1) {
    const currentItems = $cartItems.get();
    // Use product.id as variantId if no explicit variantId (fallback)
    const variantId = product.variants?.[0]?.id || product.id;

    const existingItem = currentItems[variantId];

    if (existingItem) {
        $cartItems.setKey(variantId, {
            ...existingItem,
            quantity: existingItem.quantity + quantity
        });
    } else {
        $cartItems.setKey(variantId, {
            productId: product.id,
            variantId: variantId,
            name: product.name,
            price: product.price + (product.variants?.[0]?.priceOffset || 0), // handle basic variant price logic
            image: product.image,
            quantity,
        });
    }

    // Persist to localStorage
    persistCart();

    // Sync with Backend (Fire and forget for now, or handle error)
    try {
        await actions.addToCart({
            productId: product.id,
            variantId,
            quantity
        });
    } catch (err) {
        console.error('Failed to sync cart with backend:', err);
    }
}

export function removeFromCart(variantId: string) {
    const current = { ...$cartItems.get() };
    delete current[variantId];
    $cartItems.set(current);
    persistCart();
}

export function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) {
        removeFromCart(variantId);
        return;
    }

    const item = $cartItems.get()[variantId];
    if (item) {
        $cartItems.setKey(variantId, { ...item, quantity });
        persistCart();
    }
}

// Persistence
function persistCart() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('boba-cart', JSON.stringify($cartItems.get()));
    }
}

export function hydrateCart() {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('boba-cart');
        if (stored) {
            try {
                $cartItems.set(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to hydrate cart:', e);
            }
        }
    }
}
