import { PrismaClient } from "@prisma/client";

declare global{
    var prisma: PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db 

// In simple words, when we HOT RELOAD new prisma clients arent created due to this code
