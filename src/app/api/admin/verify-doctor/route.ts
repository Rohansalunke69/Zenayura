import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Strict Security Check
        if (!session || !session.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
        }

        const body = await req.json();
        const { doctorId, userId, action } = body;

        if (!doctorId || !userId || !["APPROVED", "REJECTED"].includes(action)) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        // Run transaction to ensure consistency
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update Doctor Verification Status
            const doctor = await tx.doctor.update({
                where: { id: doctorId },
                data: {
                    verificationStatus: action,
                    verifiedAt: action === "APPROVED" ? new Date() : null
                }
            });

            // 2. ONLY if approved, update the User role. 
            // If rejected, keep them as user.
            let user = null;
            if (action === "APPROVED") {
                user = await tx.user.update({
                    where: { id: userId },
                    data: { role: 'doctor' }
                });
            }

            return { doctor, user };
        });

        return NextResponse.json({
            message: `Doctor successfully ${action}`,
            doctor: result.doctor
        });

    } catch (e: any) {
        console.error("Verification Error:", e);
        return NextResponse.json({ error: e.message || "An error occurred during verification" }, { status: 500 });
    }
}
