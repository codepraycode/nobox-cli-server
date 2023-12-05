import { REDIS_CACHE_EXPIRY_MS, REDIS_CACHE_MAX_AGE, RedisCache } from "@/constants/redisConstant";
import { createRedisInstance } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { AuthResponseTemplate, AuthResponseDTO} from '@/helpers';
import { Respond } from "@/utils";
import { callback_client_id } from "@/constants";
import { CLI_CLIENT } from "../../../../../env/server";



/* 
    Confirms and caches authentication token from nobox-core
    Redirect user to confirmation screen
 */
export async function GET(req:NextRequest, _:NextResponse) {
    // * Obtain client id from request body/params
    // * Check cache on redis
    // * If cache exist without a value, return awaiting response
    // * If cache exist with a value,
    //      return value
    // * If cache does not exist, return auth link


    const resp:AuthResponseDTO = { ...AuthResponseTemplate };
    

    // const data = req.json();
    const query = req.nextUrl.searchParams;

    const client_id = query.get(callback_client_id) as string; // client Id

    if (!Boolean(client_id)) {
        resp.error = "Client-id is required!";
        return Respond(resp, 400);
    }

    // console.log("CLient request data:", cid);
    
    const redis = createRedisInstance();

    // Get cached token
    const cached_token = await redis.get(client_id);


    const auth_link = new URL(`${CLI_CLIENT}/auth`);
    auth_link.searchParams.append(callback_client_id, client_id)
    

    if (!cached_token) {

        resp.link = auth_link.toString()  // link to authenticate

        // pre-initialize cache
        await redis.set(callback_client_id,
            RedisCache.PROCESSING,
            REDIS_CACHE_EXPIRY_MS,
            REDIS_CACHE_MAX_AGE
        );

        return Respond(resp);
    }


    if (cached_token === RedisCache.PROCESSING) {
        resp.link = auth_link.toString()  // link to authenticate
        resp.processing = true;
        return Respond(resp);
    }


    resp.token = cached_token;

    // await redis.del(client_id);
    return Respond(resp);

    // ? CLI keeps asking for auth token, if it does not exist, then user authenticates
}