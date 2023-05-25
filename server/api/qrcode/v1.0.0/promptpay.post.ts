import Debug from 'debug'
import promptpay from 'promptpay-js'
import { H3Event } from 'h3';

async function validatePromptPay(event:H3Event){
    const debug = Debug('api:qrcode:validatePromptPay')
    const body = await readBody(event)

    if('mobileNumber' in body && body.mobileNumber.length != 13){
        return " 'mobileNumber' mush be 13 digits"
    }

    // if('nationID' in body === false)


}

export default defineEventHandler(async (event) => {
    const debug = Debug('api:qrcode:promptpay')

    const body = await readBody(event)
    let response = ''
})