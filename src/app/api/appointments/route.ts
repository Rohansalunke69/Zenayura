import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock user ID since Clerk is not fully configured
const MOCK_USER_ID = "user_12345";

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            where: { userId: MOCK_USER_ID },
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
        const body = await req.json();
        const { doctorId, date } = body;

        if (!doctorId || !date) {
            return NextResponse.json({ error: "Doctor ID and date are required" }, { status: 400 });
        }

        const appointment = await prisma.appointment.create({
            data: {
                user: { connect: { id: MOCK_USER_ID } },
                doctor: { connect: { id: doctorId } },
                date: new Date(date),
                status: "Pending"
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
