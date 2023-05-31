import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const contacts = await prisma.contacts.findMany()
    return contacts
})