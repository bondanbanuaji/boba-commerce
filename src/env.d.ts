/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { User } from '@supabase/supabase-js';

declare global {
    namespace App {
        interface Locals {
            user: User | null;
            isAuthenticated: boolean;
        }
    }
}

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;
    readonly DATABASE_URL: string;
    readonly SITE_URL: string;
    readonly PUBLIC_SITE_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export { };
