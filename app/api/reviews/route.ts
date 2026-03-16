import { NextRequest, NextResponse } from "next/server";
import { addReview, getSiteData } from "@/lib/data";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json({ reviews: data.reviews });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const name = String(body.name ?? "").trim();
  const rating = Number(body.rating);
  const comment = String(body.comment ?? "").trim();

  if (!name || !comment || isNaN(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Invalid review payload" },
      { status: 400 }
    );
  }

  const review = await addReview({ name, rating, comment });
  return NextResponse.json(review);
}
