import { Types } from "mongoose";
import PaymentSuccess from "../db/payment-success";
import PaymentFailed from "../db/payment-failed";
import Carts from "../db/carts";

const { ObjectId } = Types;


// ! Ödeme tamamlama Utils fonksiyonu
export const CompletePayment = async (result) => { // result iyzicodan gelen sonuçdur.
    if(result?.status === "success"){ // result ya failed ya da success oluyordu.
        await Carts.updateOne({_id:ObjectId(result?.basketId)}, {$set:{ // sepet verisini güncelliyoruz.
            completed: true // ödemenin gerçeleşdiğini gösteriyor.
        }})
        await PaymentSuccess.create({ // kullanıcıya gösterilecek kısımlar
            status: result.status,
            cartId: result?.basketId, // sepet id 
            conversationId: result?.conversationId,
            currency: result?.currency,
            paymentId: result?.paymentId,
            price: result?.price,
            paidPrice: result?.paidPrice, // ürünlerin ilişkilendirilmesini kontrol eden bir değişkendi.
            itemTransactions: result?.itemTransactions.map(item =>{
                return{
                    itemId: item?.itemId,
                    paymentTransactionId: item?.paymentTransactionId,
                    price: item?.price,
                    paidPrice: item?.paidPrice
                }
            }),
            log: result // legal bir durumda tüm sonuçları log şeklinde göstermek için.
        })
    }
    else{ // ödeme olmadığında 
        await PaymentFailed.create({
            status: result?.status,
            conversationId: result?.conversationId,
            errorCode: result?.errorCode,
            errorMessage: result?.errorMessage,
            log: result
        })
    }
}