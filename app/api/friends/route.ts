import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const friends = await prisma.friend.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(friends);
  } catch {
    return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, phoneNumber } = await req.json();

    if (!name?.trim() || !phoneNumber?.trim()) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    const friend = await prisma.friend.create({
      data: { name: name.trim(), phoneNumber: phoneNumber.trim() },
    });

    return NextResponse.json(friend, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create friend" }, { status: 500 });
  }
}
