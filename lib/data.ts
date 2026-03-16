import fs from "fs";
import path from "path";

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string; // ISO string
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  videoPath?: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
};

export type Software = {
  id: string;
  name: string;
  description: string;
};

export type VideoItem = {
  id: string;
  title: string;
  description: string;
  filePath: string;
};

export type Contact = {
  email: string;
  phone: string;
  website: string;
  socials: Record<string, string>;
};

export type Bio = {
  name: string;
  title: string;
  tagline: string;
  about: string;
  profilePic?: string; // Path to profile picture
  contact: Contact;
};

export type SiteData = {
  bio: Bio;
  projects: Project[];
  experience: Experience[];
  softwares: Software[];
  videos: VideoItem[];
  reviews: Review[];
};

const dataFile = path.join(process.cwd(), "data", "siteData.json");
const fallbackFile = path.join(process.cwd(), "data", "initialData.json");

const defaultSiteData: SiteData = {
  bio: {
    name: "Video Editor",
    title: "Professional Editor",
    tagline: "Loading portfolio...",
    about: "Site data loading...",
    profilePic: "",
    contact: { email: "", phone: "", website: "", socials: {} },
  },
  projects: [],
  experience: [],
  softwares: [],
  videos: [],
  reviews: [],
};

export async function getSiteData(): Promise<SiteData> {
  try {
    const raw = await fs.promises.readFile(dataFile, "utf-8");
    return JSON.parse(raw) as SiteData;
  } catch (error) {
    try {
      const raw = await fs.promises.readFile(fallbackFile, "utf-8");
      return JSON.parse(raw) as SiteData;
    } catch {
      console.warn("Using default siteData - no data files found");
      return defaultSiteData;
    }
  }
}

export async function saveSiteData(data: SiteData) {
  try {
    const folder = path.dirname(dataFile);
    await fs.promises.mkdir(folder, { recursive: true });
    await fs.promises.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save siteData:", error);
  }
}

export async function addReview(rev: Omit<Review, "id" | "date">) {
  const data = await getSiteData();
  const review: Review = {
    ...rev,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString(),
  };
  data.reviews.unshift(review);
  await saveSiteData(data);
  return review;
}

export async function addVideoItem(video: Omit<VideoItem, "id">) {
  const data = await getSiteData();
  const newVideo: VideoItem = {
    ...video,
    id: `video-${Date.now()}`,
  };
  data.videos.unshift(newVideo);
  await saveSiteData(data);
  return newVideo;
}
