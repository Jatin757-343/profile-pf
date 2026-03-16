"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      id={title.toLowerCase().replace(/\s+/g, "-")}
      className="mx-auto mb-16 max-w-6xl px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionVariants}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-base text-white/60">{description}</p>
        ) : null}
      </div>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
}
