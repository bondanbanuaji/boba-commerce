// src/lib/db/queries/index.ts
// Products
export {
    getProductBySlug,
    getProductsWithFilters,
    getFeaturedProducts,
    getCategories,
    getCategoryBySlug,
} from './products';
export type { ProductFilterOptions } from './products';

// Cart
export {
    getUserCart,
    getCartItemCount,
    getCartItemById,
} from './cart';

// Orders
export {
    getUserOrders,
    getOrderByNumber,
    getOrderById,
    getUserOrderStats,
    getAllOrders,
} from './orders';
