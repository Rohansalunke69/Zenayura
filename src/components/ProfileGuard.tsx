import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function ProfileGuard({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (session?.user && session.user.role !== "doctor") {
        let profile = null;
        try {
            profile = await prisma.healthProfile.findUnique({
                where: {
                    userId: session.user.id
                }
            });
        } catch (error) {
            console.error("ProfileGuard DB Error:", error);
            return (
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin mb-6"></div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Connecting to Database...</h1>
                    <p className="text-slate-500 max-w-sm">
                        Our secure database is currently waking up or experiencing heavy load. Please refresh the page in a few moments.
                    </p>
                </div>
            );
        }

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
