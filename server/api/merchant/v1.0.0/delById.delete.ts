import { Prisma, PrismaClient } from "@prisma/client"
import Debug from 'debug'

const prisma = new PrismaClient();

export default defineEventHandler( async (event) => {
    const debug = Debug('api:merchant:getbyid')
    let merchant = null

    const query = getQuery(event)
    await prisma.merchants
    .delete({
        where:{id: parseInt(query.id as string)}
    })
    .then(async(res) => {
        merchant = res
    })
    .catch( async (e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
              const err = 'Delete operation failed, record not found'
              throw createError({
                statusCode:404,
                statusMessage: err
              })
              console.log(err)
            }
        }
    })


    return merchant
})