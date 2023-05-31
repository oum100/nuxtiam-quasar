import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import jwt  from 'jsonwebtoken'
import { validateDevicefirmware } from "~/washpoint/misc/device";
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwzyzABCDEFGHIGKLMNOPQRSTUVWXYZ', 10)
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const debug = Debug('api:device:add')
    // console.log("Event: ",event)

    const appKey = event.node.req.headers.appkey
    const merchantCode = event.node.req.headers.merchantcode
    debug('appKey: ',appKey)
    debug('MerchantCode: ' ,merchantCode)

    //Check Appkey and AppSecret 
    if(!appKey || !merchantCode){
        throw createError({
            statusCode:401,
            statusMessage:'apiKey and merchantCode must provide',
            stack:""
        })
    }

    const merchantInfo = await prisma.merchants
    .findFirstOrThrow({
        where: { merchantCode : merchantCode as string}
    })
    debug('MerchantInfo: ', merchantInfo)

    const appSecret = merchantInfo.appSecret
    debug('appsec: ',appSecret)

    //Validate appKey and appSecret
    const merchantSecret = jwt.verify(appKey as string,appSecret)
    debug("MerchantSecret: ",merchantSecret)
    if(!merchantSecret) {
        throw createError({
            statusCode:401,
            statusMessage:'Unauthorized'
        })
    }
    
    //Validate request Body
    const body = await readBody(event)
    const { error } = await validateDevicefirmware(body)
    if(error) throw createError({
        statusCode:400,
        message:error.details[0].message,
        stack:""
    })    
  
    const info = {
        deviceMac: body.deviceMac as string,
        firmware: body.firmware as string,
        merchantCode: merchantCode  as string 
    }    

    
    const device = await prisma.devices
    .create({
        data:info
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

    return device   
})