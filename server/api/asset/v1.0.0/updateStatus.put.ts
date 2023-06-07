import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import {validateUpdateStatus } from "~/washpoint/misc/asset";

const prisma = new PrismaClient();
const debug = Debug('api:asset:updateStatus')

export default defineEventHandler(async(event)=> {
    const body = await readBody(event)
    const {error} = await validateUpdateStatus(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    const asset = await prisma.assets
    .update({
        where:{assetCode:body.assetCode},
        data:{
            assetStatus: body.assetStatus
        }
    })
    .catch(async(err) => {
        throw(err)
    })
    
    return asset
})