import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateAddProduct } from "~/washpoint/misc/product";

const prisma = new PrismaClient();
const debug = Debug('api:product:add')

export default defineEventHandler(async(event)=>{
    const body = await readBody(event)
    debug('Body: ',body)
    const {error} = await validateAddProduct(body)
    if(error) {
        throw createError({
            statusCode:400,
            statusMessage: error.details[0].message,
            stack:''
        })   
    }

    const product = await prisma.products.create({
        data:{
            sku: body.sku,
            dispName: body.dispName,
            description: body.description,
            qty: parseInt(body.qty),
            unit: body.unit,
            price: parseFloat(body.price)
        }
    })
    .catch(async(err) => {
        throw(err)
    })

    return product
})