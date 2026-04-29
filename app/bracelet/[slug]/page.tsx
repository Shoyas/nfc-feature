/* eslint-disable react-hooks/purity */

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import VerseCard from "@/components/verse-card";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const bracelet = await prisma.bracelet.findUnique({
    where: { slug }
  });

  if (!bracelet) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-6">
        <div className="glass p-8 rounded-3xl text-center max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">Bracelet Not Found</h1>
          <p className="text-muted-foreground mb-6">This bracelet hasn`&apos;`t been activated yet.</p>
          <Link href="/" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const verses = await prisma.verse.findMany({
    where: { category: bracelet.category }
  });

  const randomVerse = verses.length > 0
    ? verses[Math.floor(Math.random() * verses.length)]
    : { text: "No verses found for this category.", category: bracelet.category };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full premium-gradient opacity-20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full gold-gradient opacity-10 blur-[100px]" />

      <VerseCard initialVerse={randomVerse} category={bracelet.category} />
    </div>
  );
}