import { NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q) return NextResponse.json({ results: [] });

  try {
    const data = await searchMulti(q);
    return NextResponse.json({ results: data.results || [] });
  } catch (err) {
    console.error("Search failed:", err);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
