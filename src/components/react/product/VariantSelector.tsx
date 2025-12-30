import { cn } from '@lib/utils';

export interface Variant {
    id: string;
    name: string;
    priceOffset?: number;
    stock: number;
}

interface VariantSelectorProps {
    variants: Variant[];
    selectedVariant: string | null;
    onSelect: (id: string) => void;
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
    if (!variants || variants.length === 0) return null;

    return (
        <div className="space-y-3">
            <span className="text-sm font-medium text-gray-900">Select Option:</span>
            <div className="flex flex-wrap gap-3">
                {variants.map((variant) => {
                    const isSelected = selectedVariant === variant.id;
                    const isOutOfStock = variant.stock <= 0;

                    return (
                        <button
                            key={variant.id}
                            onClick={() => !isOutOfStock && onSelect(variant.id)}
                            disabled={isOutOfStock}
                            className={cn(
                                "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all relative overflow-hidden",
                                isSelected
                                    ? "border-boba-primary text-boba-primary bg-boba-cream/10"
                                    : "border-gray-200 text-gray-700 hover:border-gray-300",
                                isOutOfStock && "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 decoration-slice line-through"
                            )}
                        >
                            {variant.name}
                            {variant.priceOffset && variant.priceOffset > 0 && (
                                <span className="ml-1 text-xs opacity-75">
                                    (+${variant.priceOffset.toFixed(2)})
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
