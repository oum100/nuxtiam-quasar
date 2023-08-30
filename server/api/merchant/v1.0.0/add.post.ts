import { Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateMerchantBody } from "~/washpoint/misc/merchant";
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'


//This is mercharnt add API

const prisma = new PrismaClient();

export default defineEventHandler(async(event) => {
    const debug = Debug('api:merchant:add')
    const body = await readBody(event)
    const {error} = await validateMerchantBody(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    

    const appSecret = nanoid()
    const appKey = jwt.sign(body,appSecret)    
    // const configName = useRuntimeConfig().washpoint.configName

    debug('AppKey: ',appKey)
    debug('AppSecret: ',appSecret)
    // debug ('ConfigName: ',configName)
    
    const branchCode = body.branchCode
    
    const merchant = await prisma.merchants
    .create({
        data:{
            merchantCode: body.merchantCode.trim(),
            merchantName: body.merchantName.trim(),
            appKey: appKey,
            appSecret: appSecret,
            // configName: configName
            // branchs:{create:{
            //     branchCode: body.merchantName.trim()
            // }}
        }
    })
    .catch(async(e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
              const err = 'There is a unique constraint violation, cannot create new record'
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