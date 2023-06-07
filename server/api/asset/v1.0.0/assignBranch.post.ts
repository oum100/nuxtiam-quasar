import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateAssignBranch } from "~/washpoint/misc/asset";

const prisma = new PrismaClient();
const debug = Debug('api:asset:assignBranch')

export default defineEventHandler(async(event)=> {
    const body = await readBody(event)
    const {error} = await validateAssignBranch(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message,
        stack:''
    }

    const asset = await prisma.assets.update({
        where:{assetCode: body.assetCode},
        data:{
            branchCode: body.branchCode
        }
    })
    .catch(async(err)=>{
        throw(err)
    })
    
    return asset
})