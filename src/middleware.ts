import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { token } = req.nextauth;
        const { pathname } = req.nextUrl;

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
            signIn: "/sign-in",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/doctor-portal/:path*"],
};
