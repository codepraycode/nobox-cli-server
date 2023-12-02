import { REDIS_CACHE_EXPIRY_MS, REDIS_CACHE_MAX_AGE, RedisCache } from "@/constants/redisConstant";
import { createRedisInstance } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";





export const GET = async (req:NextRequest, res: NextResponse) => {

    // Landing point for authentication redirection from nobox-core
    // Extract token, and client-id  from url
    // Save token as cache(i.e updated predefined cache with token)
    // Redirect to auth success page on the client-side of this server.
    const searchParams = req.nextUrl.searchParams
    
    const token = searchParams.get('token') as string; // extract token
    const cid = searchParams.get('callback_client') as string; // extract client id

    const isTestRequest = searchParams.get("test");
    
    let valid = true;

    // If client id is not pre-initialized in cache, discard.

    if (!Boolean(token) || !Boolean(cid)) {
        valid = false
    }
    
    const redis = createRedisInstance();

    if (valid) { // if there is indeed token and client-id
        // Check if cid is pre-initialized
        const pre_initialized_cache = await redis.get(cid)

        if (!pre_initialized_cache  || !(pre_initialized_cache === RedisCache.PROCESSING)) {
            valid = false
        }
    }


    if (!valid) {
        // Redirect to somewhere else

        // if (isTestRequest !== null) {
        //     return NextResponse.json({msg: 'ready!', cid, token, saved:valid});
        // }
        // else {
        //     return NextResponse.redirect('http://localhost:3001/');
        // }
    }


    // Save token
    await redis.del(cid);
    await redis.set(cid, token, REDIS_CACHE_EXPIRY_MS, REDIS_CACHE_MAX_AGE);

    // return new Response("Ready!", { status: 200 })

    if (isTestRequest !== null) {
        return NextResponse.json({msg: 'ready!', cid, token, saved:valid});
    }

    return NextResponse.redirect('http://localhost:3001/auth/success');
}
