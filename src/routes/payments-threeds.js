import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as PaymentsThreeDS from "../services/iyzico/methods/threeds-payments";
import * as Cards from "../services/iyzico/methods/cards";
import nanoid from "../utils/nanoid";
import { CompletePayment } from "../utils/payments";
import Iyzipay from "iyzipay";


export default (router) => {

    //! Complete Payment 3D ödemesinin tamamlanması
    router.post("/threeds/payments/complete", async (req, res) => { // tamamlama modülü olduğundan iyzipaydan istek gelicek o yüzden yetkilendirme olmayacağı çin session arayazılımını vermeye gerek yok direkt bütün internete açık bir mekanizma olacak
        if (!req.body?.paymentId) { // post isteği olacapından body den bazı bilgileri alıyoruz. Ödeme idsini alıyoruz.
            throw new ApiError("Payment id is required", 400, "paymentIdReqired"); // hata döndürüyoruz
        }
        if (req.body.status !== "success") { //Başarılı bir ödeme gerçekleşmediyse status başarılı değil ise hata döndürecek. 
            throw new ApiError("Payment cant be starred because initialization is failed", 400, "initializationFailed");
        }
        const data = { // verimizi hazırlıyoruz.
            locale: "tr", // kullanıcıya özel olmadığından burayı bu şekilde alıyoruz.
            conversationId: nanoid(), // iletişim idsi
            paymentId: req.body.paymentId, // ödeme idsini body üzerinden alıyoruz
            conversationData: req.body.conversationData // apimiz üzerinden istek attırıyoruz daha sonra api 3D secure istek attırıp gerekli 3DS ekranlarını veriyor o ekranlar kullanıcı tarafından doldurulduktan sonra iyzico bu route istek atıyor ve conversationDatayı alıyoruz.
        }
        const result = await PaymentsThreeDS.completePayment(data); //iyzipaye istek atarak ödemenin tamamlanmasını istiyor.
        await CompletePayment(result); 
        res.status(200).json(result); // cevap olarak burayı döndürüyoruz.
    })

}