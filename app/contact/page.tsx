"use client";

import { useEffect, useState } from "react";
import Section from "@/app/components/Section";
import { SiteData } from "@/lib/data";

export default function ContactPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/site-data");
        if (res.ok) {
          const data = await res.json();
          setSiteData(data);
        }
      } catch (error) {
        console.error("Failed to load site data:", error);
      }
    };

    loadData();
  }, []);

  if (!siteData) {
    return (
      <div className="min-h-[70vh]">
        <Section title="Contact" description="Get in touch">
          <div className="flex justify-center py-12">
            <p className="text-white/60">Loading contact information...</p>
          </div>
        </Section>
      </div>
    );
  }

  const { contact, name } = siteData.bio;

  return (
    <div className="min-h-[70vh]">
      <Section
        title="Contact"
        description="Reach out to me through any of these channels."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Email */}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="mb-4 text-4xl">📧</div>
              <h3 className="mb-2 text-lg font-semibold text-white">Email</h3>
              <p className="text-sm text-white/70 mb-4">Drop me an email</p>
              <p className="font-mono text-sm text-blue-400 break-all group-hover:text-blue-300">
                {contact.email}
              </p>
            </a>
          )}

          {/* Phone */}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="mb-4 text-4xl">📞</div>
              <h3 className="mb-2 text-lg font-semibold text-white">Mobile</h3>
              <p className="text-sm text-white/70 mb-4">Give me a call</p>
              <p className="font-mono text-sm text-green-400 group-hover:text-green-300">
                {contact.phone}
              </p>
            </a>
          )}

          {/* Instagram */}
          {contact.socials?.instagram && (
            <a
              href={contact.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="mb-4 text-4xl">📱</div>
              <h3 className="mb-2 text-lg font-semibold text-white">Instagram</h3>
              <p className="text-sm text-white/70 mb-4">DM on Instagram</p>
              <p className="text-sm text-pink-400 group-hover:text-pink-300 truncate">
                @instagram
              </p>
            </a>
          )}


        </div>

        {/* Additional Contact Methods */}
        {(contact.socials?.linkedin || contact.socials?.twitter || contact.socials?.github) && (
          <div className="mt-12">
            <h3 className="mb-6 text-lg font-semibold text-white">Other Links</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {contact.socials?.linkedin && (
                <a
                  href={contact.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/30 hover:bg-white/10"
                >
                  <span className="text-xl">💼</span>
                  <span className="text-sm text-white/70 hover:text-white">LinkedIn</span>
                </a>
              )}
              {contact.socials?.twitter && (
                <a
                  href={contact.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/30 hover:bg-white/10"
                >
                  <span className="text-xl">𝕏</span>
                  <span className="text-sm text-white/70 hover:text-white">Twitter/X</span>
                </a>
              )}
              {contact.socials?.github && (
                <a
                  href={contact.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/30 hover:bg-white/10"
                >
                  <span className="text-xl">🐙</span>
                  <span className="text-sm text-white/70 hover:text-white">GitHub</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Quick Contact Message */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-center text-white/70">
            I&apos;m always open to interesting conversations. Feel free to reach out and let&apos;s connect!
          </p>
        </div>
      </Section>
    </div>
  );
}
