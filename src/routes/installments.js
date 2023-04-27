import { Types } from "mongoose";
import moment from "moment/moment"; 
import Session from "../middlewares/Session";
import nanoid from "../utils/nanoid";
import * as Installments from "../services/iyzico/methods/installments";
import ApiError from "../error/ApiError";
import Carts from "../db/carts";

const { ObjectId } = Types;

export default (router) => {
    //! Fiyata Göre Taksit Kontrolü
    router.post("/installments", Session, async (req, res) => {
        
        const {binNumber, price} = req.body;
        if(!binNumber || !price){ // bin numarası veya fiyat yoksa hata döndürecek
            throw new ApiError("Missing Parameters", 400, "missingParameters")
        }
        const result = await Installments.checkInstallment({
            locale: req.user.locale,
            conversationId: nanoid(),
            binNumber: binNumber,
            price: price
        })
        res.json(result)
    })
}