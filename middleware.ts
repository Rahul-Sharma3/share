import { authMiddleware } from "@clerk/nextjs";
 
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
  // Add routes that require authentication
  publicRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/", "/favicon.ico"],
  // ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/"]

});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};