import Debug from 'debug'
import promptpay from 'promptpay-js'

import { validateMaeManee } from '~/washpoint/misc/qrcode';


export default defineEventHandler(async (event) => {
  const debug = Debug('api:qrcode:maemanee')
  const body = await readBody(event)

  debug('Body: ',body)
  const {error} = await validateMaeManee(body)
  if (error) {
    return {
      statusCode:400, 
      statusMessage: error.details[0].message
    }
  }

  let response:any = ''
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

  debug('Payload: ',payload)
  //Save to database

  
  response = {
    statusCode: 200,
    transactionID:"",
    qrtext: payload,
  }
  return response
  
})