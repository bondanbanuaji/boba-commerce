// src/lib/db/queries/orders.ts
import { db } from '../client';
import { orders, orderItems } from '../schema';
import { eq, desc, sql, count } from 'drizzle-orm';

export async function getUserOrders(userId: string, limit = 10, offset = 0) {
    return db.query.orders.findMany({
        where: eq(orders.userId, userId),
        with: {
            items: {
                with: {
                    variant: true,
                },
            },
            payment: true,
        },
        orderBy: [desc(orders.createdAt)],
        limit,
        offset,
    });
}

export async function getOrderByNumber(orderNumber: string, userId?: string) {
    const conditions = [eq(orders.orderNumber, orderNumber)];

    if (userId) {
        conditions.push(eq(orders.userId, userId));
    }

    return db.query.orders.findFirst({
        where: conditions.length > 1
            ? sql`${orders.orderNumber} = ${orderNumber} AND ${orders.userId} = ${userId}`
            : eq(orders.orderNumber, orderNumber),
        with: {
            items: {
                with: {
                    variant: {
                        with: {
                            product: true,
                        },
                    },
                    customizations: true,
                },
            },
            shippingAddress: true,
            payment: true,
        },
    });
}

export async function getOrderById(orderId: string, userId: string) {
    return db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
            items: {
                with: {
                    variant: {
                        with: {
                            product: true,
                        },
                    },
                },
            },
            shippingAddress: true,
            payment: true,
        },
    });
}

export async function getUserOrderStats(userId: string) {
    const [totalOrdersResult, totalSpentResult] = await Promise.all([
        db.select({ count: count() })
            .from(orders)
            .where(eq(orders.userId, userId)),
        db.select({ total: sql<string>`COALESCE(SUM(CAST(${orders.totalAmount} AS DECIMAL)), 0)` })
            .from(orders)
            .where(eq(orders.userId, userId)),
    ]);

    return {
        totalOrders: Number(totalOrdersResult[0]?.count ?? 0),
        totalSpent: parseFloat(totalSpentResult[0]?.total ?? '0'),
    };
}

// Admin queries
export async function getAllOrders(limit = 20, offset = 0, status?: string) {
    const query = db.query.orders.findMany({
        with: {
            items: true,
            payment: true,
        },
        orderBy: [desc(orders.createdAt)],
        limit,
        offset,
    });

    return query;
}
