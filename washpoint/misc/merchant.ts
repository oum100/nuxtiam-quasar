import Debug from 'debug'
import Joi from 'joi'

export async function validateMerchantBody (body:any) {
    const schema = Joi.object({
        merchantCode: Joi.string().max(10).required(),
        merchantName: Joi.string().max(30).required()
    })
    return schema.validate(body)
}

export async function validateMerchantById (body:any) {
    const schema = Joi.object({
        id: Joi.number().required()
    })
    return schema.validate(body)
}

export async function validateMerchantCode (body:any){
    const schema = Joi.object({
        merchantCode: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateHeader(header:any){
    const schema = Joi.object({
        appkey: Joi.string().required(),
        merchantcode: Joi.string().required(),
        appsecret: Joi.string(),
    }).unknown(true)
    return schema.validate(header)
}

