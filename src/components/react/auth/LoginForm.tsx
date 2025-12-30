import { useState } from 'react';
import { Button } from '@components/react/ui/Button';
import { Input } from '@components/react/ui/Input';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.href = '/account'; // Redirect to dashboard
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Password</label>
                    <a href="/auth/forgot-password" class="text-xs text-boba-primary hover:underline">Forgot password?</a>
                </div>
                <Input type="password" required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </Button>
        </form>
    );
}
