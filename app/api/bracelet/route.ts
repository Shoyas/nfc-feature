import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bracelets = await prisma.bracelet.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bracelets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bracelets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, nfcCode, category } = body;

    if (!slug || !nfcCode || !category) {
      return NextResponse.json({ error: "Slug, NFC Code, and Category are required" }, { status: 400 });
    }

    const bracelet = await prisma.bracelet.create({
      data: { slug, nfcCode, category },
    });

    return NextResponse.json(bracelet);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create bracelet" }, { status: 500 });
  }
}



