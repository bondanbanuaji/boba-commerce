import { useStore } from '@nanostores/react';
import { $cartCount, $isCartOpen } from '@stores/cart';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@lib/utils';

export function CartIcon() {
    const count = useStore($cartCount);
    const isOpen = useStore($isCartOpen);

    return (
        <button
            onClick={() => $isCartOpen.set(!isOpen)}
            className="relative p-2 text-boba-primary hover:text-boba-primary-dark transition-colors"
            aria-label={`Cart with ${count} items`}
        >
            <ShoppingBag className="h-6 w-6" />
            {count > 0 && (
                <span className={cn(
                    "absolute -top-1 -right-1",
                    "bg-boba-primary text-white",
                    "text-xs font-bold rounded-full h-5 w-5",
                    "flex items-center justify-center",
                    "animate-scale-in"
                )}>
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </button>
    );
}
