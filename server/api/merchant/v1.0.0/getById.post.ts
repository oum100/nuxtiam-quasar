
import { Prisma, PrismaClient } from "@prisma/client";
import { nanoid } from 'nanoid'
import {H3Event,H3Error} from 'h3'
import Debug from 'debug'
import Joi from 'joi'

const prisma = new PrismaClient();

async function validateMerdhantById (id:any){
    
    const schema = Joi.object({
        id: Joi.number().required()
    });
    return schema.validate(id)
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

async function validateMerchantId (event:H3Event){
    const body = await readBody(event)

    if("id" in body === false){
        return "'id is required"
    }
    
}

export default defineEventHandler( async (event) => {
    const body = await readBody(event)
    
    
    const validateError =  await validateMerdhantById(body.id)
    // const validateError = await validateMerchantId(event)
    if(validateError){
        console.log('Validate',validateError)
    }

    
    // throw createError({
    //     statusCode:400,
    //     statusMessage: validateError
    // })
})