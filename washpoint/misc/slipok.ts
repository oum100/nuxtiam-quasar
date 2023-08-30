import { JSONResponse} from "~~/iam/misc/types";

export default async function slipokVerify(qrtext:string): Promise<JSONResponse>{
    const response = await $fetch("https://api.slipok.com/api/line/apikey/6732",{
        method: "POST",
        headers:{
            "x-authorization":"SLIPOKAWN46VX"
        },
        body:{
            "data":qrtext
        }
    })
    return response as JSONResponse
    
}