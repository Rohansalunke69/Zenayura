import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { verifyDoctorApplication, VERIFICATION_STATUS } from "@/services/doctorVerificationService";

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

        const parsedExperience = parseInt(experience);
        const parsedFee = parseFloat(consultationFee);

        if (experience !== undefined && isNaN(parsedExperience)) {
            return NextResponse.json({ error: "Invalid experience value. Must be a number." }, { status: 400 });
        }
        if (consultationFee !== undefined && isNaN(parsedFee)) {
            return NextResponse.json({ error: "Invalid consultation fee value. Must be a number." }, { status: 400 });
        }

        const verificationResult = await verifyDoctorApplication(body, session.user.id);

        // Upsert the Doctor Profile with the calculated verification status
        const doctor = await prisma.doctor.upsert({
            where: { userId: session.user.id },
            update: {
                name,
                specialty,
                location: location || clinicAddress,
                experience: isNaN(parsedExperience) ? 0 : parsedExperience,
                bio,
                consultationFee: isNaN(parsedFee) ? 500 : parsedFee,
                contactInfo,
                timeSlots,
                licenseNumber,
                registrationNumber,
                clinicName,
                clinicAddress,
                degreeCertificate,
                governmentId,
                licenseDocument,
                verificationStatus: verificationResult.status
            },
            create: {
                user: { connect: { id: session.user.id } },
                name: name || session.user.name || "New Doctor",
                specialty: specialty || "General Ayurveda",
                location: location || clinicAddress || "Online",
                experience: isNaN(parsedExperience) ? 0 : parsedExperience,
                bio,
                consultationFee: isNaN(parsedFee) ? 500 : parsedFee,
                contactInfo,
                timeSlots,
                licenseNumber,
                registrationNumber,
                clinicName,
                clinicAddress,
                degreeCertificate,
                governmentId,
                licenseDocument,
                verificationStatus: verificationResult.status
            }
        });

        // Automatically update the user's role if the application is AUTO_APPROVED
        let userRole = session.user.role;
        if (verificationResult.status === VERIFICATION_STATUS.AUTO_APPROVED) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { role: 'doctor' }
            });
            userRole = 'doctor';
        }

        return NextResponse.json({
            message: "Doctor application submitted for verification",
            doctor: doctor,
            userRole: userRole,
            verificationStatus: verificationResult.status,
            verificationScore: verificationResult.score,
            verificationReasons: verificationResult.reasons
        });

    } catch (e: any) {
        console.error("Onboarding Error:", e);
        return NextResponse.json({ error: "An internal error occurred during onboarding." }, { status: 500 });
    }
}
