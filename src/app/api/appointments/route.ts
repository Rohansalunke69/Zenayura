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
        const { doctorId, date } = body;

        if (!doctorId || !date) {
            return NextResponse.json({ error: "Doctor ID and date are required" }, { status: 400 });
        }

        const appointment = await prisma.appointment.create({
            data: {
                user: { connect: { id: session.user.id } },
                doctor: { connect: { id: doctorId } },
                date: new Date(date),
                status: "PENDING"
            },
            include: { doctor: true }
        });

        return NextResponse.json({ message: "Appointment booked successfully", appointment });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { appointmentId, status } = body;

        if (!appointmentId || !status) {
            return NextResponse.json({ error: "Appointment ID and status are required" }, { status: 400 });
        }

        const appointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status }
        });

        return NextResponse.json({ message: "Appointment status updated", appointment });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
