import { atom } from 'nanostores';

// Toast notifications
export type Toast = {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
};

export const $toasts = atom<Toast[]>([]);

export function addToast(toast: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID();
    const newToast = { ...toast, id };

    $toasts.set([...$toasts.get(), newToast]);

    // Auto-remove after duration
    setTimeout(() => {
        removeToast(id);
    }, toast.duration ?? 5000);

    return id;
}

export function removeToast(id: string) {
    $toasts.set($toasts.get().filter(t => t.id !== id));
}

// Mobile menu state
export const $isMobileMenuOpen = atom<boolean>(false);

// Search state
export const $isSearchOpen = atom<boolean>(false);
export const $searchQuery = atom<string>('');
