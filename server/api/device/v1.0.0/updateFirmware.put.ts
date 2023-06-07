import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateDeviceFirmware } from "~/washpoint/misc/device";

const prisma = new PrismaClient();
const debug = Debug('api:device:getAll')

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {error} = await validateDeviceFirmware(body)

    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    const device = await prisma.devices.update({
        where:{deviceMac: body.deviceMac},
        data:{
            firmware: body.firmware
        }
    })


    return device
})