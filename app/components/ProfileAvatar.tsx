"use client";

import { motion } from "framer-motion";

export default function ProfileAvatar({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className="h-32 w-32 rounded-full object-cover mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}
