import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lib/utils';

const buttonVariants = cva(
    // Base styles
    `inline-flex items-center justify-center rounded-lg 
   font-medium transition-all duration-200 
   focus-visible:outline-none focus-visible:ring-2 
   focus-visible:ring-boba-primary focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50`,
    {
        variants: {
            variant: {
                primary: `bg-boba-primary text-white 
                  hover:bg-boba-primary-dark 
                  active:scale-[0.98]`,
                secondary: `bg-boba-cream text-boba-primary 
                    border border-boba-primary/20 
                    hover:bg-boba-cream-dark`,
                ghost: `hover:bg-boba-primary/10 text-boba-primary`,
                danger: `bg-boba-error text-white hover:bg-red-600`,
                link: `text-boba-primary underline-offset-4 hover:underline`,
            },
            size: {
                sm: 'h-9 px-3 text-sm',
                md: 'h-11 px-5 text-base',
                lg: 'h-13 px-8 text-lg',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
