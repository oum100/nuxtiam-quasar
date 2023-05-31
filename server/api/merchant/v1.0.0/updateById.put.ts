import { Prisma, PrismaClient } from "@prisma/client"
import { validateMerchantBody } from '~/washpoint/misc/merchant';
import Debug from 'debug'

const prisma = new PrismaClient();

export default defineEventHandler( async (event) => {
    const debug = Debug('api:merchant:getbyid')
    const body = await readBody(event)

    const {error} = await validateMerchantBody(body)
    if(error) throw createError({
        statusCode:400,
        message:error.details[0].message,
        stack:""
    })

    let merchant = null

    const query = getQuery(event)
    await prisma.merchants
    .update({
        where:{id: parseInt(query.id as string)},
        data: {merchantName: body.merchantName}
    })
    .then(async(res) => {
        merchant = res
    })
    .catch( async (e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
              const err = 'Update operation failed, record not found'
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