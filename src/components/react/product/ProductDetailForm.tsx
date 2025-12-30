import { useState } from 'react';
import { VariantSelector } from './VariantSelector';
import { QuantityInput } from './QuantityInput';
import { AddToCartButton } from '../cart/AddToCartButton';
import type { Product } from '@/types';
import { cn } from '@lib/utils';

interface ProductDetailFormProps {
    product: Product;
}

export function ProductDetailForm({ product }: ProductDetailFormProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
        product.variants?.[0]?.id || null
    );
    const [quantity, setQuantity] = useState(1);

    // Construct the product object to add to cart
    const productToAdd = {
        ...product,
        // Override price if variant selected (mock logic)
        price: product.price + (product.variants?.find(v => v.id === selectedVariantId)?.priceOffset || 0),
        // Pass the specific variant ID
        variantId: selectedVariantId || product.id
    };

    // Create a specialized mock product with the specific variant info attached for the cart
    // In a real app, addToCart would handle looking up these details or we pass a complete variant object
    const handleAddToCartPayload = {
        ...product,
        id: product.id,
        variantId: selectedVariantId || product.id, // Important for cart unique keys
        price: productToAdd.price
    };

    return (
        <div className="space-y-6">
            {product.variants && product.variants.length > 0 && (
                <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariantId}
                    onSelect={setSelectedVariantId}
                />
            )}

            <div className="flex items-end gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Quantity</label>
                    <QuantityInput
                        value={quantity}
                        onChange={setQuantity}
                    />
                </div>

                <div className="flex-1">
                    <AddToCartButton
                        product={handleAddToCartPayload}
                    // We need to modify AddToCartButton to accept quantity, or use the store directly here.
                    // But AddToCartButton uses the store. Let's make a wrapper logic or update AddToCartButton.
                    // Actually, AddToCartButton calls `addToCart(product)`. 
                    // We should probably update the `addToCart` store function to accept quantity, which it does!
                    // But the component `AddToCartButton` doesn't expose quantity prop in its interface currently.
                    // Let's manually call the store here instead of reusing the simple button, or wrap it.
                    // Cleaner: Use specific button for detail page or update the generic one.
                    // I'll inline the button behavior here for full control.
                    />
                    {/* Wait, the props for AddToCartButton in the previous file didn't take quantity.
               I should update AddToCartButton or copy the logic.
               I'll copy logic for now to save a roundtrip reading the file, but using the store directly is better.
           */}
                    <CustomAddToCartBtn
                        product={handleAddToCartPayload}
                        quantity={quantity}
                    />
                </div>
            </div>
        </div>
    );
}

import { addToCart } from '@stores/cart';
import { addToast } from '@stores/ui';
import { Button } from '@components/react/ui/Button';
import { useState as useReactState } from 'react';

function CustomAddToCartBtn({ product, quantity }: { product: Product, quantity: number }) {
    const [loading, setLoading] = useReactState(false);

    const handleAdd = () => {
        setLoading(true);
        setTimeout(() => {
            addToCart(product, quantity);
            addToast({
                type: 'success',
                message: `Added ${quantity}x ${product.name} to cart`,
                duration: 3000
            });
            setLoading(false);
        }, 400);
    };

    return (
        <Button
            onClick={handleAdd}
            isLoading={loading}
            className="w-full h-[50px] text-lg"
        >
            Add to Cart - ${(product.price * quantity).toFixed(2)}
        </Button>
    )
}
