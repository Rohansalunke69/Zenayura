import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
        }

        // Update the current logged-in user to have the 'admin' role
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { role: 'admin' }
        });

        return NextResponse.json({
            message: "Success! You are now an Admin.",
            instructions: "Please log out and log back in, OR wait a moment for the session to refresh. Then visit /dashboard/admin",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                role: updatedUser.role
            }
        });

    } catch (e: any) {
        console.error("Error making admin:", e);
        return NextResponse.json({ error: e.message || "An error occurred" }, { status: 500 });
    }
}
