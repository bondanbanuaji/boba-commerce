import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal, removeFromCart, updateQuantity } from '@stores/cart';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@components/react/ui/Button';
import { cn } from '@lib/utils';

export function CartSummary() {
    const items = useStore($cartItems);
    const total = useStore($cartTotal);
    const cartItems = Object.values(items);

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
                <a href="/products">
                    <Button>Continue Shopping</Button>
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="h-24 w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-900 text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Variant: Default</p>
                                </div>
                                <p className="font-bold text-boba-primary text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center border rounded-md">
                                    <button
                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                        className="p-2 hover:bg-gray-100"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                        className="p-2 hover:bg-gray-100"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.variantId)}
                                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                    <h2 className="text-xl font-display font-bold mb-6">Order Summary</h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>-</span>
                        </div>
                        <div className="h-px bg-gray-100 my-2"></div>
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <a href="/checkout" className="block w-full">
                        <Button className="w-full h-12 text-lg group">
                            Proceed to Checkout
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </a>

                    <p className="mt-4 text-xs text-center text-gray-500">
                        Secure checkout powered by Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}
