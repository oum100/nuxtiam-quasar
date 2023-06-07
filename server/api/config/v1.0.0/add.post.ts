// import _ from 'lodash'

import { PrismaClient } from "@prisma/client";
import Debug from 'debug';
import {hashPassword} from "~~/iam/misc/helpers";
import { validateAddConfig } from "~/washpoint/misc/config";


const prisma = new PrismaClient();
const debug = Debug('api:config:add')

export default defineEventHandler(async(event)=>{
    
    const body = await readBody(event)
    debug('Req Body: ',body)
    const {error} = await validateAddConfig(body)
    if(error) return{   
        statusCode:400,
        statusMessage: error.details[0].message 
    }

    const config = await prisma.configs.create({
        data:{
            configName: body.configName,
            appHost:body.appHost,
            mqttHost:body.mqttHost,
            mqttUser:body.mqttUser,
            mqttPass:body.mqttPass,
            mqttPort:body.mqttPort,
            backendTopic: body.backendTopic
        }
    })

    return body
})