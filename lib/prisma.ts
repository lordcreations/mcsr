import { PrismaClient } from "@prisma/client";

// PrismaClient with improved connection settings for PostgreSQL
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Connection pooling settings for PostgreSQL
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Note: connectionLimit and queryEngineWaitTime are not valid PrismaClient options
    // For connection pooling in serverless, use Prisma Accelerate or configure pooling at the database level
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// For production only - add connection cleanup
if (process.env.NODE_ENV === "production") {
  // Only use connection pooling in production
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  });
}

// Function to help with serverless environments
export async function withPrisma<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await callback(prisma);
  } catch (error) {
    console.error("Prisma error:", error);
    throw error;
  } finally {
    // Connection management is handled automatically
    // No need to manually disconnect in most cases
  }
}
