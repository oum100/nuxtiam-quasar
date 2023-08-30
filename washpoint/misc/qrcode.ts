import { tsUnknownKeyword } from '@babel/types'
import Debug from 'debug'
import Joi from 'joi'

export async function validatePromptPay(body:any){
    const schema = Joi.object({
        mobileNumber: Joi.string().min(13).max(13),
        nationalID: Joi.string().min(13).max(13),
        taxID: Joi.string().min(13).max(13),
        eWalletID: Joi.string().min(15).max(15),
        bankAccount:Joi.string().min(1).max(43),
        amount:Joi.number().precision(2).min(1).max(10000).required(),
    }).xor('mobileNumber', 'nationalID', 'taxID', 'eWalletID', 'bankAccount')
    return schema.validate(body)
}

export async function validateMaeManee(body:any){
    const schema = Joi.object({
        billerID: Joi.string().min(15).max(15).required(),
        reference1: Joi.string().min(1).max(20).required(),
        reference2: Joi.string().min(1).max(20).required(),
        amount:Joi.number().precision(2).min(1).max(10000).required(),
        terminalID: Joi.string().min(1).max(26).required(),
    })
    return schema.validate(body)
}