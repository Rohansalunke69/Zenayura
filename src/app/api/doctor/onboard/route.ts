import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name, specialty, location, experience, bio, consultationFee, contactInfo, timeSlots,
            licenseNumber, registrationNumber, clinicName, clinicAddress,
            degreeCertificate, governmentId, licenseDocument
        } = body;

        // Upsert the Doctor Profile with PENDING status
        const doctor = await prisma.doctor.upsert({
            where: { userId: session.user.id },
            update: {
                name,
                specialty,
                location: location || clinicAddress,
                experience: parseInt(experience) || 0,
                bio,
                consultationFee: parseFloat(consultationFee) || 500,
                contactInfo,
                timeSlots,
                licenseNumber,
                registrationNumber,
                clinicName,
                clinicAddress,
                degreeCertificate,
                governmentId,
                licenseDocument,
                verificationStatus: 'PENDING'
            },
            create: {
                user: { connect: { id: session.user.id } },
                name: name || session.user.name || "New Doctor",
                specialty: specialty || "General Ayurveda",
                location: location || clinicAddress || "Online",
                experience: parseInt(experience) || 0,
                bio,
                consultationFee: parseFloat(consultationFee) || 500,
                contactInfo,
                timeSlots,
                licenseNumber,
                registrationNumber,
                clinicName,
                clinicAddress,
                degreeCertificate,
                governmentId,
                licenseDocument,
                verificationStatus: 'PENDING'
            }
        });

        // We specifically DO NOT update the user.role here. 
        // Admin must verify the documents first.

        return NextResponse.json({
            message: "Doctor application submitted for verification",
            doctor: doctor,
            userRole: session.user.role // remains "user"
        });

    } catch (e: any) {
        console.error("Onboarding Error:", e);
        return NextResponse.json({ error: e.message || "An error occurred during onboarding" }, { status: 500 });
    }
}
