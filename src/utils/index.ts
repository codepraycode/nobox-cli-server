import { NextResponse } from "next/server";

export function Respond(data: Record<string, any>, status:number = 200) {

    return NextResponse.json(data, { status });
}