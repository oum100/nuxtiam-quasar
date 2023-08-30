import Debug from 'debug'
import Joi from 'joi'

export async function validateUpdate(body:any){
    const schema = Joi.object({
        assetCode: Joi.string().required(),
        assetName: Joi.string().required(),
        assetStatus:Joi.string().required()
    }).unknown(true)
    return schema.validate(body)
}

export async function validateUpdateStatus(body:any){
    const schema = Joi.object({
        assetCode: Joi.string().required(),
        assetStatus:Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateUpdateName(body:any){
    const schema = Joi.object({
        assetCode: Joi.string().required(),
        assetName: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateUpdateConfig(body:any){
    const schema = Joi.object({
        assetCode: Joi.string().required(),
        configCode: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateReplaceDevice(body:any){
    const schema = Joi.object({
        assetCode: Joi.string().required(),
        deviceMac: Joi.string().max(17).required(),
        newDeviceMac: Joi.string().max(17).required()
    })
    return schema.validate(body)
}

export async function validateAssetCode(body:any) {
    const schema = Joi.object({
        assetCode: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateAsset(body:any) {
    const schema = Joi.object({
        assetName: Joi.string().required(),
        deviceMac: Joi.string().max(17).required(),
        firmware: Joi.string().required(),
        merchantCode: Joi.string().required(),
    })
    return schema.validate(body)
}

export async function validateAssignBranch(body:any){
    const schema = Joi.object({
        assetCode: Joi.string().required(),
        branchCode: Joi.string().required()
    })
    return schema.validate(body)
}