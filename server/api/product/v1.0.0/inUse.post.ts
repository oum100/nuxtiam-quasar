import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateProductSKU } from "~/washpoint/misc/product";

const prisma = new PrismaClient();
const debug = Debug('api:product:add')

export default defineEventHandler(async(event)=>{
    const body = await readBody(event)
    const {error} = await validateProductSKU(body)
    if(error){
        throw createError({
            statusCode:400,
            statusMessage: error.details[0].message,
            stack:''
        })
    }

    const product = await prisma.products.findUniqueOrThrow({
        where: {sku: body.sku}
    })

    if(product.assetCode){
        return {
            "status":"true",
            "description":"Product was assigned into a asset",
        }
    }

    if(product.branchCode){
        return {
            "status":"true",
            "description":"Product was assigned into a branch",
        }
    }

    return {
        "status":"false",
        "description":"Product not in use"
    }
  

})