import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { token } = req.nextauth;
        const { pathname } = req.nextUrl;

        // Redirect logged-in users away from auth pages to dashboard
        if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup") || pathname === "/auth") {
            if (token) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

        // Admin Role-Based redirection logic
        if (pathname.startsWith("/dashboard/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // Doctor Role-Based redirection logic
        if (pathname.startsWith("/doctor-portal") && token?.role !== "doctor") {
            // If they are not a doctor (they might be pending verification), send them to dashboard
            const redirectUrl = new URL("/dashboard", req.url);
            redirectUrl.searchParams.set("error", "unauthorized_doctor");
            return NextResponse.redirect(redirectUrl);
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/auth/login",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/doctor-portal/:path*", "/appointments/:path*", "/auth/:path*", "/profile-setup"],
};
