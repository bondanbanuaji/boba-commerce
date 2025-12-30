import { atom, computed } from 'nanostores';
import type { User } from '@supabase/supabase-js';

export const $user = atom<User | null>(null);
export const $isAuthenticated = computed($user, (user) => user !== null);
export const $userRole = computed($user, (user) =>
    user?.user_metadata?.role ?? 'customer'
);

export function setUser(user: User | null) {
    $user.set(user);
}
