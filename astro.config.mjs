// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel({
        imageService: true,
        isr: {
            // Enable ISR for product pages
            expiration: 60 * 60, // 1 hour
        },
    }),
    integrations: [
        react(),
        tailwind(),
    ],
    vite: {
        optimizeDeps: {
            exclude: ['drizzle-orm'],
        },
        resolve: {
            alias: {
                '@': '/src',
                '@lib': '/src/lib',
                '@components': '/src/components',
                '@layouts': '/src/layouts',
                '@actions': '/src/actions',
                '@stores': '/src/lib/stores',
            },
        },
    },
});
