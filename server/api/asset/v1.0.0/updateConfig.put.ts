import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import {validateUpdateConfig } from "~/washpoint/misc/asset";

const prisma = new PrismaClient();
const debug = Debug('api:asset:updateConfig')

export default defineEventHandler(async(event)=> {
    const body = await readBody(event)
    const {error} = await validateUpdateConfig(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message,
        stake:''
    }

    const asset = await prisma.assets
    .update({
        where:{assetCode:body.assetCode},
        data:{
            configCode: body.configCode      
        }
    })
    .catch(async(err) => {
        throw createError({
            statusCode:400,
            message: err.message,
            stack:''
        })
         
    })
    
    return asset
})