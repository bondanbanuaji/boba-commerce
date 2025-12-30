export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    slug: string;
    variants?: ProductVariant[];
}

export interface ProductVariant {
    id: string;
    productId: string;
    name: string;
    priceOffset?: number;
    stock: number;
}
