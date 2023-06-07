import { Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateAssignMerchant } from "~/washpoint/misc/branch";

const prisma = new PrismaClient();
const debug = Debug('api:merchant:updateBranch')

export default defineEventHandler(async(event)=>{
    const body = await readBody(event)
    const {error} = await validateAssignMerchant(body)
    if(error){
        throw createError({
            statusCode:400,
            statusMessage: error.details[0].message,
            stack:''
        })
    }

    //Check merchantCode
    const merchant = await prisma.merchants.findUniqueOrThrow({
        where:{merchantCode: body.merchantCode},
        include:{
            branchs:true
        }
    })

    //Assign merchantCode into branch record.
    const branch = await prisma.branchs.update({
        where: {branchCode: body.branchCode},
        data: { merchantCode: body.merchantCode},
        include:{
            assets:true,
        }
    })
    .catch(async(err)=>{
        throw(err.message)
    })

    return branch
})
