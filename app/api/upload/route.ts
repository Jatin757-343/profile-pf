import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

export const runtime = "nodejs";

config(); // Load .env.local

cloudinary.config({
  cloud_name: "dsvu1tdge",
  url: process.env.CLOUDINARY_URL,
});

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = String(formData.get("type") ?? "video"); // "video" or "image"

  if (!file) {
    return NextResponse.json(
      { error: "Missing file" },
      { status: 400 }
    );
  }

  const safeName = sanitizeFilename(file.name);
  const fileName = `${Date.now()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let result;
  try {
    if (type === "video") {
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: "video", 
            public_id: fileName.replace(/\.[^/.]+$/, ""), 
            filename_override: fileName 
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        ).end(buffer);
      }) as any;
    } else { // image
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: "image", 
            public_id: fileName.replace(/\.[^/.]+$/, ""), 
            filename_override: fileName 
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        ).end(buffer);
      }) as any;
    }

    const publicPath = result.secure_url;

    if (type === "video") {
      return NextResponse.json({
        filePath: publicPath,
        title,
        description,
      });
    } else if (type === "image") {
      return NextResponse.json({
        imagePath: publicPath,
      });
    }
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
