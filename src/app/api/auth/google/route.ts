import { NextRequest, NextResponse } from "next/server"


export const GET = async (_:NextRequest, res: NextResponse) => {
    

    return new Response("Ready!", { status: 200})
}