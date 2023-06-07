import { Prisma, PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { validateHeader } from "~/washpoint/misc/merchant";
import Debug from 'debug'

const prisma = new PrismaClient();

//Use for decode jwt
export default defineEventHandler( async(event) => {
    const debug = Debug('api:merchant:validateAppkey')
    const header = event.node.req.headers
    // console.log("Header: ",header)

    const {error} = await validateHeader(header)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    const appkey = header.appkey
    const merchantcode = header.merchantcode 
    debug('MerchantCode: ',merchantcode)
    let result = null

    if(header.appsecret){
        const appsecret = header.appsecret
        debug(appkey)
        debug(appsecret)
        result = jwt.verify(appkey as string ,appsecret as string)

    }else{
        const merchant = await prisma.merchants
        .findUniqueOrThrow({
            where: {merchantCode: merchantcode as string}
        })

        const appsecret = merchant.appSecret as string

        debug('AppKey: ' ,appkey)
        debug('AppSecret: ',appsecret)
        result = jwt.verify(appkey as string ,appsecret as string)
    }

    debug(result)
    return result
    
})