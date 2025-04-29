// middleware.ts
import { authMiddleware } from "@clerk/nextjs/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optional custom logic (logging)
const clerkMiddleware = (req: NextRequest) => {
  console.log("Clerk middleware triggered:", req.nextUrl.pathname);
  return NextResponse.next();
};

// Export wrapped middleware
export default authMiddleware({
  beforeAuth: clerkMiddleware, // Optional hook for pre-auth logging
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/faqs",
    "/privacy",
    "/terms",
    "/category/:slug",
    "/product/:slug",
  ],
});

// Specify which paths to apply the middleware
export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
