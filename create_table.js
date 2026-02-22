const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Creating BlogPost table...");
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "BlogPost" (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        "aiSummary" TEXT,
        "readTime" TEXT,
        "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
      );
    `);
        console.log("Success!");
    } catch (e) {
        console.error("Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
