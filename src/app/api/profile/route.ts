import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const profile = await prisma.healthProfile.findUnique({
            where: {
                userId: session.user.id
            }
        });

        if (!profile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        // Validating required fields loosely based on requirements
        const {
            fullName, age, gender, height, weight,
            healthConcern, lifestyle, dietType
        } = body;

        if (!fullName || !age || !gender || !height || !weight || !healthConcern || !lifestyle || !dietType) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // --- NEW VALIDATION: Prevent Prisma P2003 Foreign Key Error ---
        // Ensure the User ID stored in the current session actually exists in our current DB
        const existingUser = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!existingUser) {
            // The user session is stale (e.g. from an old database), refuse the upsert to protect the schema.
            return new NextResponse("Invalid Session: User not found in database.", { status: 401 });
        }
        // --------------------------------------------------------------

        // Upsert the profile (in case user double-submits)
        const profile = await prisma.healthProfile.upsert({
            where: {
                userId: session.user.id
            },
            update: {
                ...body,
                age: Number(body.age),
                height: Number(body.height),
                weight: Number(body.weight)
            },
            create: {
                ...body,
                age: Number(body.age),
                height: Number(body.height),
                weight: Number(body.weight),
                userId: session.user.id
            }
        });

        // Also update the User model's name and picture if they differ
        if (body.profilePictureUrl || body.fullName) {
            const updateData: any = {};
            if (body.fullName) updateData.name = body.fullName;
            if (body.profilePictureUrl) updateData.profilePicture = body.profilePictureUrl;

            await prisma.user.update({
                where: { id: session.user.id },
                data: updateData
            });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("POST PROFILE ERROR:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
