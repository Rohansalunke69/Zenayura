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

        const appointments = await prisma.appointment.findMany({
            where: { userId: session.user.id },
            include: { doctor: true },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json({ appointments });
    } catch (e: any) {
        console.error("Appointment GET Error:", e);
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
        const { doctorId, date } = body;

        if (!doctorId || !date) {
            return NextResponse.json({ error: "Doctor ID and date are required" }, { status: 400 });
        }

        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format provided for appointment" }, { status: 400 });
        }

        const appointment = await prisma.appointment.create({
            data: {
                user: { connect: { id: session.user.id } },
                doctor: { connect: { id: doctorId } },
                date: appointmentDate,
                status: "PENDING"
            },
            include: { doctor: true }
        });

        return NextResponse.json({ message: "Appointment booked successfully", appointment });
    } catch (e: any) {
        console.error("Appointment POST Error:", e);
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "doctor") {
            return NextResponse.json({ error: "Forbidden: Only doctors can update appointments" }, { status: 403 });
        }

        const body = await req.json();
        const { appointmentId, status } = body;

        if (!appointmentId || !status) {
            return NextResponse.json({ error: "Appointment ID and status are required" }, { status: 400 });
        }

        // Verify that this doctor owns this appointment
        const doctor = await prisma.doctor.findUnique({
            where: { userId: session.user.id }
        });

        if (!doctor) {
            return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
        }

        const existingAppointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!existingAppointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        if (existingAppointment.doctorId !== doctor.id) {
            return NextResponse.json({ error: "Forbidden: You are not authorized to update this appointment" }, { status: 403 });
        }

        const appointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status }
        });

        return NextResponse.json({ message: "Appointment status updated", appointment });
    } catch (e: any) {
        // Safe error handling, avoid exposing raw errors
        console.error("Appointment Update Error:", e);
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}
