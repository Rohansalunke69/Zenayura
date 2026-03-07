import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { token } = req.nextauth;
        const { pathname } = req.nextUrl;

        // Optional Role-Based redirection logic
        if (pathname.startsWith("/doctor-portal") && token?.role !== "doctor") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/sign-in",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/doctor-portal/:path*"],
};
