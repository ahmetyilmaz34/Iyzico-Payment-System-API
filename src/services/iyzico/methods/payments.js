import iyzipay from "../connection/iyzipay";


//! ödeme oluşturuyor.
export const createPayment = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.payment.create(data, (err, result) => {
            if(err){
                reject(err)
            }
            else{
                resolve(result)
            }
        })
    })
}