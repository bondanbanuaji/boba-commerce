/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                boba: {
                    // Primary Brand Colors (Warm Brown Palette)
                    primary: {
                        DEFAULT: '#8B4513',    // Saddle Brown - Main brand
                        light: '#A0522D',      // Sienna
                        dark: '#654321',       // Dark Brown
                        50: '#FDF8F3',
                        100: '#F5E6D3',
                        200: '#E8C9A8',
                        300: '#D4A574',
                        400: '#B8864A',
                        500: '#8B4513',        // Primary
                        600: '#7A3D11',
                        700: '#6A350F',
                        800: '#5A2D0D',
                        900: '#4A250B',
                    },
                    // Secondary (Cream/Milk Tea)
                    cream: {
                        DEFAULT: '#F5DEB3',
                        light: '#FFF8DC',
                        dark: '#DEB887',
                    },
                    // Accent (Tapioca Pearl Black)
                    pearl: {
                        DEFAULT: '#1C1C1C',
                        light: '#2D2D2D',
                    },
                    // Semantic Colors
                    success: '#22C55E',
                    warning: '#F59E0B',
                    error: '#EF4444',
                    info: '#3B82F6',
                },
            },
            fontFamily: {
                sans: ['Inter Variable', 'Inter', ...defaultTheme.fontFamily.sans],
                display: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
                'display-sm': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
            },
            borderRadius: {
                'boba': '1.5rem',     // Rounded like a boba cup
            },
            boxShadow: {
                'boba': '0 4px 20px -2px rgba(139, 69, 19, 0.2)',
                'boba-lg': '0 10px 40px -4px rgba(139, 69, 19, 0.25)',
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(100%)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
