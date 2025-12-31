import { pgTable, uuid, varchar, text, decimal, integer, timestamp, pgEnum, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { productVariants, customizationOptions } from './products';

export const orderStatusEnum = pgEnum('order_status', [
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'refunded'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
    'pending',
    'processing',
    'succeeded',
    'failed',
    'cancelled',
    'refunded'
]);

export const addresses = pgTable('addresses', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    label: varchar('label', { length: 50 }),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    streetAddress: text('street_address').notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }).notNull(),
    country: varchar('country', { length: 100 }).default('Indonesia'),
    isDefault: boolean('is_default').default(false),
});

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    shippingAddressId: uuid('shipping_address_id').references(() => addresses.id),
    orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),
    status: orderStatusEnum('status').default('pending').notNull(),
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
    shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).default('0'),
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').references(() => orders.id).notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id).notNull(),
    productName: varchar('product_name', { length: 255 }).notNull(),
    variantName: varchar('variant_name', { length: 255 }).notNull(),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
});

export const orderItemCustomizations = pgTable('order_item_customizations', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderItemId: uuid('order_item_id').references(() => orderItems.id).notNull(),
    customizationId: uuid('customization_id').references(() => customizationOptions.id),
    customizationName: varchar('customization_name', { length: 100 }).notNull(),
    priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default('0'),
});

export const payments = pgTable('payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').references(() => orders.id).notNull(),
    provider: varchar('provider', { length: 50 }).notNull(),
    providerPaymentId: varchar('provider_payment_id', { length: 255 }),
    status: paymentStatusEnum('status').default('pending').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).default('IDR'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const addressesRelations = relations(addresses, ({ one }) => ({
    user: one(users, {
        fields: [addresses.userId],
        references: [users.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    shippingAddress: one(addresses, {
        fields: [orders.shippingAddressId],
        references: [addresses.id],
    }),
    items: many(orderItems),
    payment: one(payments, {
        fields: [orders.id],
        references: [payments.orderId],
    }),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.variantId],
        references: [productVariants.id],
    }),
    customizations: many(orderItemCustomizations),
}));

export const orderItemCustomizationsRelations = relations(orderItemCustomizations, ({ one }) => ({
    orderItem: one(orderItems, {
        fields: [orderItemCustomizations.orderItemId],
        references: [orderItems.id],
    }),
    customization: one(customizationOptions, {
        fields: [orderItemCustomizations.customizationId],
        references: [customizationOptions.id],
    }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    order: one(orders, {
        fields: [payments.orderId],
        references: [orders.id],
    }),
}));

// Types
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type OrderItemCustomization = typeof orderItemCustomizations.$inferSelect;
export type NewOrderItemCustomization = typeof orderItemCustomizations.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
