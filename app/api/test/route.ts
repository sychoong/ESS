import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const headers = Object.fromEntries(req.headers.entries());
    console.log("🚀 ~ POST ~ headers:", headers)
    return NextResponse.json({ headers });
}