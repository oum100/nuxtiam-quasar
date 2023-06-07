import Debug from 'debug'
import Joi from 'joi'

export async function validateAddBranch(body:any){
    const schema = Joi.object({
        branchCode: Joi.string().required(),
        branchName: Joi.string().required(),
    })
    return schema.validate(body)
}

export async function validateBranchCode(body:any){
    const schema = Joi.object({
        branchCode: Joi.string().required()
    })
}

export async function validateAssignMerchant(body:any){
    const schema = Joi.object({
        branchCode: Joi.string().required(),
        merchantCode: Joi.string().required()
    })
    return schema.validate(body)
}