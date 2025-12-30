import { useStore } from '@nanostores/react';
import { $toasts, removeToast, type Toast as ToastType } from '@stores/ui';
import { cn } from '@lib/utils';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
    error: AlertCircle,
};

const colors = {
    success: 'bg-boba-success text-white',
    warning: 'bg-boba-warning text-white',
    info: 'bg-boba-info text-white',
    error: 'bg-boba-error text-white',
};

export function ToastContainer() {
    const toasts = useStore($toasts);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}

function ToastItem({ toast }: { toast: ToastType }) {
    const Icon = icons[toast.type];

    return (
        <div
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-slide-in-right",
                colors[toast.type]
            )}
        >
            <Icon className="h-5 w-5" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
