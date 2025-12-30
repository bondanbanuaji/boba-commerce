// src/actions/checkout.ts
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { db } from '@lib/db/client';
import { orders, orderItems, cartItems, payments, addresses, type NewAddress } from '@lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUser } from '@lib/supabase/auth';
import { generateOrderNumber } from '@lib/utils/order';
import { calculateCartTotal } from '@lib/utils/cart';
import { AuthenticationError, ValidationError } from '@lib/errors';

const addressSchema = z.object({
    fullName: z.string().min(2, 'Name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    streetAddress: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().default('Indonesia'),
    saveAddress: z.boolean().optional(),
});

export const checkout = {
    initiate: defineAction({
        accept: 'json',
        input: z.object({
            shippingAddress: addressSchema,
            notes: z.string().optional(),
            saveAddress: z.boolean().optional(),
        }),
        handler: async (input, context) => {
            const user = await getUser(context);
            if (!user) {
                throw new AuthenticationError();
            }

            // Get cart items
            const cart = await db.query.cartItems.findMany({
                where: eq(cartItems.userId, user.id),
                with: {
                    variant: {
                        with: { product: true },
                    },
                },
            });

            if (cart.length === 0) {
                throw new ValidationError('Cart is empty');
            }

            // Calculate totals
            const totals = calculateCartTotal(cart);

            // Create order in transaction
            const order = await db.transaction(async (tx) => {
                // Optionally save shipping address
                let shippingAddressId: string | undefined;

                if (input.saveAddress) {
                    const [savedAddress] = await tx.insert(addresses).values({
                        userId: user.id,
                        label: 'Shipping',
                        ...input.shippingAddress,
                    } as NewAddress).returning();
                    shippingAddressId = savedAddress.id;
                }

                // Create order
                const [newOrder] = await tx.insert(orders).values({
                    userId: user.id,
                    shippingAddressId,
                    orderNumber: generateOrderNumber(),
                    status: 'pending',
                    subtotal: totals.subtotal.toString(),
                    taxAmount: totals.tax.toString(),
                    shippingAmount: totals.shipping.toString(),
                    discountAmount: totals.discount.toString(),
                    totalAmount: totals.total.toString(),
                    notes: input.notes,
                }).returning();

                // Create order items
                await tx.insert(orderItems).values(
                    cart.map((item) => ({
                        orderId: newOrder.id,
                        variantId: item.variantId,
                        productName: item.variant.product.name,
                        variantName: item.variant.name,
                        unitPrice: item.variant.product.basePrice,
                        quantity: item.quantity,
                        totalPrice: (
                            Number(item.variant.product.basePrice) * item.quantity
                        ).toString(),
                    }))
                );

                // Clear cart
                await tx.delete(cartItems).where(eq(cartItems.userId, user.id));

                return newOrder;
            });

            return {
                success: true,
                orderId: order.id,
                orderNumber: order.orderNumber,
                total: totals.total,
            };
        },
    }),

    processPayment: defineAction({
        accept: 'json',
        input: z.object({
            orderId: z.string().uuid(),
            paymentMethod: z.enum(['bank_transfer', 'e_wallet', 'cod', 'qris']),
        }),
        handler: async (input, context) => {
            const user = await getUser(context);
            if (!user) {
                throw new AuthenticationError();
            }

            // Verify order belongs to user
            const order = await db.query.orders.findFirst({
                where: and(
                    eq(orders.id, input.orderId),
                    eq(orders.userId, user.id)
                ),
            });

            if (!order) {
                throw new ValidationError('Order not found');
            }

            if (order.status !== 'pending') {
                throw new ValidationError('Order has already been processed');
            }

            // Create payment record
            const [payment] = await db.insert(payments).values({
                orderId: order.id,
                provider: input.paymentMethod,
                status: input.paymentMethod === 'cod' ? 'pending' : 'processing',
                amount: order.totalAmount,
                currency: 'IDR',
                metadata: {
                    method: input.paymentMethod,
                    initiatedAt: new Date().toISOString(),
                },
            }).returning();

            // Update order status
            const newStatus = input.paymentMethod === 'cod' ? 'confirmed' : 'pending';
            await db.update(orders)
                .set({ status: newStatus, updatedAt: new Date() })
                .where(eq(orders.id, order.id));

            return {
                success: true,
                paymentId: payment.id,
                status: payment.status,
                redirectTo: `/checkout/success?order=${order.orderNumber}`,
            };
        },
    }),

    getOrderSummary: defineAction({
        accept: 'json',
        input: z.object({
            orderNumber: z.string(),
        }),
        handler: async (input, context) => {
            const user = await getUser(context);
            if (!user) {
                throw new AuthenticationError();
            }

            const order = await db.query.orders.findFirst({
                where: and(
                    eq(orders.orderNumber, input.orderNumber),
                    eq(orders.userId, user.id)
                ),
                with: {
                    items: {
                        with: {
                            variant: {
                                with: { product: true },
                            },
                        },
                    },
                    payment: true,
                },
            });

            if (!order) {
                throw new ValidationError('Order not found');
            }

            return { success: true, order };
        },
    }),
};
