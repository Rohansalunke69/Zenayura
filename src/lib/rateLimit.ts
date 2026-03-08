import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';

type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

export default function rateLimit(options?: Options) {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    return {
        check: (req: Request, limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (tokenCache.get(token) as number[]) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, [1]);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= limit;

                if (isRateLimited) {
                    reject('Rate limit exceeded');
                } else {
                    tokenCache.set(token, tokenCount);
                    resolve();
                }
            }),
    };
}

// Helper for extracting IP from standard headers
export function getIP(req: Request) {
    let ip = req.headers.get('x-real-ip');
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (!ip && forwardedFor) {
        ip = forwardedFor.split(',')[0] ?? '127.0.0.1';
    }
    return ip || '127.0.0.1';
}

export const standardRateLimit = rateLimit({ interval: 60 * 1000 }); // 60 seconds
