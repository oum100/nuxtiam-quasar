// import _ from 'lodash'
// import {hashPassword} from "~~/iam/misc/helpers";
import { PrismaClient } from "@prisma/client";
import Debug from 'debug';
import { validateAddConfig } from "~/washpoint/misc/config";


const prisma = new PrismaClient();
const debug = Debug('api:config:add')

export default defineEventHandler(async(event)=>{
    
    const body = await readBody(event)
    debug('Request Body: ',body)
    const {error} = await validateAddConfig(body)
    if(error) return{   
        statusCode:400,
        statusMessage: error.details[0].message 
    }

    const config = await prisma.configs.create({
        data:{
            configCode: body.configCode,
        }
    })

    const hostcfg = await prisma.hostConfig.create({
        data:{
            configCode: body.configCode,
            appHost: body.appHost,
            appPort: body.appPort,
            appPath: body.appPath,
        }
    })

    const wificfg = await prisma.wifiConfig.create({
        data:{
            configCode: body.configCode,
            wifiSSID: body.wifiSSID,
            wifiPass: body.wifiPass,
        }
    })

    const mqttConfig = await prisma.mqttConfig.create({
        data:{
            configCode: body.configCode,
            mqttHost: body.mqttHost,
            mqttUser: body.mqttUser,
            mqttPass: body.mqttPass,
            mqttPort: body.mqttPort,
            publishTopic: body.publishTopic,
            subscribeTopic: body.subscribeTopic,
        }
    })

    const resultCFG = await prisma.configs.findUniqueOrThrow({
        where:{
            configCode: body.configCode,
        },
        include:{
            hostCFG: true,
            wifiCFG: true,
            mqttCFG: true,
        }
    })

    return resultCFG
})