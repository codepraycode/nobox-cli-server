import { REDIS_CACHE_EXPIRY_MS, REDIS_CACHE_MAX_AGE, RedisCache } from "@/constants/redisConstant";
import { createRedisInstance } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { AuthResponseTemplate, AuthResponseDTO} from '@/helpers';
import { Respond } from "@/utils";



/* 
    Confirms and caches authentication token from nobox-core
    Redirect user to confirmation screen
 */
export async function GET(req:NextRequest, res:NextResponse) {
    // Obtain client id from request body/params
    // Check cache on redis
    // If cache exist without a value, return awaiting response
    // If cache exist with a value,
    //      return value
    // If cache does not exist, return auth link


    const resp:AuthResponseDTO = { ...AuthResponseTemplate };
    

    // const data = req.json();
    const query = req.nextUrl.searchParams;

    const cid = query.get('cid') as string; // client Id

    if (!Boolean(cid)) {
        resp.error = "Client-id is required!";
        return Respond(resp, 400);
    }

    // console.log("CLient request data:", cid);
    
    const redis = createRedisInstance();

    // Get cached token
    const cached_token = await redis.get(cid);

    if (!cached_token) {
        resp.link = `http://localhost:3001/auth?cid=${cid}`  // link to authenticate
        
        // pre-initialize cache
        await redis.set(cid, RedisCache.PROCESSING, REDIS_CACHE_EXPIRY_MS, REDIS_CACHE_MAX_AGE);

        return Respond(resp);
    }

    if (cached_token === RedisCache.PROCESSING) {
        resp.processing = true;
        return Respond(resp);
    }


    resp.token = cached_token;

    await redis.del(cid);
    return Respond(resp);

    // Remove token from cache since it's delivered

    // return NextResponse.redirect('http://localhost:3001/auth/success');
    // return NextResponse.json({cid}, {status: 200});

    // TODO: Document redis setup > https://redis.io/docs/install/install-stack/docker/,  http://localhost:8001/redis-stack/browser
    // TODO: Update README
}