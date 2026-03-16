"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type HeaderProps = {
  name: string;
  title: string;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/videos", label: "Videos" },
  { href: "/reviews", label: "Reviews" },
  { href: "/admin", label: "Admin" },
];

export default function Header({ name, title }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-4 px-6">
        <div>
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl font-semibold tracking-wide text-white">
              {name}
            </span>
            <span className="text-sm text-white/70">{title}</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-4 text-sm font-medium text-white/70 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3 py-2 transition-colors hover:bg-white/10 ${
                  isActive ? "text-white" : "text-white/70"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="navHighlight"
                    className="absolute inset-0 rounded-full bg-white/10"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
