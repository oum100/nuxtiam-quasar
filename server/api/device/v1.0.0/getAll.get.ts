import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:device:getAll')

export default defineEventHandler(async (event) => {
    const devices = await prisma.devices.findMany()
    return devices
})