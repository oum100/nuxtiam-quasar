import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateReplaceBy } from "~/washpoint/misc/device";

const prisma = new PrismaClient();


//In case device permanently failed. It 's allows to replace by new device to an existing Asset
export default defineEventHandler(async(event) => {
    const debug = Debug('api:device:replaceby')
    const body = await readBody(event)
    const {error} = await validateReplaceBy(body)

    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }
    console.log(body)
    
    const device = await prisma.devices.update({
        where:{ deviceMac: body.deviceMac},
        data:{
            assetCode: null,
            deviceState: 'OUTSERVICE',
            replaceBy: body.newDeviceMac,
            replaceDate: new Date()
        }
    })
    .catch( async(err:any)=>{
        throw (err.message)
    })
    console.log('Device: ',device)

    const newDevice = await prisma.devices.update({
        where:{ deviceMac: body.newDeviceMac},
        data:{
            assetCode: body.assetCode,
            deviceState: 'ASSIGNED'
        }
    })
    .catch( async(err:any)=>{
        throw (err.message)
    })
    console.log(newDevice)

    return {
        oldDevice: device,
        newDevice: newDevice
    } 
})