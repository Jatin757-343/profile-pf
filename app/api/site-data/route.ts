import { NextRequest, NextResponse } from "next/server";
import { getSiteData, saveSiteData, SiteData } from "@/lib/data";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<SiteData>;
  const current = await getSiteData();

  const updated: SiteData = {
    ...current,
    ...body,
    bio: { ...current.bio, ...body.bio },
    projects: body.projects ?? current.projects,
    experience: body.experience ?? current.experience,
    softwares: body.softwares ?? current.softwares,
    videos: body.videos ?? current.videos,
  };

  await saveSiteData(updated);
  return NextResponse.json(updated);
}
