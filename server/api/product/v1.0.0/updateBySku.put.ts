import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateUpdateProduct } from "~/washpoint/misc/product";

const prisma = new PrismaClient();
const debug = Debug('api:product:updateBySku')

export default defineEventHandler(async(event)=>{
    const body = await readBody(event)
    const {error} = await validateUpdateProduct(body)
    if(error){
        throw createError({
            statusCode:400,
            statusMessage:error.details[0].message,
            stack:''
        })
    }

    const product = await prisma.products.update({
        where:{sku:body.sku},
        data:{
            dispName: body.dispName,
            description: body.description,
            qty: parseInt(body.qty),
            unit: body.unit,
            price: parseFloat(body.price)
        }
    })
    .catch(async(err)=>{
        throw(err)
    })

    return product
})