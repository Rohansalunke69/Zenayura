import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock Clerk User ID for the Doctor
const MOCK_DOCTOR_USER_ID = "doctor_12345";

export async function GET() {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { userId: MOCK_DOCTOR_USER_ID },
        });

        return NextResponse.json(doctor || {});
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, specialty, location, experience, bio, consultationFee, certifications, contactInfo, timeSlots } = body;

        const doctor = await prisma.doctor.upsert({
            where: { userId: MOCK_DOCTOR_USER_ID },
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
                user: { connect: { id: MOCK_DOCTOR_USER_ID } },
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
