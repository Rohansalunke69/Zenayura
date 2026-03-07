import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function ProfileGuard({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (session?.user && session.user.role !== "doctor") {
        // Check if user has a health profile
        const profile = await prisma.healthProfile.findUnique({
            where: {
                userId: session.user.id
            }
        });

        // If no health profile, force them to set it up
        if (!profile) {
            redirect("/profile-setup");
        }
    }

    return (
        <>
            {children}
        </>
    );
}
