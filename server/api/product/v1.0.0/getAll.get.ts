import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:product:getAll')

export default defineEventHandler(async (event) => {
    const products = await prisma.products.findMany()
    return products
})