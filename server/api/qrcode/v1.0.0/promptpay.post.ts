import Debug from 'debug'
import promptpay from 'promptpay-js'
import { validatePromptPay } from '~/washpoint/misc/qrcode'
import { JSONResponse} from "~~/iam/misc/types";


export default defineEventHandler(async (event) => {
    const debug = Debug('api:qrcode:promptpay')

    const body = await readBody(event)
    const {error} = await validatePromptPay(body)
    if(error){
        return {
            statusCode: 400,
            statusMessage: error.details[0].message
        }
    }

    let response = null
    let payload = null

    if('mobileNumber' in body === true){
        payload = promptpay.generate({
            method: 'QR_DYNAMIC',
            application: 'PROMPTPAY_CREDIT_TRANSFER',
            mobileNumber: body.mobileNumber,
            amount:body.amount,
            currencyCode: '764',
            countryCode: 'TH'
        })
    }

    if('nationalID' in body === true){
        payload = promptpay.generate({
            method: 'QR_DYNAMIC',
            application: 'PROMPTPAY_CREDIT_TRANSFER',
            nationalID: body.nationalID,
            amount:body.amount,
            currencyCode: '764',
            countryCode: 'TH'
        })
    }


    debug('Payload: ',payload)
    //Save to database

    response = {
    statusCode: 200,
    transactionID:"",
    qrtext: payload,
    }
    return response 
})