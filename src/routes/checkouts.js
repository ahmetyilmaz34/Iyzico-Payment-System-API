import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Checkout from "../services/iyzico/methods/checkouts";
import * as Cards from "../services/iyzico/methods/cards";
import nanoid from "../utils/nanoid";
import { CompletePayment } from "../utils/payments";
import Iyzipay from "iyzipay";

export default (router) => {
    //! CHECKOUT FORM COMPLETE PAYMENT
    router.post("/checkout/complete/payment", async (req, res) => { // herkese açık route bu route en tepede olmalı. Hiyerarşik olarak aşağıya doğru routelar yazılır.
        let result = await Checkout.getFormPayment({
            locale: "tr",
            conversationId: nanoid(),
            token: req.body.token // iyzipayin bize gönderdiği token bilgisi
        });
        await CompletePayment(result);
        res.json(result); 
    })
}