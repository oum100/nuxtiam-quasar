import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:merchant:getAll')

export default defineEventHandler(async (event) => {
    const debug = Debug('api:merchant:getall')
    const merchants = await prisma.merchants.findMany({
        include:{
            branchs:true,
            // devices:{
            //     where:{
            //         deviceState: {not: 'ASSIGNED'}
            //     }
            // },
            devices:true,
            contact:true

        }
    })
    
    return merchants
})