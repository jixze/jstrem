"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react"; // ✅ add icon (lucide-react is already in Next.js + shadcn setup)

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery || "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-2xl mx-auto"
    >
      {/* Icon */}
      <Search className="absolute left-3 text-gray-400" size={20} />

      {/* Input */}
      <input
        type="text"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies and TV shows..."
        className="
          w-full pl-10 pr-4 py-3
          rounded-full
          bg-white text-gray-900
          shadow-md
          focus:outline-none focus:ring-2 focus:ring-red-500
          placeholder-gray-500
        "
      />
    </form>
  );
}
