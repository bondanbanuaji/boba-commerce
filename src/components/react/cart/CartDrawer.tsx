import { useStore } from '@nanostores/react';
import { $isCartOpen, $cartItems, $cartTotal, removeFromCart, updateQuantity } from '@stores/cart';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@components/react/ui/Button';
import { cn } from '@lib/utils';
import { useEffect } from 'react';

export function CartDrawer() {
    const isOpen = useStore($isCartOpen);
    const items = useStore($cartItems);
    const total = useStore($cartTotal);
    const cartItems = Object.values(items);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') $isCartOpen.set(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={() => $isCartOpen.set(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-boba-50">
                    <h2 className="text-xl font-display font-bold text-boba-primary-dark">Your Cart</h2>
                    <button
                        onClick={() => $isCartOpen.set(false)}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-boba-primary" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                            <ShoppingBag className="h-16 w-16 opacity-20" />
                            <p>Your cart is empty.</p>
                            <Button variant="secondary" onClick={() => $isCartOpen.set(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.variantId} className="flex gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                                        <p className="text-sm text-boba-primary font-bold">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-100"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-100"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.variantId)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-4 border-t bg-gray-50 space-y-4">
                        <div className="flex items-center justify-between text-lg font-medium">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <a href="/checkout" className="block w-full">
                            <Button className="w-full" size="lg">
                                Checkout
                            </Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

// Icon import helper within file was missing
import { ShoppingBag } from 'lucide-react';
