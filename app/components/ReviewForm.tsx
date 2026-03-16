"use client";

import { useMemo, useState } from "react";

export default function ReviewForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const stars = useMemo(() => {
    return Array.from({ length: 5 }).map((_, index) => {
      const value = index + 1;
      return (
        <button
          key={value}
          type="button"
          onClick={() => setRating(value)}
          className={`text-2xl transition ${
            value <= rating ? "text-amber-300" : "text-white/20"
          }`}
          aria-label={`Rate ${value} stars`}
        >
          ★
        </button>
      );
    });
  }, [rating]);

  const canSubmit = name.trim().length > 1 && comment.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setStatus("submitting");
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment }),
      });
      setStatus("sent");
      onSubmitted();
    } catch (error) {
      setStatus("idle");
      alert("Could not submit review. Please try again.");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-white">Share your feedback</h3>
      <p className="mt-2 text-sm text-white/70">
        Your review helps future clients understand what working together will be like.
      </p>

      <div className="mt-4 flex items-center gap-3">{stars}</div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Write your review (10+ characters)"
        className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
      />

      <button
        type="button"
        disabled={!canSubmit || status === "submitting"}
        onClick={handleSubmit}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "submitting" ? "Submitting..." : status === "sent" ? "Thank you!" : "Submit Review"}
      </button>
    </div>
  );
}
