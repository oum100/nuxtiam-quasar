import Debug from 'debug'
import Joi from 'joi'

export async function validateProductSKU(body:any){
    const schema = Joi.object({
        sku: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateAddProduct(body:any){
    const schema = Joi.object({
        sku: Joi.string().required(),
        dispName: Joi.string().max(4),
        description: Joi.string(),
        qty: Joi.number().required(),
        unit: Joi.string().required(),
        price: Joi.number().required()
    })
    return schema.validate(body)
}

export async function validateUpdateProduct(body:any){
    const schema = Joi.object({
        sku: Joi.string().required(),
        dispName: Joi.string().max(4),
        description: Joi.string(),
        qty: Joi.number().required(),
        unit: Joi.string().required(),
        price: Joi.number().required()
    })
    return schema.validate(body)
}

export async function validateProductBranch(body:any){
    const schema = Joi.object({
        sku: Joi.string().required(),
        branchCode: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateProductAsset(body:any){
    const schema = Joi.object({
        sku: Joi.string().required(),
        assetCode: Joi.string().required()
    })
    return schema.validate(body)
}



