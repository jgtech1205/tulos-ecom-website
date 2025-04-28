// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
  console.log(" Clerk middleware triggered on:", req.nextUrl.pathname);
});
export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)", 
    "/studio/:path*"
  ],
};
