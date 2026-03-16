"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function VideoCard({
  title,
  description,
  filePath,
}: {
  title: string;
  description: string;
  filePath: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm text-white/70">{description}</p>
        </div>
        <Link
          href={filePath}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/15"
        >
          Play
        </Link>
      </div>
    </motion.div>
  );
}
