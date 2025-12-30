// drizzle/seed/customizations.ts

export const customizationSeed = [
    // Sugar Levels
    { category: 'sugar_level', name: 'no_sugar', displayName: '0% Sugar', priceModifier: '0', sortOrder: 1, isActive: true },
    { category: 'sugar_level', name: 'light_sugar', displayName: '25% Sugar', priceModifier: '0', sortOrder: 2, isActive: true },
    { category: 'sugar_level', name: 'half_sugar', displayName: '50% Sugar', priceModifier: '0', sortOrder: 3, isActive: true },
    { category: 'sugar_level', name: 'less_sugar', displayName: '75% Sugar', priceModifier: '0', sortOrder: 4, isActive: true },
    { category: 'sugar_level', name: 'normal_sugar', displayName: '100% Sugar', priceModifier: '0', sortOrder: 5, isActive: true },

    // Ice Levels
    { category: 'ice_level', name: 'no_ice', displayName: 'No Ice', priceModifier: '0', sortOrder: 1, isActive: true },
    { category: 'ice_level', name: 'less_ice', displayName: 'Less Ice', priceModifier: '0', sortOrder: 2, isActive: true },
    { category: 'ice_level', name: 'normal_ice', displayName: 'Normal Ice', priceModifier: '0', sortOrder: 3, isActive: true },
    { category: 'ice_level', name: 'extra_ice', displayName: 'Extra Ice', priceModifier: '0', sortOrder: 4, isActive: true },

    // Toppings (with prices in IDR)
    { category: 'topping', name: 'tapioca_pearl', displayName: 'Tapioca Pearls', priceModifier: '5000', sortOrder: 1, isActive: true },
    { category: 'topping', name: 'coconut_jelly', displayName: 'Coconut Jelly', priceModifier: '5000', sortOrder: 2, isActive: true },
    { category: 'topping', name: 'aloe_vera', displayName: 'Aloe Vera', priceModifier: '6000', sortOrder: 3, isActive: true },
    { category: 'topping', name: 'pudding', displayName: 'Pudding', priceModifier: '7000', sortOrder: 4, isActive: true },
    { category: 'topping', name: 'red_bean', displayName: 'Red Bean', priceModifier: '6000', sortOrder: 5, isActive: true },
    { category: 'topping', name: 'cheese_foam', displayName: 'Cheese Foam', priceModifier: '10000', sortOrder: 6, isActive: true },
    { category: 'topping', name: 'brown_sugar', displayName: 'Brown Sugar Jelly', priceModifier: '5000', sortOrder: 7, isActive: true },
    { category: 'topping', name: 'grass_jelly', displayName: 'Grass Jelly', priceModifier: '5000', sortOrder: 8, isActive: true },
];

// Sample categories
export const categorySeed = [
    { name: 'Milk Tea', slug: 'milk-tea', description: 'Classic milk tea varieties', sortOrder: 1, isActive: true },
    { name: 'Fruit Tea', slug: 'fruit-tea', description: 'Refreshing fruit-based teas', sortOrder: 2, isActive: true },
    { name: 'Specialty', slug: 'specialty', description: 'Our signature creations', sortOrder: 3, isActive: true },
    { name: 'Coffee', slug: 'coffee', description: 'Coffee-based beverages', sortOrder: 4, isActive: true },
    { name: 'Smoothies', slug: 'smoothies', description: 'Blended fruit smoothies', sortOrder: 5, isActive: true },
];

// Sample products
export const productSeed = [
    {
        name: 'Classic Brown Sugar Milk Tea',
        slug: 'classic-brown-sugar-milk-tea',
        description: 'Rich brown sugar syrup swirled with fresh milk and chewy tapioca pearls. Our signature drink!',
        basePrice: '35000',
        categorySlug: 'milk-tea',
        isFeatured: true,
        variantName: 'Regular',
        variantSku: 'BSMT-REG-001',
        stockQuantity: 100,
    },
    {
        name: 'Taro Milk Tea',
        slug: 'taro-milk-tea',
        description: 'Creamy taro blended with fresh milk for a smooth, sweet flavor.',
        basePrice: '32000',
        categorySlug: 'milk-tea',
        isFeatured: true,
        variantName: 'Regular',
        variantSku: 'TMT-REG-001',
        stockQuantity: 100,
    },
    {
        name: 'Passion Fruit Green Tea',
        slug: 'passion-fruit-green-tea',
        description: 'Tropical passion fruit combined with refreshing green tea.',
        basePrice: '28000',
        categorySlug: 'fruit-tea',
        isFeatured: false,
        variantName: 'Regular',
        variantSku: 'PFGT-REG-001',
        stockQuantity: 100,
    },
    {
        name: 'Mango Yakult',
        slug: 'mango-yakult',
        description: 'Fresh mango with probiotic Yakult drink.',
        basePrice: '30000',
        categorySlug: 'specialty',
        isFeatured: true,
        variantName: 'Regular',
        variantSku: 'MYK-REG-001',
        stockQuantity: 100,
    },
];
