/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import csv from "csv-parser"
import fs from "fs"

export async function POST(req: NextRequest) {
  const file = await req.formData()
  const csvFile = file.get("file") as File

  const buffer = Buffer.from(await csvFile.arrayBuffer())
  const tempPath = "/tmp/upload.csv"

  fs.writeFileSync(tempPath, buffer)

  const results: any[] = []

  await new Promise((resolve) => {
    fs.createReadStream(tempPath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", resolve)
  })

  for (const row of results) {
    await prisma.verse.create({
      data: {
        text: row.text,
        category: row.category,
      },
    })
  }

  return Response.json({ success: true })
}
