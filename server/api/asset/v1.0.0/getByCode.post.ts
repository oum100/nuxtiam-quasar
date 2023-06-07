import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateAssetCode } from '~/washpoint/misc/asset';

const prisma = new PrismaClient();
const debug = Debug('api:asset:getByCode')

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {error} = await validateAssetCode(body)
    if(error){
        throw({
            statusCode:400,
            message:error.details[0].message,
            stack:''
        })
    }

    const assets = await prisma.assets.findMany({
        where:{assetCode:body.assetCode},
        include:{
            device:true,
            machine:true,
            products:true,
            config:true
        }
    })
    return assets
})