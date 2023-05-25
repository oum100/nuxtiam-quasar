import Debug from 'debug'
import promptpay from 'promptpay-js'
import { H3Event } from 'h3';

async function validateMaeManee( event: H3Event) {
  const debug = Debug('api:qrcode:validateMaeManee')
  const body = await readBody(event)

  debug('This is body',body)
  if("billerID" in body === false){
    return "'billerID' is required "
  }
  if(body.billerID.length != 15){
    return " 'billerID must be 15 digits"
  }
  
  if("reference1" in body === false){
    return " 'reference1' is required"
  }
  if((body.reference1.length < 1) || body.reference1.length >20){
    return " 'reference1' must be 1-20 digits"
  }

  if("reference2" in body === false){
    return " 'reference2' is required"
  }
  if((body.reference2.length < 1) || body.reference2.length >20){
    return " 'reference2' must be 1-20 digits"
  }
  

  if('amount' in body === false){
    return " 'amount is required"
  }
  if(parseFloat(body.amount) < 1){
    return " 'amount cannot be zero"
  }

  if('terminalID' in body === false) {
    return " 'terminalID' is required"
  }
  if(body.terminalID.length < 1 || body.terminalID.length >26){
    return " 'terminalID must be 1-26 dights"
  }
}

export default defineEventHandler(async (event) => {
  const debug = Debug('api:qrcode:maemanee')
  let response:any = ''

  const bodyError = await validateMaeManee(event)
  if (bodyError) {
    return createError ({statusCode:400, statusMessage: bodyError, stack:""})
  }

  const body = await readBody(event)
  const {billerID, reference1, reference2, amount, terminalID} = body
  const payload = promptpay.generate({
    method: 'QR_DYNAMIC',
    application: 'PROMPTPAY_BILL_PAYMENT',
    billerID:billerID,
    reference1:reference1,
    reference2:reference2,
    amount:amount,
    currencyCode: '764',
    countryCode: 'TH',
    additional:{
        terminalID:terminalID
    }
  })

  debug(payload)
  //Save to database

  
  response = {
    statusCode: 200,
    transactionID:"",
    qrtext: payload,
  }
  return response
})