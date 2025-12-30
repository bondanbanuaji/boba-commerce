// src/actions/admin.ts
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { db } from '@lib/db/client';
import { orders, products, productVariants, orderStatusEnum } from '@lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser, isAdmin } from '@lib/supabase/auth';
import { AuthenticationError, AuthorizationError, ValidationError } from '@lib/errors';

export const admin = {
    updateOrderStatus: defineAction({
        accept: 'json',
        input: z.object({
            orderId: z.string().uuid(),
            status: z.enum([
                'pending',
                'confirmed',
                'preparing',
                'ready',
                'out_for_delivery',
                'delivered',
                'cancelled',
                'refunded'
            ]),
        }),
        handler: async (input, context) => {
            const user = await getUser(context);
            if (!user) {
                throw new AuthenticationError();
            }

            if (!await isAdmin(context)) {
                throw new AuthorizationError();
            }

            const order = await db.query.orders.findFirst({
                where: eq(orders.id, input.orderId),
            });

            if (!order) {
                throw new ValidationError('Order not found');
            }

            await db.update(orders)
                .set({
                    status: input.status,
                    updatedAt: new Date()
                })
                .where(eq(orders.id, input.orderId));

            return {
                success: true,
                orderNumber: order.orderNumber,
                newStatus: input.status,
            };
        },
    }),

    createProduct: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string().min(2),
            slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
            categoryId: z.string().uuid().optional(),
            description: z.string().optional(),
            basePrice: z.coerce.number().positive(),
            featuredImage: z.string().url().optional(),
            isActive: z.coerce.boolean().default(true),
            isFeatured: z.coerce.boolean().default(false),
            // Default variant
            variantName: z.string().default('Regular'),
            variantSku: z.string().min(2),
            stockQuantity: z.coerce.number().int().min(0).default(0),
        }),
        handler: async (input, context) => {
            const user = await getUser(context);
            if (!user) {
                throw new AuthenticationError();
            }

            if (!await isAdmin(context)) {
                throw new AuthorizationError();
            }

            // Check for duplicate slug
            const existing = await db.query.products.findFirst({
                where: eq(products.slug, input.slug),
            });

            if (existing) {
                throw new ValidationError('Product with this slug already exists');
            }

            // Create product with default variant in transaction
            const result = await db.transaction(async (tx) => {
                const [product] = await tx.insert(products).values({
                    name: input.name,
                    slug: input.slug,
                    categoryId: input.categoryId,
                    description: input.description,
                    basePrice: input.basePrice.toString(),
                    featuredImage: input.featuredImage,
                    isActive: input.isActive,
                    isFeatured: input.isFeatured,
                }).returning();

                await tx.insert(productVariants).values({
                    productId: product.id,
                    name: input.variantName,
                    sku: input.variantSku,
                    stockQuantity: input.stockQuantity,
                    isDefault: true,
                    isActive: true,
                });

                return product;
            });

            return {
                success: true,
                productId: result.id,
                slug: result.slug,
            };
        },
    }),

    updateProduct: defineAction({
        accept: 'form',
        input: z.object({
            productId: z.string().uuid(),
            name: z.string().min(2).optional(),
            description: z.string().optional(),
            basePrice: z.coerce.number().positive().optional(),
            featuredImage: z.string().url().optional(),
            isActive: z.coerce.boolean().optional(),
            isFeatured: z.coerce.boolean().optional(),
            categoryId: z.string().uuid().optional(),
        }),
        handler: async (input, context) => {
            const user = await getUser(context);
            if (!user) {
                throw new AuthenticationError();
            }

            if (!await isAdmin(context)) {
                throw new AuthorizationError();
            }

            const { productId, ...updateData } = input;

            // Build update object, only including defined fields
            const updates: Record<string, any> = { updatedAt: new Date() };

            if (updateData.name !== undefined) updates.name = updateData.name;
            if (updateData.description !== undefined) updates.description = updateData.description;
            if (updateData.basePrice !== undefined) updates.basePrice = updateData.basePrice.toString();
            if (updateData.featuredImage !== undefined) updates.featuredImage = updateData.featuredImage;
            if (updateData.isActive !== undefined) updates.isActive = updateData.isActive;
            if (updateData.isFeatured !== undefined) updates.isFeatured = updateData.isFeatured;
            if (updateData.categoryId !== undefined) updates.categoryId = updateData.categoryId;

            await db.update(products)
                .set(updates)
                .where(eq(products.id, productId));

            return { success: true };
        },
    }),

    deleteProduct: defineAction({
        accept: 'json',
        input: z.object({
            productId: z.string().uuid(),
        }),
        handler: async (input, context) => {
            const user = await getUser(context);
            if (!user) {
                throw new AuthenticationError();
            }

            if (!await isAdmin(context)) {
                throw new AuthorizationError();
            }

            // Soft delete - just mark as inactive
            await db.update(products)
                .set({ isActive: false, updatedAt: new Date() })
                .where(eq(products.id, input.productId));

            return { success: true };
        },
    }),

    updateVariantStock: defineAction({
        accept: 'json',
        input: z.object({
            variantId: z.string().uuid(),
            stockQuantity: z.number().int().min(0),
        }),
        handler: async (input, context) => {
            const user = await getUser(context);
            if (!user) {
                throw new AuthenticationError();
            }

            if (!await isAdmin(context)) {
                throw new AuthorizationError();
            }

            await db.update(productVariants)
                .set({ stockQuantity: input.stockQuantity })
                .where(eq(productVariants.id, input.variantId));

            return { success: true };
        },
    }),
};
