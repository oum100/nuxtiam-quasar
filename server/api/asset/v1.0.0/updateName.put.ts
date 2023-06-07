import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateUpdateName } from "~/washpoint/misc/asset";

const prisma = new PrismaClient();
const debug = Debug('api:asset:updateName')

export default defineEventHandler(async(event)=> {
    
    const body = await readBody(event)
    const {error} = await validateUpdateName(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    if(body.assetName.toLowerCase() === 'null'){
        body.assetName = null
    }

    const asset = await prisma.assets
    .update({
        where:{assetCode:body.assetCode},
        data:{
            assetName: body.assetName
        }
    })
    .catch(async(err) => {
        throw(err)
    })
    
    return asset
})