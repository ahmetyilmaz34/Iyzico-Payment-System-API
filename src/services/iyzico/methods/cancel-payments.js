import iyzipay from "../connection/iyzipay";

//! Geri ödeme işlemleri

export const cancelPayments = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.cancel.create(data, (err ,result) => {
            if(err){
                reject(err)
            }
            else{
                resolve(result)
            }
        })
    })
}