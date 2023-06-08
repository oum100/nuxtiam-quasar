import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import {validateProductBranch}from "~/washpoint/misc/product";

const prisma = new PrismaClient();
const debug = Debug('api:product:assignBranch')

export default defineEventHandler(async(event)=> {
    const body = await readBody(event)
    const {error} = await validateProductBranch(body)
    if(error) return {
        statusCode:400,
        statusMessage: error.details[0].message,
        stack:''
    }

    let branch = body.branchCode
    if(body.branchCode === 'NULL'){
        branch = null
    }

    const asset = await prisma.products.update({
        where:{sku: body.sku},
        data:{
            branchCode: branch
        }
    })
    .catch(async(err)=>{
        throw(err)
    })
    
    return asset
})