import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:product:delBySku')

export default defineEventHandler(async(event)=>{
    
})