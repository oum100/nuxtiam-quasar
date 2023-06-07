import _ from 'lodash'
import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateUpdateMachine } from "~/washpoint/misc/machine";

const prisma = new PrismaClient();
const debug = Debug('api:machine:update')


export default defineEventHandler( async(event) => {
    const body = await readBody(event)
    const {error} = await validateUpdateMachine(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    const dat = _.omit(body,['serialNumber'])
    console.log(dat)

    const machine = await prisma.machines.update({
        where:{serialNumber: body.serialNumber},
        data:dat
    })
    .catch( async(err) => {
        throw (err.message)
    })

    return machine
    
})