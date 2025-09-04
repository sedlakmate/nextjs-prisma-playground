import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json({ users });
  } catch (err) {
    console.error("/api/users error", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
