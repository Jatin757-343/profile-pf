"use client";

import { Review } from "@/lib/data";
import { motion } from "framer-motion";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}
      transition={{ type: "spring", stiffness: 250, damping: 22 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{review.name}</p>
          <p className="text-xs text-white/50">{new Date(review.date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-amber-300">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={index < review.rating ? "text-amber-300" : "text-white/20"}>
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/70">{review.comment}</p>
    </motion.div>
  );
}
