import { Types } from "mongoose";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as CamcelPayments from "../services/iyzico/methods/cancel-payments";
import nanoid from "../utils/nanoid";
import PaymentsSuccess from "../db/payment-success";


const { ObjectId } = Types;

const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];

export default (router) => {
    //! CANCEL WHOLE PAYMENT - Ödemenin tamamını iptal et
    router.post("/payments/:paymentSuccessId/cancel", Session, async (req, res) => {

        const { reason, description } = req.body;
        const { paymentSuccessId } = req.params;
        const reasonObj = {};

        if (!paymentSuccessId) { 
            throw new ApiError("PaymentSuccessId is required", 400, "paymentSuccessIdRequired");
        }
        if (reason && description) {
            if (!reasonEnum.includes(reason)) {
                throw new ApiError("Invalid cancel payment reason", 400, "invalidCancelPaymentReason");
            }
            reasonObj.reason = reason;
            reasonObj.description = description;
        }
        const payment = await PaymentsSuccess.findOne({ _id: new ObjectId(paymentSuccessId) });
        const result = await CamcelPayments.cancelPayments({
            locale: req.user.locale,
            conversationId: nanoid(),
            paymentId: payment?.paymentId, // ödeme idsi üzeriden iptal işlemini gerçekleştireceğiz.
            ip: req.user?.ip,
            ...reasonObj // reasonObj içerisindeki her key özellikler buraya aktarılıyor.
        })
        res.json(result);
    })
}