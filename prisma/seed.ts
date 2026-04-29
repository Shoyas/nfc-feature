import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Bible verses...");

  const verses = [
    // Healing
    { text: "He heals the brokenhearted and binds up their wounds.", category: "Healing" },
    { text: "The Lord is my shepherd; I shall not want.", category: "Peace" },
    { text: "But those who hope in the Lord will renew their strength.", category: "Strength" },
    { text: "I can do all things through Christ who strengthens me.", category: "Strength" },
    { text: "Peace I leave with you; my peace I give you.", category: "Peace" },
    { text: "Fear not, for I am with you; be not dismayed, for I am your God.", category: "Identity" },
    { text: "For I know the plans I have for you, declares the Lord.", category: "Identity" },
  ];

  // Clear existing verses to avoid duplicates if re-running
  // await prisma.verse.deleteMany({});

  for (const verse of verses) {
    await prisma.verse.create({
      data: verse,
    });
  }

  // Create a test bracelet
  await prisma.bracelet.upsert({
    where: { slug: "test-bracelet" },
    update: {},
    create: {
      slug: "test-bracelet",
      nfcCode: "test-code",
      category: "Peace",
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
