
import { Prisma, PrismaClient } from "@prisma/client";
import { nanoid } from 'nanoid'
import {H3Event,H3Error} from 'h3'
import Debug from 'debug'
import Joi from 'joi'
import {validateMerchantCode} from '~~/washpoint/misc/merchant'

const prisma = new PrismaClient();


export default defineEventHandler( async (event) => {
    const debug = Debug('api:merchant:merchantgetbyid')
    let merchant = null
    const body = await readBody(event)
    
    const {error} = await validateMerchantCode(body)
 
    if(error) throw createError({
        statusCode:400,
        message: error.details[0].message,
        stack:''
    })

    merchant = await prisma.merchants
    .findUniqueOrThrow({
        where: {merchantCode: body.merchantCode},
        include:{
            branchs:{
                include:{
                    assets:{
                        include:{
                            device:true,
                            machine:true,
                            products:true
                        }
                    }
                }
            }
        }
    })
    .catch( async(e) => {
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
    
    return merchant

})