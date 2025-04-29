// middleware.ts
import { withClerkMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Wrap middleware with Clerk to enforce auth
const clerkMiddleware = (req: NextRequest) => {
  console.log("Clerk middleware triggered:", req.nextUrl.pathname);
  return NextResponse.next();
};

export default withClerkMiddleware(clerkMiddleware);

export const config = {
  matcher: [
    // Allow public access to specific paths and exclude static/API files
    "/((?!_next|.*\\..*|api|about|contact|faqs|privacy|terms|category|product|$).*)",
  ],
};
