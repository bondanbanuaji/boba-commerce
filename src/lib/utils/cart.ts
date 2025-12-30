// src/lib/utils/cart.ts

interface CartItemForCalculation {
    quantity: number;
    variant: {
        priceModifier: string | null;
        product: {
            basePrice: string;
        };
    };
    customizations?: {
        sugarLevel?: string;
        iceLevel?: string;
        toppings?: string[];
    } | null;
}

interface CartTotals {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
}

// Topping prices (in IDR) - should match database customization_options
const TOPPING_PRICES: Record<string, number> = {
    tapioca_pearl: 5000,
    coconut_jelly: 5000,
    aloe_vera: 6000,
    pudding: 7000,
    red_bean: 6000,
    cheese_foam: 10000,
};

// Tax rate (Indonesian VAT)
const TAX_RATE = 0.11; // 11%

// Shipping thresholds
const FREE_SHIPPING_THRESHOLD = 100000; // Free shipping above 100k IDR
const STANDARD_SHIPPING = 15000; // 15k IDR standard shipping

/**
 * Calculate cart totals including tax and shipping
 */
export function calculateCartTotal(items: CartItemForCalculation[]): CartTotals {
    let subtotal = 0;

    for (const item of items) {
        const basePrice = parseFloat(item.variant.product.basePrice);
        const priceModifier = parseFloat(item.variant.priceModifier || '0');
        let itemPrice = basePrice + priceModifier;

        // Add topping prices
        if (item.customizations?.toppings) {
            for (const topping of item.customizations.toppings) {
                itemPrice += TOPPING_PRICES[topping] || 0;
            }
        }

        subtotal += itemPrice * item.quantity;
    }

    const tax = Math.round(subtotal * TAX_RATE);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    const discount = 0; // Can be extended for coupon support
    const total = subtotal + tax + shipping - discount;

    return {
        subtotal,
        tax,
        shipping,
        discount,
        total,
    };
}

/**
 * Calculate single item price with customizations
 */
export function calculateItemPrice(
    basePrice: number,
    priceModifier: number,
    toppings?: string[]
): number {
    let price = basePrice + priceModifier;

    if (toppings) {
        for (const topping of toppings) {
            price += TOPPING_PRICES[topping] || 0;
        }
    }

    return price;
}

/**
 * Format price for display (IDR)
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Get total item count in cart
 */
export function getCartItemCount(items: { quantity: number }[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}
