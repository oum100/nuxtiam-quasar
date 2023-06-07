import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateAsset } from "~/washpoint/misc/asset";
import { customAlphabet } from 'nanoid'
import _ from "../../iam/authn/[...]";

const nanoid = customAlphabet('1234567890ABCDEFGHIGKLMNOPQRSTUVWXYZ', 10)


const prisma = new PrismaClient();
const debug = Debug('api:asset:add')

export default defineEventHandler(async(event)=>{
    const body = await readBody(event)
    debug(body)
    const {error} = await validateAsset(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    //Check deviceMac is exist ?
    const foundDevice = await prisma.devices.findFirst({
        where: {deviceMac: body.deviceMac}
    })    

    if(foundDevice){
        throw {
            statusCode:400,
            statusMessage:'Adding failed due to an deviceMac was found.',
            stack:''
        }
    }

    //Check assetName is exist ?
    const foundAsset = await prisma.assets.findFirst({
        where: {assetName: body.assetName},
        include:{
            machine:true,
            device:true,
            products:true
        }
    })
    if(foundAsset){
        throw {
            statusCode:400,
            statusMessage:'Adding failed due to an assetName was found.',
            stack:''
        }
    }
    
    const assetInfo = {
        assetCode: nanoid() as string,
        assetName: body.assetName as string,
        device:{create:{
            deviceMac: body.deviceMac as string,
            firmware: body.firmware as string,
            deviceState: 'ASSIGNED',
            merchantCode: body.merchantCode as string
        }},
        machine:{create:{
        }}
    }   

    const asset = await prisma.assets.create({
        data:assetInfo as any,
        include:{
            machine:true,
            device:true,
            products:true,
            config:true
        }
    })

    debug('NewAsset: ',asset)
    return asset
    
})