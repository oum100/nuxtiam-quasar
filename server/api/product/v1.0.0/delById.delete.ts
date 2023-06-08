import { PrismaClient } from "@prisma/client";
import Debug from 'debug'


const prisma = new PrismaClient();
const debug = Debug('api:product:add')

export default defineEventHandler(async(event)=>{
    const query = getQuery(event)


    const product = await prisma.products.delete({
        where: {id: parseInt(query.id as string)}
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