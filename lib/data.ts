
import fs from "fs";
import path from "path";
import { connectToDatabase } from "./mongodb";

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
  socials: Record<string, string>;
};

export type Bio = {
  name: string;
  title: string;
  tagline: string;
  about: string;
  profilePic: string;
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

const DATA_FILE = path.join(process.cwd(), "data", "siteData.json");

export async function getSiteData(): Promise<SiteData> {
  let db;
  try {
    db = await connectToDatabase();
    const collection = db.collection("siteData");
    const doc = await collection.findOne({ _id: "siteData" });
    if (doc) {
      const { _id, ...data } = doc;
      return data as SiteData;
    }
  } catch (error) {
    console.error("Error reading site data from DB:", error);
  }

  // Fallback to JSON file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content) as SiteData;
    }
  } catch (error) {
    console.error("Error reading fallback JSON:", error);
  }

  // Default data
  return {
    bio: {
      name: "Video Editor",
      title: "Portfolio",
      tagline: "Crafting stunning visuals",
      about: "Professional video editor.",
      profilePic: "",
      contact: {
        email: "",
        phone: "",
        socials: {},
      },
    },
    projects: [],
    experience: [],
    softwares: [],
    videos: [],
    reviews: [],
  };
}

export async function saveSiteData(data: SiteData): Promise<void> {
  let db;
  try {
    db = await connectToDatabase();
    const collection = db.collection("siteData");
    await collection.updateOne(
      { _id: "siteData" },
      { $set: data },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error saving site data to DB:", error);
    throw error;
  }
}
