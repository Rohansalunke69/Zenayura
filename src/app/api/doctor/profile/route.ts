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
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, specialty, location, experience, bio, consultationFee, certifications, contactInfo, timeSlots } = body;

        const doctor = await prisma.doctor.upsert({
            where: { userId: session.user.id },
            update: {
                name,
                specialty,
                location,
                experience: parseInt(experience),
                bio,
                consultationFee: parseFloat(consultationFee),
                certifications,
                contactInfo,
                timeSlots
            },
            create: {
                user: { connect: { id: session.user.id } },
                name: name || "New Doctor",
                specialty: specialty || "General Ayurveda",
                location: location || "Online",
                experience: parseInt(experience) || 0,
                bio,
                consultationFee: parseFloat(consultationFee) || 500,
                certifications,
                contactInfo,
                timeSlots
            }
        });

        return NextResponse.json({ message: "Profile saved successfully", doctor });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
