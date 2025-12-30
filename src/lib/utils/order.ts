// src/lib/utils/order.ts

/**
 * Generate a unique order number
 * Format: BOBA-YYYYMMDD-XXXX (e.g., BOBA-20241230-A1B2)
 */
export function generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePart = `${year}${month}${day}`;

    // Generate random alphanumeric suffix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `BOBA-${datePart}-${suffix}`;
}

/**
 * Format order status for display
 */
export function formatOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        preparing: 'Preparing',
        ready: 'Ready for Pickup',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        refunded: 'Refunded',
    };

    return statusMap[status] || status;
}

/**
 * Get order status color for UI
 */
export function getOrderStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
        pending: 'yellow',
        confirmed: 'blue',
        preparing: 'indigo',
        ready: 'green',
        out_for_delivery: 'purple',
        delivered: 'green',
        cancelled: 'red',
        refunded: 'gray',
    };

    return colorMap[status] || 'gray';
}
