import { PrismaClient } from "@prisma/client";
import Debug from 'debug'

const prisma = new PrismaClient();
const debug = Debug('api:contact:getAll')

export default defineEventHandler(async (event) => {
    const contacts = await prisma.contacts.findMany()
    return contacts
})