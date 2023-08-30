/*
    This is register api perform following
    1. This api rquired header
        - Appkey
        - MerchantCode
         
        Required Body
        - deviceMac without ":"  such as Mac = AA:BB:CC:DD:EE:FF  deviceMac = AABBCCDDEEFF
        - firmware such as "1.0.0"
        - configName such as "cfg-001"   *** configName created by system administrator and provide by merchant creating api ***

    2. Create device from Mac address and firmware
    3. Bind this new device into asset (create new asset) and create machine to this asset.
    4. If configName specific. This config will bind to asset
*/
import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import jwt  from 'jsonwebtoken'
import { validateAddToAsset } from "~/washpoint/misc/device";
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890ABCDEF', 10)
const prisma = new PrismaClient();
const debug = Debug('api:device:add')

export default defineEventHandler(async (event) => {
    // console.log("Event: ",event)
    

    const appKey = event.node.req.headers.appkey
    const merchantCode = event.node.req.headers.merchantcode
    debug('appKey: ',appKey)
    debug('MerchantCode: ' ,merchantCode)

    //Check Appkey and AppSecret 
    if(!appKey || !merchantCode){
        throw createError({
            statusCode:401,
            statusMessage:'apiKey and merchantCode must provide',
            stack:""
        })
    }

    const merchantInfo = await prisma.merchants
    .findFirstOrThrow({
        where: { merchantCode : merchantCode as string}
    })
    debug('MerchantInfo: ', merchantInfo)

    const appSecret = merchantInfo.appSecret
    debug('appsec: ',appSecret)

    //Validate appKey and appSecret
    const merchantSecret = jwt.verify(appKey as string,appSecret as string)
    debug("MerchantSecret: ",merchantSecret)
    if(!merchantSecret) {
        throw createError({
            statusCode:401,
            statusMessage:'Unauthorized'
        })
    }
    
    //Validate request Body
    const body = await readBody(event)
    debug('Body: ',body)
    const { error } = await validateAddToAsset(body)
    if(error) throw createError({
        statusCode:400,
        message:error.details[0].message,
        stack:""
    })    
  
    const foundDevice = await prisma.devices
    .findUnique({
        where : { deviceMac : body.deviceMac}
    })
    debug('Found Device', foundDevice)

    if(foundDevice){
        if(foundDevice.deviceState === 'ASSIGNED'){
            //Device found and assigned to an asset then find and return asset info
            const assetInfo = await prisma.assets
            .findFirst({
                where: {assetCode: foundDevice.assetCode as string},
                include:{
                    machine:true,
                    device:true,
                    products:true,
                    config:true
                }
            })
            
            if(assetInfo){
                return {
                        description: 'This deviceMac registered with follogin information',
                        asset: assetInfo,
                    }
            }
        }else{
            //Device found with unassign to an asset then reject this request
            throw createError({
                statusCode:501,
                statusMessage: "This device was registered but not assign to an Asset. Please assign first.",
                stack:''
            })
            
        }
    }else{
        debug('If deviceMac not found')
        const config = await prisma.configs.findUniqueOrThrow({
            where:{configCode: body.configCode}
        })
        debug('Config: ',config)
        
        const assetInfo = {
            assetCode: nanoid() as string,
            assetName: body.assetName as string,
            configName: body.configName,
            device:{
                create:{
                    deviceMac: body.deviceMac as string,
                    firmware: body.firmware as string,
                    deviceState: 'ASSIGNED',
                    merchantCode: merchantCode as string,
                },
            },
            machine:{create:{
            }}
        }     
    
        const asset = await prisma.assets
        .create({
            data:assetInfo as any,
            include:{
                machine:true,
                device:true,
                products:true,
                config:true
            }
        })
        .catch(async(err) => {
            throw(err)
        })
        debug(asset)

        return asset
    }
})