// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
    "/studio/:path*",
  ],
};
