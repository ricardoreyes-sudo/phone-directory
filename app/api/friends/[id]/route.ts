import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.friend.delete({ where: { id } });
    return NextResponse.json({ message: "Friend deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete friend" }, { status: 500 });
  }
}
