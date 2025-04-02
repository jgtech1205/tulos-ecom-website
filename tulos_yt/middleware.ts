import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect all routes *except* these:
    "/((?!_next|.*\\..*|studio|favicon.ico|fonts).*)",
  ],
};
