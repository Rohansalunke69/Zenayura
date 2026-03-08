import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const doctor = await prisma.doctor.findUnique({
            where: { userId: session.user.id },
        });

        return NextResponse.json(doctor || {});
    } catch (e: any) {
        console.error("Profile GET Error:", e);
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, specialty, location, experience, bio, consultationFee, contactInfo, timeSlots } = body;

        // Basic validation
        const parsedExperience = parseInt(experience);
        const parsedFee = parseFloat(consultationFee);

        if (experience !== undefined && isNaN(parsedExperience)) {
            return NextResponse.json({ error: "Invalid experience value" }, { status: 400 });
        }
        if (consultationFee !== undefined && isNaN(parsedFee)) {
            return NextResponse.json({ error: "Invalid consultation fee value" }, { status: 400 });
        }


        const doctor = await prisma.doctor.upsert({
            where: { userId: session.user.id },
            update: {
                name,
                specialty,
                location,
                experience: isNaN(parsedExperience) ? 0 : parsedExperience,
                bio,
                consultationFee: isNaN(parsedFee) ? 500 : parsedFee,
                contactInfo,
                timeSlots
            },
            create: {
                user: { connect: { id: session.user.id } },
                name: name || "New Doctor",
                specialty: specialty || "General Ayurveda",
                location: location || "Online",
                experience: isNaN(parsedExperience) ? 0 : parsedExperience,
                bio,
                consultationFee: isNaN(parsedFee) ? 500 : parsedFee,
                contactInfo,
                timeSlots
            }
        });

        return NextResponse.json({ message: "Profile saved successfully", doctor });
    } catch (e: any) {
        console.error("Profile POST Error:", e);
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}
