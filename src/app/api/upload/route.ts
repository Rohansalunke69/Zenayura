import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

        // Validate type (Extended to allow PDFs since these are documents too)
        const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        if (!validTypes.includes(file.type)) {
            return new NextResponse("Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.", { status: 400 });
        }

        // Validate size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return new NextResponse("File too large. Maximum size is 5MB.", { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary using a stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'doctor_verifications', // Save all documents in a specific folder
                    format: file.type === "application/pdf" ? "pdf" : undefined // Preserve PDF format if it is one
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            // Give the buffer to the stream and finish
            uploadStream.end(buffer);
        });

        // @ts-ignore
        const secureUrl = result?.secure_url;

        if (!secureUrl) {
            throw new Error("Failed to get secure URL from Cloudinary");
        }

        return NextResponse.json({ url: secureUrl });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
