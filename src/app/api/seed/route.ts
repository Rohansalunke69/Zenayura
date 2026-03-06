import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const doctors = [
            { name: "Dr. Rajiv Pawar", specialty: "Ananya Ayurveda Expert", experience: 28, rating: 4.8, location: "Laxmi Nagar, Nagpur", image: "https://i.pravatar.cc/150?img=5" },
            { name: "Dr. Om Deshmukh", specialty: "Atharva Panchakarma", experience: 25, rating: 4.9, location: "Ranapratap Nagar, Nagpur", image: "https://i.pravatar.cc/150?img=9" },
            { name: "Dr. Preeti Patil", specialty: "Shree Vishwalilai Clinic", experience: 14, rating: 4.8, location: "Dharampeth, Nagpur", image: "https://i.pravatar.cc/150?img=15" },
            { name: "Dr. Shiraj Prajapati", specialty: "Kerala Panchakarma", experience: 18, rating: 4.9, location: "Parijatak Ayurveda, Nagpur", image: "https://i.pravatar.cc/150?img=12" },
        ];

        // check if doctors exist
        const docCount = await prisma.doctor.count();
        if (docCount > 0) {
            // Delete old remaining doctors first to re-seed cleanly
            await prisma.doctor.deleteMany();
        }

        for (const doc of doctors) {
            await prisma.doctor.create({ data: doc });
        }

        // Seed a mock user for development
        const existingUser = await prisma.user.findUnique({
            where: { email: "rohan@zenayura.com" }
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    id: "user_12345",
                    email: "rohan@zenayura.com",
                    name: "Rohan Salunke",
                }
            });
        }

        return NextResponse.json({ message: "Seeded successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
