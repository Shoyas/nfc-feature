import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import csv from "csv-parser";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const results: any[] = [];
    const stream = Readable.from(buffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    // Bulk insert
    // CSV headers must be 'text' and 'category'
    const verses = await prisma.verse.createMany({
      data: results.map((record: any) => ({
        text: record.text,
        category: record.category,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: `Successfully uploaded ${verses.count} verses` });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload verses" }, { status: 500 });
  }
}
