import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function setupDatabaseUrl() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
    const dbInParentDatabase = path.join(process.cwd(), "..", "database", "dev.db");
    const dbInDatabase = path.join(process.cwd(), "database", "dev.db");
    const dbInPrisma = path.join(process.cwd(), "prisma", "dev.db");
    const originalDbPath = fs.existsSync(dbInParentDatabase) 
      ? dbInParentDatabase 
      : fs.existsSync(dbInDatabase) 
      ? dbInDatabase 
      : dbInPrisma;

    if (process.env.VERCEL) {
      const tmpDbPath = "/tmp/dev.db";
      try {
        if (!fs.existsSync(tmpDbPath) && fs.existsSync(originalDbPath)) {
          fs.copyFileSync(originalDbPath, tmpDbPath);
        }
        process.env.DATABASE_URL = `file:${tmpDbPath}`;
      } catch (err) {
        console.error("Vercel /tmp db copy error:", err);
        process.env.DATABASE_URL = `file:${originalDbPath}`;
      }
    } else {
      process.env.DATABASE_URL = `file:${originalDbPath}`;
    }
  }
}

setupDatabaseUrl();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
