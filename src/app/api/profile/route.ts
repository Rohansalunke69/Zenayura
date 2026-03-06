import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock user ID since Clerk is not fully configured
const MOCK_USER_ID = "user_12345";

export async function GET() {
    try {
        const profile = await prisma.healthProfile.findUnique({
            where: { userId: MOCK_USER_ID },
        });

        return NextResponse.json(profile || {});
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { doshaType, age, weight, height, lifestyle, diet, chronicIssues } = body;

        const profile = await prisma.healthProfile.upsert({
            where: { userId: MOCK_USER_ID },
            update: {
                doshaType,
                age: age ? parseInt(age) : null,
                weight: weight ? parseFloat(weight) : null,
                height: height ? parseFloat(height) : null,
                lifestyle,
                diet,
                chronicIssues
            },
            create: {
                user: { connect: { id: MOCK_USER_ID } },
                doshaType,
                age: age ? parseInt(age) : null,
                weight: weight ? parseFloat(weight) : null,
                height: height ? parseFloat(height) : null,
                lifestyle,
                diet,
                chronicIssues
            }
        });

        return NextResponse.json({ message: "Profile saved successfully", profile });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
