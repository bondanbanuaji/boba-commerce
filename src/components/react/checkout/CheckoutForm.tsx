import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $cartTotal } from '@stores/cart';
import { Button } from '@components/react/ui/Button';
import { Input } from '@components/react/ui/Input';
import { Loader2 } from 'lucide-react';

export function CheckoutForm() {
    const total = useStore($cartTotal);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        window.location.href = '/checkout/success';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-display font-bold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-display font-bold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">First Name</label>
                            <Input required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Last Name</label>
                            <Input required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input placeholder="123 Boba St" required />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2 text-sm font-medium col-span-1">
                            <label>City</label>
                            <Input required />
                        </div>
                        <div className="space-y-2 text-sm font-medium col-span-1">
                            <label>State</label>
                            <Input required />
                        </div>
                        <div className="space-y-2 text-sm font-medium col-span-1">
                            <label>ZIP</label>
                            <Input required />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-display font-bold mb-6">Payment Method</h2>
                <div className="p-4 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50 text-center">
                    Payment integration (Stripe) would go here.
                    <br />
                    For demo, just click "Pay Now".
                </div>
            </div>

            <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Pay $${total.toFixed(2)}`
                )}
            </Button>
        </form>
    );
}
