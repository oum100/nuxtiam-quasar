import { PrismaClient } from "@prisma/client"
import Debug from 'debug'


const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const debug = Debug('api:merchant:getall')
    const merchants = await prisma.merchants.findMany()
    
    return merchants
})