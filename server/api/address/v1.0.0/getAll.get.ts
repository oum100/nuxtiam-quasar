import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const addresses = await prisma.addresses.findMany()
    return addresses
})