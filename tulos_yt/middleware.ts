import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
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

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};

