import { Prisma, PrismaClient } from "@prisma/client"
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:merchant:getbyid')

export default defineEventHandler( async (event) => {
    
    let merchant = null

    const query = getQuery(event)
    // const findId = query.id as number
    await prisma.merchants
    .findUnique({
        where:{id: parseInt(query.id as string)}
    })
    .then(async(res) => {
        merchant = res
    })
    .catch( async (e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
              const err = 'Operation failed, record not found'
              throw createError({
                statusCode:404,
                statusMessage: err
              })
              console.log(err)
            }
        }
    })

    if(!merchant) throw createError({
        statusCode:404,
        statusMessage: " merchant not found"
    })

    return merchant
})