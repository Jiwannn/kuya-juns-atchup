import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Protect admin routes
    if (path.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      
      if (token.role !== 'admin') {
        console.log('Non-admin attempted to access admin page:', token.email);
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // Protect checkout and orders for non-logged in users
    if (path.startsWith('/checkout') || path.startsWith('/orders')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/dashboard/:path*",
  ],
};