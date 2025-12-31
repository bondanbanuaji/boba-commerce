import './chunks/virtual_nXye-GdT.mjs';
import * as z from 'zod';
import { s as supabase } from './chunks/client_0Wc8jImx.mjs';
import { a as defineAction } from './chunks/index_CPtWlRub.mjs';

const server = {
  // Cart Actions
  addToCart: defineAction({
    accept: "json",
    input: z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().default(1)
    }),
    handler: async (input, context) => {
      return { success: true, message: "Added to cart" };
    }
  }),
  // Auth Actions (if needed for server-side handling)
  login: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6)
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
    }
  }),
  register: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      firstName: z.string(),
      lastName: z.string()
    }),
    handler: async ({ email, password, firstName, lastName }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`.trim()
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

export { server };
