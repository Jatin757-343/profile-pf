import Section from "@/app/components/Section";
import ReviewsSection from "@/app/components/ReviewsSection";

export default function ReviewsPage() {
  return (
    <div className="min-h-[70vh]">
      <Section
        title="Reviews"
        description="Read what people say after watching a full project video, or leave your own rating."
      >
        <ReviewsSection />
      </Section>
    </div>
  );
}
