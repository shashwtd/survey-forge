// Basic PING endpoint for health check

import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
    const headersList = await headers();
    const timestamp = new Date().toISOString();

    return NextResponse.json({
        status: "healthy",
        message: "pong",
        timestamp: timestamp,
        details: {
            serverTime: timestamp,
            userAgent: headersList.get("user-agent"),
            requestId: headersList.get("x-request-id") ?? crypto.randomUUID(),
            environment: process.env.NODE_ENV || "development",
        },
    });
}