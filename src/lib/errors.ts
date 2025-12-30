// src/lib/errors.ts
import { ActionError } from 'astro:actions';

export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 'UNAUTHORIZED', 401);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 'FORBIDDEN', 403);
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'BAD_REQUEST', 400);
        this.name = 'ValidationError';
    }
}

export function handleActionError(error: unknown): never {
    if (error instanceof AppError) {
        throw new ActionError({
            code: error.code as any,
            message: error.message,
        });
    }

    if (error instanceof Error) {
        // Log to monitoring service in production
        console.error('Action error:', error);

        throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        });
    }

    throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unknown error occurred',
    });
}

/**
 * Wrapper for action handlers with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    handler: T
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await handler(...args);
        } catch (error) {
            handleActionError(error);
        }
    }) as T;
}
