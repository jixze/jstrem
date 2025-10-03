"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname(); // current URL path

  const tabs = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movie" },
    { name: "TV Shows", href: "/tv" },
  ];

  return (
    <nav className="bg-transparent-900 sticky top-0 z-50 w-full shadow-md">
      <div className="w-full">
        <div className="flex items-center h-16 justify-start space-x-4 px-4">

          {/* Site Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png" // replace with your logo path in /public
              alt="JStrem Logo"
              width={120}
              height={40}
              className="object-contain filter invert" // makes black logo white
            />
          </Link>

          {/* Search Icon */}
          <Link
            href="/search"
            className="p-2 rounded-full bg-transparent-700 text-gray-300 hover:bg-neutral-700 hover:text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.7)]"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Tabs */}
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  px-4 py-2 rounded-full font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "bg-neutral-600 text-white shadow-lg"
                      : "bg-transparent-700 text-gray-300 hover:bg-neutral-700 hover:text-white hover:shadow-[oklch(98.5% 0.001 106.423)]"
                  }
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
