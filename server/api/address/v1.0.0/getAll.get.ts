import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:address:getAll')

export default defineEventHandler(async (event) => {
    const addresses = await prisma.addresses.findMany()
    return addresses
})