import Link from "next/link";

type FooterProps = {
  email: string;
  socials: Record<string, string>;
};

export default function Footer({ email, socials }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-black/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-white/70">Lets build something great together.</p>
          {email && (
            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">Email:</span> {email}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(socials).map(([name, url]) => (
            <Link
              key={name}
              href={url}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
              target="_blank"
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-white/30">
        Copyright {new Date().getFullYear()} - Built with Next.js - Designed for smooth experience
      </div>
    </footer>
  );
}