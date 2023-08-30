import Debug from 'debug'
import Joi from 'joi'

//  topic of Tasmota
//  cmnd/tasmota_123412341234/json

export async function validateAddConfig(body:any){
    const schema = Joi.object({
        configCode:Joi.string().required(),
        appHost: Joi.string().required(),
        appPort: Joi.string().required(),
        appPath: Joi.string().required(),
        wifiSSID:Joi.string().required(),
        wifiPass:Joi.string().required(),
        mqttHost: Joi.string().required(),
        mqttUser: Joi.string().required(),
        mqttPass: Joi.string().required(),
        mqttPort: Joi.string().required(),
        publishTopic: Joi.string().required(),
        subscribeTopic: Joi.string().required()
    }).unknown(true)
    return schema.validate(body)
}

export async function validateConfigName(body:any){
    const schema = Joi.object({
        configCode:Joi.string().required(),
    })
    return schema.validate(body)
}
