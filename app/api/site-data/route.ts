import { NextRequest, NextResponse } from "next/server";
import { getSiteData, saveSiteData, SiteData } from "@/lib/data";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch site data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Partial<SiteData>;
    const current = await getSiteData();

    // Validate and merge data
    const updated: SiteData = {
      ...current,
      ...body,
      bio: { ...current.bio, ...body.bio },
      projects: Array.isArray(body.projects) ? body.projects : current.projects,
      experience: Array.isArray(body.experience) ? body.experience : current.experience,
      softwares: Array.isArray(body.softwares) ? body.softwares : current.softwares,
      videos: Array.isArray(body.videos) ? body.videos : current.videos,
      reviews: Array.isArray(body.reviews) ? body.reviews : current.reviews,
    };

    await saveSiteData(updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating site data:", error);
    return NextResponse.json(
      { error: "Failed to update site data" },
      { status: 500 }
    );
  }
}
