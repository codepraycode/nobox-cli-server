import Redis, { RedisOptions } from 'ioredis';

const REDIS_HOST='localhost'
const REDIS_PASSWORD=''
const REDIS_PORT='6379'


const default_config = {
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
    port: REDIS_PORT
}
 
export function createRedisInstance(config = default_config) {
    try {
        const options: RedisOptions = {
            host: config.host,
            lazyConnect: true,
            showFriendlyErrorStack: true,
            enableAutoPipelining: true,
            maxRetriesPerRequest: 0,
            retryStrategy: (times: number) => {
                if (times > 3) {
                    throw new Error(`[Redis] Could not connect after ${times} attempts`);
                }
                return Math.min(times * 200, 1000);
            },
        };
 
        if (config.port) {
            options.port = Number(config.port);
        }
        
        if (config.password) {
            options.password = config.password;
        }


        let redis:Redis;

        if (!global._redis) {
            // console.log("No already initialized redis!")
            redis = new Redis(options);

            global._redis = redis;
        } else {

            // console.log("Already initialized redis!")
            redis = global._redis;
        }
        
        redis.on('error', (error: unknown) => {
            console.warn('[Redis] Error connecting', error);
        });

        return redis;
    } catch (e) {
        throw new Error(`[Redis] Could not create a Redis instance`);
    }
}
