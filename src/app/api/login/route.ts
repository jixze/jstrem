import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // Get accounts from environment variable
  const accounts = (process.env.USERS || "").split(",").map((a) => {
    const [user, pass] = a.split(":");
    return { username: user, password: pass };
  });

  const user = accounts.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Create a simple session token
  const token = Buffer.from(`${username}:${password}`).toString("base64");

  return NextResponse.json({ success: true, token });
}
