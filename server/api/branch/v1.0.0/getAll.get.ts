import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:branch:getAll')

export default defineEventHandler(async (event) => {
    const branchs = await prisma.branchs.findMany({
        include:{
            contacts:true,
            products:true,
            assets:{
                include:{
                    device:true,
                    machine:true,
                    products:true
                }
            }
            
        }
    })
    return branchs
})