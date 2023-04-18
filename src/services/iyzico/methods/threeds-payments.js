import iyzipay from '../connection/iyzipay'
// * önce bankaya yönlendiriliyor daha sonra iyzico ya onay gönderiliyor.
//! 3d secure ödemesini başlatıyoruz.
export const initializePayment = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.threedsInitialize.create(data, (err, result) => {
            if(err){
                reject(err);
            }
            else {
                resolve(result);
            }
        })
    })
}


//! 3d secure tamamlama methodu
export const completePayment = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.threedsPayment.create(data, (err, result) => {
            if(err){
                reject(err);
            }
            else {
                resolve(result);
            }
        })
    })
}