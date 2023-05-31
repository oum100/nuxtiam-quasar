import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const branchs = await prisma.branchs.findMany()
    return branchs
})