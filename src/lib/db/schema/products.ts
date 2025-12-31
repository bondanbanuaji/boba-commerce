import { pgTable, uuid, varchar, text, decimal, boolean, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true),
});

export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id').references(() => categories.id),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    featuredImage: text('featured_image'),
    isActive: boolean('is_active').default(true),
    isFeatured: boolean('is_featured').default(false),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productVariants = pgTable('product_variants', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    sku: varchar('sku', { length: 100 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default('0'),
    stockQuantity: integer('stock_quantity').default(0),
    isDefault: boolean('is_default').default(false),
    isActive: boolean('is_active').default(true),
});

export const productImages = pgTable('product_images', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    url: text('url').notNull(),
    altText: varchar('alt_text', { length: 255 }),
    sortOrder: integer('sort_order').default(0),
});

// Boba-specific customizations
export const customizationOptions = pgTable('customization_options', {
    id: uuid('id').primaryKey().defaultRandom(),
    category: varchar('category', { length: 50 }).notNull(), // 'sugar_level', 'ice_level', 'topping'
    name: varchar('name', { length: 100 }).notNull(),
    displayName: varchar('display_name', { length: 100 }).notNull(),
    priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default('0'),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    variants: many(productVariants),
    images: many(productImages),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id],
    }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.productId],
        references: [products.id],
    }),
}));

// Types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type CustomizationOption = typeof customizationOptions.$inferSelect;
export type NewCustomizationOption = typeof customizationOptions.$inferInsert;
