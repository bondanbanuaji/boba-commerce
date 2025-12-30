import { useState } from 'react';
import { Button } from '@components/react/ui/Button';
import { addToCart } from '@stores/cart';
import { addToast } from '@stores/ui'; // If you're importing this, ensure it exists in store ui export
import type { Product } from '@/types';
import { ShoppingBag } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product;
    variant?: 'icon' | 'full';
}

export function AddToCartButton({ product, variant = 'full' }: AddToCartButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleAdd = () => {
        setLoading(true);
        // Simulate network delay for effect
        setTimeout(() => {
            addToCart(product);
            addToast({
                type: 'success',
                message: `Added ${product.name} to cart`,
                duration: 3000
            });
            setLoading(false);
        }, 400);
    };

    if (variant === 'icon') {
        return (
            <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                    e.preventDefault();
                    handleAdd();
                }}
                isLoading={loading}
                className="rounded-full shadow-sm hover:shadow-md"
            >
                <ShoppingBag className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Button
            onClick={handleAdd}
            isLoading={loading}
            className="w-full"
        >
            Add to Cart
        </Button>
    );
}
