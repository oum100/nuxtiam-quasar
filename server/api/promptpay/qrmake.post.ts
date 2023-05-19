import Debug from 'debug'
import promptpay from 'promptpay-js'

export default defineEventHandler(async (event) => {
  const debug = Debug('api:promptpay:qrmake')
  let response:any = ''

  const body = await readBody(event)
  
  const {billerID, reference1, reference2, amount} = body

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
        terminalID:'0000000000591352'
    }
  })
  debug(payload)
  response = {
    statusCode: 200,
    qrtext: payload,
  }
  return response
})