/**
 * Simple in-memory rate limiter for authentication endpoints.
 * 
 * Uses IP-based tracking with sliding window.
 * NOT for production with multiple instances — use Redis/Upstash for scale.
 */

interface RateLimitEntry {
  attempts: number[];
  blockedUntil: number | null;
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    // Remove entries where all attempts have expired and no active block
    entry.attempts = entry.attempts.filter((t) => now - t < 60_000);
    if (entry.attempts.length === 0 && (!entry.blockedUntil || now > entry.blockedUntil)) {
      store.delete(key);
    }
  }
}, 300_000);

export interface RateLimitConfig {
  /** Time window in seconds */
  windowSeconds: number;
  /** Max attempts within the window */
  maxAttempts: number;
  /** Block duration in seconds after exceeding max attempts (0 = no block) */
  blockDurationSeconds?: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowSeconds: 60,
  maxAttempts: 10,
  blockDurationSeconds: 300, // 5 minutes
};

const AUTH_CONFIG: RateLimitConfig = {
  windowSeconds: 60,
  maxAttempts: 5,
  blockDurationSeconds: 900, // 15 minutes
};

export function getRateLimiter(config: RateLimitConfig = DEFAULT_CONFIG) {
  return {
    check(key: string): { allowed: boolean; remaining: number; retryAfter?: number } {
      const now = Date.now();
      const entry = store.get(key) ?? { attempts: [], blockedUntil: null };

      // Check if currently blocked
      if (entry.blockedUntil && now < entry.blockedUntil) {
        const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
        return { allowed: false, remaining: 0, retryAfter };
      }

      // Remove expired attempts
      const windowMs = config.windowSeconds * 1000;
      entry.attempts = entry.attempts.filter((t) => now - t < windowMs);

      const remaining = Math.max(0, config.maxAttempts - entry.attempts.length);

      if (entry.attempts.length >= config.maxAttempts) {
        // Block the key
        if (config.blockDurationSeconds && config.blockDurationSeconds > 0) {
          entry.blockedUntil = now + config.blockDurationSeconds * 1000;
        }
        store.set(key, entry);
        return { allowed: false, remaining: 0, retryAfter: config.blockDurationSeconds };
      }

      return { allowed: true, remaining };
    },

    increment(key: string): void {
      const now = Date.now();
      const entry = store.get(key) ?? { attempts: [], blockedUntil: null };
      entry.attempts.push(now);
      store.set(key, entry);
    },

    reset(key: string): void {
      store.delete(key);
    },
  };
}

// Pre-configured limiters
export const authRateLimiter = getRateLimiter(AUTH_CONFIG);
export const defaultRateLimiter = getRateLimiter(DEFAULT_CONFIG);

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}
