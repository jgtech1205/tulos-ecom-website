// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// You MUST export a matcher that includes /studio
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // This includes all routes
};
