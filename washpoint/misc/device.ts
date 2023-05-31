import Debug from 'debug'
import Joi from 'joi'

export async function validateDeviceMac(body:any) {
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required()
    })
    return schema.validate(body)
}

export async function validateDeviceAdd(body:any){
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required(),
        assetName: Joi.string(),
        firmware:Joi.string()
    }).unknown(true)
    return schema.validate(body)
}

export async function validateDevicefirmware(body:any) {
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required(),
        firmware: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateDeviceState(body:any) {
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required(),
        deviceState: Joi.string().valid('ACTIVE','REGISTERED','OUTSERVICE','ASSIGNED').required() // Keyword is in /prisma/schema.prisma
    })
    return schema.validate(body)
}