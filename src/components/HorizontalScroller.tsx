"use client";
import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollerProps {
  children: ReactNode;
}

export default function HorizontalScroller({ children }: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });

  return (
    <div className="relative group">
      {/* Left gradient */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />

      {/* Right gradient */}
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />

      {/* Left button */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 rounded-r opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={30} />
      </button>

      {/* Right button */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 rounded-l opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={30} />
      </button>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-2 scroll-smooth hide-scrollbar relative z-0"
      >
        {children}
      </div>
    </div>
  );
}
