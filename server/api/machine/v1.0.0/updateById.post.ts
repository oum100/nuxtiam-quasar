import _ from 'lodash'
import { Prisma, PrismaClient } from "@prisma/client"
import Debug from 'debug'
import { validateUpdateMachineById } from '~/washpoint/misc/machine';

const prisma = new PrismaClient();
const debug = Debug('api:machine:updatebyid')

export default defineEventHandler( async(event) => {
    const query = getQuery(event)

    const body = await readBody(event)
    const {error} = await validateUpdateMachineById(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message
    }

    let newData = body
    newData.orderAt = new Date(body.orderAt)
    newData.expireAt = new Date(body.expireAt)
    
    const machine = await prisma.machines.update({
        where:{id:parseInt(query.id as string)},
        data:newData
    })
    .catch( async(err) => {
        throw (err.message)
    })

    console.log(query)
    console.log(newData)
    console.log(machine)

    return machine
})