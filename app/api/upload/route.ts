import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getTokenFromRequest } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        // Require authentication
        const payload = await getTokenFromRequest(request);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
        }

        // Convert File to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "stayindia/hotels",
                        transformation: [
                            { width: 1200, height: 800, crop: "fill", gravity: "auto", quality: "auto:good" },
                        ],
                        format: "webp",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
