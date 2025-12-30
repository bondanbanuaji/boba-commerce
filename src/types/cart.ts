export interface CartItem {
    productId: string;
    variantId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    customizations?: any;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
}
