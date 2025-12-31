import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { supabase } from '@lib/supabase/client';

export const server = {
    // Cart Actions
    addToCart: defineAction({
        accept: 'json',
        input: z.object({
            productId: z.string(),
            variantId: z.string().optional(),
            quantity: z.number().default(1),
        }),
        handler: async (input, context) => {
            // Logic to sync with backend DB would go here
            // For now we just return success as we rely on client-side store largely
            return { success: true, message: 'Added to cart' };
        },
    }),

    // Auth Actions (if needed for server-side handling)
    login: defineAction({
        accept: 'form',
        input: z.object({
            email: z.string().email(),
            password: z.string().min(6),
        }),
        handler: async ({ email, password }) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw new Error(error.message);
            }

            return { success: true, user: data.user };
        },
    }),

    register: defineAction({
        accept: 'form',
        input: z.object({
            email: z.string().email(),
            password: z.string().min(8),
            firstName: z.string(),
            lastName: z.string(),
        }),
        handler: async ({ email, password, firstName, lastName }) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim(),
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            return { success: true, user: data.user };
        }
    })
};
