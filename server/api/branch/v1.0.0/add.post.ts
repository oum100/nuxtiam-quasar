import { PrismaClient } from "@prisma/client";
import Debug from 'debug'
import { validateAddBranch } from "~/washpoint/misc/branch";

const prisma = new PrismaClient();
const debug = Debug('api:branch:add')

export default defineEventHandler( async(event)=> {
    const body = await readBody(event)
    const {error} = await validateAddBranch(body)
    if(error){
        throw createError({
            statusCode:400,
            statusMessage:error.details[0].message,
            stack:''
        })
    }

    const branch = await prisma.branchs.create({
        data:{
            branchCode: body.branchCode,
            branchName: body.branchName
        }
    })
    .catch(async(err)=>{
        throw(err.message)
    })

    return branch
})