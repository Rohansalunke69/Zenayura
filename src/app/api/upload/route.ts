import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return new NextResponse("No file provided", { status: 400 });
        }

        // Validate type
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return new NextResponse("Invalid file type. Only JPG, PNG, and WEBP are allowed.", { status: 400 });
        }

        // Validate size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return new NextResponse("File too large. Maximum size is 5MB.", { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate a unique filename
        const ext = file.name.split('.').pop() || 'png';
        const filename = `${session.user.id}_${uuidv4()}.${ext}`;
        const relativePath = `/uploads/profiles/${filename}`;

        // Save to public dir
        const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
        await writeFile(path.join(uploadDir, filename), buffer);

        return NextResponse.json({ url: relativePath });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
