import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateAssetCode } from "~/washpoint/misc/asset";

const prisma = new PrismaClient();
const debug = Debug('api:asset:delByCode')

export default defineEventHandler( async(event) => {
    const body = await readBody(event)
    debug(body)
    
    const {error} = await validateAssetCode(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    const asset = await prisma.assets.delete({
        where:{assetCode:body.assetCode}
    })
    .catch(async(err)=>{
        throw (err.message)
    })

    return asset
})