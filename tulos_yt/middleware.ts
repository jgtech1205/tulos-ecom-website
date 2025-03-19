import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|studio|.*\\..*).*)", // Exclude `/studio` from Clerk middleware
  ],
};
