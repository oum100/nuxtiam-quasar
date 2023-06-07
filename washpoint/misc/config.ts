import Debug from 'debug'
import Joi from 'joi'

//  topic of Tasmota
//  cmnd/tasmota_123412341234/json

export async function validateAddConfig(body:any){
    const schema = Joi.object({
        configName:Joi.string().required(),
        appHost: Joi.string().required(),
        mqttHost: Joi.string().required(),
        mqttUser: Joi.string().required(),
        mqttPass: Joi.string().required(),
        mqttPort: Joi.string().required(),
        backendTopic: Joi.string()
    }).unknown(true)
    return schema.validate(body)
}

export async function validateConfigName(body:any){
    const schema = Joi.object({
        configName:Joi.string().required(),
    })
    return schema.validate(body)
}
