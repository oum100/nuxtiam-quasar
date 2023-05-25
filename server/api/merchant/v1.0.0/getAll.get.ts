import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const merchants = await prisma.merchants.findMany()
    
    return merchants
})