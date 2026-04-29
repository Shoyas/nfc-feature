import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()

  const bracelet = await prisma.bracelet.create({
    data: {
      slug: body.slug,
      nfcCode: body.nfcCode,
      category: body.category,
    },
  })

  return Response.json(bracelet)
}
