import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { clerkMiddleware } from "@clerk/nextjs/server";

const clerk = clerkMiddleware();

// Initialize Redis if URL is present (won't crash if missing at build time)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : null;

// Create rate limiters for different severity levels
// 1. Auth routes (Strict: 5 requests per minute)
const authRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
    })
  : null;

// 2. Payment routes (Moderate: 10 requests per minute)
const paymentRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
    })
  : null;

// 3. General API routes (Standard: 60 requests per minute)
const generalRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
    })
  : null;

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  // Only apply rate limiting to /api/* routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    
    if (redis && authRatelimit && paymentRatelimit && generalRatelimit) {
      // Extract client IP address
      const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
      
      let limitResult;
      if (request.nextUrl.pathname.startsWith("/api/auth/")) {
        limitResult = await authRatelimit.limit(ip);
      } else if (request.nextUrl.pathname.startsWith("/api/razorpay/")) {
        limitResult = await paymentRatelimit.limit(ip);
      } else {
        limitResult = await generalRatelimit.limit(ip);
      }

      if (!limitResult.success) {
        return new NextResponse(
          JSON.stringify({ 
            success: false, 
            message: "Too many requests. Please try again later." 
          }),
          { 
            status: 429, 
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limitResult.limit.toString(),
              "X-RateLimit-Remaining": limitResult.remaining.toString(),
              "X-RateLimit-Reset": limitResult.reset.toString(),
            } 
          }
        );
      }
    }
  }

  // Run Clerk Middleware for auth context injection
  return clerk(request, event);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
