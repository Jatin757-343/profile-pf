import { NextRequest, NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/data";

// Simple sanitization function to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 1000); // Max 1000 characters
}

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json({ reviews: data.reviews });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = sanitizeInput(String(body.name ?? ""));
    const rating = Number(body.rating);
    const comment = sanitizeInput(String(body.comment ?? ""));

    // Validation checks
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!comment || comment.length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const data = await getSiteData();
    const newReview = {
      id: Date.now().toString(),
      name,
      rating,
      comment,
      date: new Date().toISOString()
    };
    data.reviews.unshift(newReview);
    await saveSiteData(data);
    return NextResponse.json(newReview);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 }
    );
  }
}
