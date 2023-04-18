import iyzipay from "../connection/iyzipay";


//! Kullanıcı kartı oluşturuluyor
export const createUserCard = async (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.card.create(data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
};

//! Kullanıcı kartları gösteriliyor
export const getUserCards = async (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.cardList.retrieve(data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

//! Kullanıcı kartı siliniyor
export const deleteUserCard = async (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.card.delete(data, (err, result) => { 
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}
