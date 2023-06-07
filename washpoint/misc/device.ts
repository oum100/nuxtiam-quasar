import Debug from 'debug'
import Joi from 'joi'

export async function validateDeviceMac(body:any) {
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required()
    })
    return schema.validate(body)
}

export async function validateAddToAsset(body:any){
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required(),
        configName: Joi.string().required(),
        shortMac:Joi.string(),
        tasmotaName:Joi.string(),
        assetName: Joi.string(),
        firmware:Joi.string()
    }).unknown(true)
    return schema.validate(body)
}

export async function validateDeviceAdd(body:any){
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required(),
        configName: Joi.string(),
        shortMac:Joi.string(),
        tasmotaName:Joi.string(),
        assetName: Joi.string(),
        firmware:Joi.string()
    }).unknown(true)
    return schema.validate(body)
}

export async function validateDeviceFirmware(body:any) {
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required(),
        firmware: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateDeviceState(body:any) {
    const schema = Joi.object({
        deviceMac: Joi.string().max(17).required(),
        deviceState: Joi.string().required() // Keyword is in /prisma/schema.prisma
    })
    return schema.validate(body)
}

export async function validateReplaceBy(body:any){
    const schema = Joi.object({
        assetCode: Joi.string().required(),
        deviceMac: Joi.string().max(17).required(),
        newDeviceMac: Joi.string().max(17).required()
    })
    return schema.validate(body)
}

