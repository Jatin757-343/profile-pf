"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  videoPath?: string;
};

export default function ProjectCard({ title, description, tags, videoPath }: ProjectCardProps) {
  // Validate videoPath - only show link if it's a valid local path or internal link
  const isValidPath = videoPath && (videoPath.startsWith('/videos/') || videoPath.startsWith('/uploads/'));
  
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm text-white/70">{description}</p>
        </div>
        {isValidPath ? (
          <Link
            href={videoPath}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/15"
          >
            Watch
          </Link>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
