import { notFound } from "next/navigation";
import VideoPlayerClient from "@/app/components/VideoPlayerClient";
import { getSiteData } from "@/lib/data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VideoDetail({ params }: Props) {
  const { id } = await params;
  const siteData = await getSiteData();
  const video = siteData.videos.find((item) => item.id === id);

  if (!video) {
    notFound();
  }

  return (
    <div className="min-h-[70vh]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <VideoPlayerClient videoPath={video.filePath} title={video.title} />
      </div>
    </div>
  );
}
