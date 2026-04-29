import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ nfcCode: string }> }
) {
  const { nfcCode } = await params;

  try {
    const bracelet = await prisma.bracelet.findUnique({
      where: { nfcCode },
    });

    if (!bracelet) {
      // If no bracelet found with this NFC code, redirect to home or an error page
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect to the bracelet's specific page using its slug
    return NextResponse.redirect(new URL(`/bracelet/${bracelet.slug}`, request.url));
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
