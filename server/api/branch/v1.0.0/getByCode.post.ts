import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateBranchCode } from "~/washpoint/misc/branch";

const prisma = new PrismaClient();
const debug = Debug('api:branch:getByCode')

export default defineEventHandler(async (event) => {
    const body= await readBody(event)
    const {error} = await validateBranchCode(body)
    if(error){
        throw createError({
            statusCode:400,
            statusMessage: error.details[0].message,
            stack:''
        })
    }

    const branchs = await prisma.branchs.findUniqueOrThrow({
        where:{branchCode:body.branchCode},
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