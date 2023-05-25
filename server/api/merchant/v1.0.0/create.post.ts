import { Prisma, PrismaClient } from "@prisma/client";
import { nanoid } from 'nanoid'
import {H3Event,H3Error} from 'h3'
import {Merchant} from '~~/washpoint/misc/types'
import Debug from 'debug'

const prisma = new PrismaClient();
async function validateMerchant (event: H3Event): Promise<H3Error |void>{

    const bodyError = await validateMerchantBody(event)

    if(bodyError){
        return createError({ statusCode: 400, statusMessage: bodyError });
    }
}

async function validateMerchantBody(event: H3Event) {
    const body = await readBody(event)

    if("merchantCode" in body === false || body.merchantCode.trim() == ""){
        return "'merchantCode' is required";
    }

    if("merchantName" in body === false || body.merchantName.trim() == ""){
        return "'merchantName' is required";
    }
    
}


async function getMerchantById (id:number){
    let merchant = null

    await prisma.merchants
    .findFirst({
        where:{id:id}
    })
    .then(async (response) =>{
        merchant = response
    })
    .catch(async (e)=> {
        console.error(e)
    })
}


export default defineEventHandler(async(event) => {
    
    const bodyError = await validateMerchant(event)

    const body = await readBody(event)

    let merchant = {}
    let merchantError = null


    await prisma.merchants
    .create({
        data: {
            merchantCode: body.merchantCode.trim(),
            merchantName: body.merchantName.trim(),
            apikey:"",
            apisecret:""
        },
    })
    .then(async(response) =>{
        merchant = response
    })
    .catch(async(e) => {
        console.error(e)
        merchantError = e
    })

    if(merchantError){
        throw createError({
            statusCode:400,
            statusMessage: "Server Error"
        })
    }
    
    return merchant

})