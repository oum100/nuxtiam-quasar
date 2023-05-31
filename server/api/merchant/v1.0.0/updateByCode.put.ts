import { Prisma, PrismaClient } from "@prisma/client";
import {validateMerchantCode} from '~~/washpoint/misc/merchant'
import Debug from 'debug'
import { validateMerchantBody } from '~/washpoint/misc/merchant';

const prisma = new PrismaClient();
const debug = Debug('api:merchant:delbyid')

export default defineEventHandler( async (event) => {
    const body = await readBody(event)

    const {error} = await validateMerchantBody(body)
    if(error) throw createError({
        statusCode:400,
        message:error.details[0].message,
        stack:""
    })

    const merchant = await prisma.merchants
    .update({
        where: {merchantCode: body.merchantCode},
        data: {merchantName: body.merchantName}
    })
    .catch( async(e) => {
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

    debug('This is debug result: ', merchant)
    return merchant
})