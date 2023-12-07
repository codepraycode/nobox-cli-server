import { Redis } from "ioredis";

declare global {
    var _redis: Redis | null;
}