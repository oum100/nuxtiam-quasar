import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:config:getAll')

export default defineEventHandler(async (event) => {
    const machines = await prisma.configs.findMany()
    return machines

    
})