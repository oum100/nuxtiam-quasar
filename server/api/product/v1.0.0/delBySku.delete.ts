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

    const product = await prisma.products.delete({
        where: {sku: body.sku}
    })
    .catch(async(err)=>{
        throw(err)
    })

    let result={
        description: 'Product deleted successfully',
        product: product
    }
    return result
})