import { Minus, Plus } from 'lucide-react';
import { cn } from '@lib/utils';

interface QuantityInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export function QuantityInput({ value, onChange, min = 1, max = 99 }: QuantityInputProps) {
    return (
        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
            <button
                onClick={() => onChange(Math.max(min, value - 1))}
                className="p-3 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50"
                disabled={value <= min}
                aria-label="Decrease quantity"
            >
                <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium">{value}</span>
            <button
                onClick={() => onChange(Math.min(max, value + 1))}
                className="p-3 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50"
                disabled={value >= max}
                aria-label="Increase quantity"
            >
                <Plus className="h-4 w-4" />
            </button>
        </div>
    );
}
