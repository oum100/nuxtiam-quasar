import {Prisma, PrismaClient } from "@prisma/client";
import Debug from 'debug'
import jwt  from 'jsonwebtoken'
import { validateAddToAsset } from "~/washpoint/misc/device";
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890ABCDEFGHIGKLMNOPQRSTUVWXYZ', 10)
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
            where:{configName: body.configName}
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
        .catch(async(e) => {
            throw(e.message)
            // if (e instanceof Prisma.PrismaClientKnownRequestError) {
            //     // The .code property can be accessed in a type-safe manner
            //     if (e.code === 'P2002') {
            //       const err = 'There is a unique constraint violation, cannot create new record'
            //       throw createError({
            //         statusCode:404,
            //         statusMessage: err
            //       })
            //       console.log(err)
            //     }
            // }
        })
        debug(asset)

        // const updateconfig = await prisma.configs.update({
        //     where:{configName: body.configName},
        //     data:{
        //         assetCode: assetInfo.assetCode
        //     }
        // })
        // .catch(async(err)=>{
        //     throw(err.message)
        // })

        // debug('Config: ',updateconfig)

        return asset


        // if(asset){
        //     return {
        //         merchantCode:assetInfo.device.create.merchantCode,
        //         assetCode: assetInfo.assetCode,
        //         assetName: assetInfo.assetName,
        //         device:{
        //             deviceMac:assetInfo.device.create.deviceMac,
        //             firmware:assetInfo.device.create.firmware,
        //             deviceState:assetInfo.device.create.deviceState
        //         }
        //     }
        // }else{ 
        //     throw ("Operation failed cannot add an asset")
        // }
    }
})