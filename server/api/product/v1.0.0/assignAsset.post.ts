import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateProductAsset } from "~/washpoint/misc/product";

const prisma = new PrismaClient();
const debug = Debug('api:product:assignAsset')

export default defineEventHandler( async(event)=>{
    const body = await readBody(event)
   
    const {error} = await validateProductAsset(body)
    if(error){
        throw createError({
            statusCode:400,
            statusMessage:error.details[0].message,
            stack:''
        })
    }

    let asset = body.assetCode
    if(body.assetCode === 'NULL'){
        asset = null
    }

    const product = await prisma.products.update({
        where: { sku: body.sku},
        data:{
            assetCode: asset
        }
    })
    .catch(async(err)=>{
        throw(err)
    })

    return product

})