import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:machine:getAll')


export default defineEventHandler( async(event) => {
    return 'machine'
})