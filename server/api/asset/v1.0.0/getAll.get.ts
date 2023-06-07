import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:asset:getAll')

export default defineEventHandler(async (event) => {
    const assets = await prisma.assets.findMany({
        include:{
            device:true,
            machine:true,
            products:true,
            config:true
        }
    })
    return assets
})