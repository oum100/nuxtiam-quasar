import Debug from 'debug'
import Joi from 'joi'

export async function validateUpdateMachine(body:any){
    const schema = Joi.object({
        serialNumber: Joi.string().required(),
        type: Joi.string(),
        model: Joi.string(),
        orderAt: Joi.date(),
        expireAt: Joi.date()
    }).unknown(true)
    return schema.validate(body)
}

export async function validateUpdateMachineById(body:any){
    const schema = Joi.object({
        type: Joi.string(),
        model: Joi.string(),
        orderAt: Joi.date(),
        expireAt: Joi.date()
    }).unknown(true)
    return schema.validate(body)
}

