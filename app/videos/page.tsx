import VideoCard from "@/app/components/VideoCard";
import Section from "@/app/components/Section";
import { getSiteData } from "@/lib/data";

export default async function VideosPage() {
  const siteData = await getSiteData();

  return (
    <div className="min-h-[70vh]">
      <Section
        title="Video Library"
        description="Play sample videos and share a quick rating after watching."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {siteData.videos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              description={video.description}
              filePath={`/videos/${video.id}`}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
