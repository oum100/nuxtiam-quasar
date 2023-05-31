import { Prisma, PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();
export default defineEventHandler( async(event) => {
    console.log("Event: ",event)
    
    const body = await readBody(event)
    const appKey = event.node.req.headers.appkey
    const appSecret = event.node.req.headers.appsecret
    const merchantCode = event.node.req.headers.merchantcode

    console.log("appKey: ",appKey)
    console.log("appSecret: ",appSecret)
    console.log("merchantCode: ",merchantCode)
    console.log("body: ",body)

    // if(event.node.req.method === 'GET')

    const result = jwt.verify(appKey,appSecret)
    console.log('Result: ',result)

    return body
})