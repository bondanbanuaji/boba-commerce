import { useState } from 'react';
import { Button } from '@components/react/ui/Button';
import { Input } from '@components/react/ui/Input';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.href = '/account';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" required minLength={8} />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                    </>
                ) : (
                    'Create Account'
                )}
            </Button>
        </form>
    );
}
