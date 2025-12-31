import { createClient } from '@supabase/supabase-js';
import { createServerClient as createServerClient$1 } from '@supabase/ssr';

const supabaseUrl = "https://porwuxbaftbtenvprafr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvcnd1eGJhZnRidGVudnByYWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwOTM1NzEsImV4cCI6MjA4MjY2OTU3MX0.TaoZJ9YTBGntXOCTff-4NvN3IGtviGuZ3PC1L00FmQQ";
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
const createServerClient = (cookies) => {
  return createServerClient$1(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, options);
          });
        }
      }
    }
  );
};

export { createServerClient as c, supabase as s };
