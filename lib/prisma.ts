import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  });
}

export async function withPrisma<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await callback(prisma);
  } catch (error) {
    console.error("Prisma error:", error);
    throw error;
  } finally {
  }
}
