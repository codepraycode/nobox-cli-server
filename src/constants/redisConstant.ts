
// cache data setting an expiry of 1 hour
// this means that the cached data will remain alive for 60 minutes
// after that, we'll get fresh data from the DB
export const REDIS_CACHE_MAX_AGE = 60_000 * 60; // 1 hour
export const REDIS_CACHE_EXPIRY_MS = `PX`; // milliseconds

export enum RedisCache {
    PROCESSING = "<<PROCESSING>>"
}