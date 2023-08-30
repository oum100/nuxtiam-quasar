import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:config:getAll')

export default defineEventHandler(async (event) => {
    const machines = await prisma.configs.findMany({
        include:{
            hostCFG:true,
            wifiCFG:true,
            mqttCFG:true
        }
    })
    return machines

    
})