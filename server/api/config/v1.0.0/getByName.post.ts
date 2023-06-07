import { PrismaClient } from "@prisma/client";
import Debug from 'debug';
import {hashPassword} from "~~/iam/misc/helpers";
import { validateAddConfig } from "~/washpoint/misc/config";

const prisma = new PrismaClient();
const debug = Debug('api:config:add')

export default defineEventHandler(async(event)=>{
    
})