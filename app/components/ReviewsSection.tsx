"use client";

import { useEffect, useState } from "react";
import { Review } from "@/lib/data";
import ReviewCard from "@/app/components/ReviewCard";
import ReviewForm from "@/app/components/ReviewForm";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">Client Reviews</h2>
        <p className="text-sm text-white/70">
          Ratings and comments are collected from visitors after watching a video.
        </p>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            Loading reviews…
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            No reviews yet — be the first to share feedback!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      <ReviewForm onSubmitted={load} />
    </div>
  );
}
