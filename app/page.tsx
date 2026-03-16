"use client";

import { useEffect, useState } from 'react';
import ProfileAvatar from "@/app/components/ProfileAvatar";
import Section from "@/app/components/Section";
import { SiteData } from "@/lib/data";

export default function Home() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(data => {
        setSiteData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  const data = siteData || {
    bio: { name: "Video Editor", title: "Portfolio", tagline: "Loading...", about: "", profilePic: "", contact: { email: "", phone: "", website: "", socials: {} } },
    projects: [],
    experience: [],
    softwares: [],
    videos: [],
    reviews: [],
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20">
          <div className="space-y-5">
            {data.bio.profilePic && (
              <ProfileAvatar src={data.bio.profilePic} alt={data.bio.name} />
            )}
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {data.bio.name}
            </h1>
            <p className="max-w-3xl text-lg text-white/70">
              {data.bio.tagline}
            </p>
            <p className="max-w-3xl text-base text-white/60">
              {data.bio.about}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <a
              href="/projects"
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-white/20 hover:bg-white/10"
            >
              <h2 className="text-lg font-semibold text-white group-hover:text-amber-200">
                Work & Projects
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Browse recent edits, showreels, and video case studies.
              </p>
            </a>
            <a
              href="/videos"
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-white/20 hover:bg-white/10"
            >
              <h2 className="text-lg font-semibold text-white group-hover:text-amber-200">
                Video Library
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Watch sample videos and rate the work once you're done.
              </p>
            </a>
          </div>
        </div>
      </section>

      <Section title="Skills & Tools" description="Tools I reach for to deliver client-ready videos.">
        <div className="grid gap-6 md:grid-cols-3">
          {data.softwares.map((software) => (
            <div
              key={software.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{software.name}</h3>
              <p className="mt-2 text-sm text-white/70">{software.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Experience"
        description="A snapshot of the kinds of projects and roles I've delivered."
      >
        <div className="space-y-6">
          {data.experience.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.role}</h3>
                  <p className="text-sm text-white/60">
                    {item.company} · {item.period}
                  </p>
                </div>
                <div className="text-xs font-semibold text-white/50">
                  {item.highlights.length} highlights
                </div>
              </div>
              <p className="mt-4 text-sm text-white/70">{item.description}</p>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-white/60">
                {item.highlights.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Client Reviews" description="What clients say about working with me.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.reviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < review.rating ? "text-amber-400" : "text-white/20"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-white/50">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/70">"{review.comment}"</p>
              <p className="mt-3 text-sm font-semibold text-white">- {review.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-t border-white/10 bg-black py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-semibold text-white">Ready to Start Your Project?</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Let's discuss your video editing needs and bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`mailto:${data.bio.contact.email}`}
                className="rounded-full bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Get in Touch
              </a>
              <a
                href={data.bio.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Visit Website
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
