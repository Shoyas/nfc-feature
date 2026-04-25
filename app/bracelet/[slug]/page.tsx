/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";

export default async function Page({ params }: any) {
  const { slug } = params;

  const bracelet = await prisma.bracelet.findUnique({
    where: { slug }
  });

  if (!bracelet) return <div>Not Found</div>;

  const verses = await prisma.verse.findMany({
    where: { category: bracelet.category }
  });

  const random = Math.floor(Math.random() * verses.length);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold">{bracelet.category}</h1>
        <p className="mt-4 text-lg">{verses[random]?.text}</p>
      </div>
    </div>
  );
}