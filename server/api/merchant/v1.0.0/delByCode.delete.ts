import { Prisma, PrismaClient } from "@prisma/client";
import {validateMerchantCode} from '~~/washpoint/misc/merchant'
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:merchant:delbyid')

export default defineEventHandler( async(event) =>{
    // const debug = Debug('api:merchant:delbyid')
    const body = await readBody(event)

    const {error} = await validateMerchantCode(body)
    if(error) throw createError({
        statusCode:400,
        message:error.details[0].message,
        stack:""
    })

    const merchant = await prisma.merchants
    .delete({
        where:{merchantCode: body.merchantCode},
        select:{merchantCode: true, merchantName: true}
    })
    .catch( async(e) => {
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

    debug('This is debug result: ', merchant)
    return merchant
})