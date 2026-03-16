"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  videoPath: string;
  title: string;
};

export default function VideoPlayerClient({ videoPath, title }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [watched, setWatched] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  useEffect(() => {
    if (!videoRef.current) return;

    const onEnded = () => setWatched(true);
    const el = videoRef.current;
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, []);

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

  const isSubmitDisabled = status === "submitting" || comment.trim().length < 10;

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;
    setStatus("submitting");
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Guest", rating, comment }),
      });
      setStatus("sent");
    } catch {
      setStatus("idle");
      alert("Unable to submit review. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <video
          ref={videoRef}
          src={videoPath}
          controls
          className="mt-6 w-full max-w-3xl rounded-2xl bg-black"
        />
        <p className="mt-4 text-sm text-white/60">
          Watch the full video, and after it finishes we’ll ask for your rating.
        </p>
      </div>

      {watched ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">How did we do?</h2>
          <p className="mt-2 text-sm text-white/70">
            Share feedback to help us improve for the next project.
          </p>
          <div className="mt-4 flex items-center gap-3">{stars}</div>

          <textarea
            className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Tell us what you liked (at least 10 characters)"
          />

          <button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "submitting" ? "Submitting..." : status === "sent" ? "Thanks!" : "Submit Review"}
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/60">
            When the video ends, a quick feedback form will appear here. Enjoy the watch.
          </p>
        </div>
      )}
    </div>
  );
}
