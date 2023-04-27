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

        const { binNumber, price } = req.body;
        if (!binNumber || !price) { // bin numarası veya fiyat yoksa hata döndürecek
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

    //! Sepetin Fiyatına Göre Taksit Kontrolü
    router.post("/installments/:cartId", Session, async (req, res) => {
        const { binNumber } = req.body;
        const { cartId } = req.params; // url üzerinden kart idsini alıyoruz.
        if (!cartId) { // kart id yoksa hata vericek
            throw new ApiError("Cart id is required", 400, "cartIdRequired")
        }
        const cart = await Carts.findOne({ // sepet üzerinde arama yapıyor.
            _id: ObjectId(cartId) 
        }).populate("products", {
            _id: 1,
            price: 1
        })
        const price = cart.products.map((product) => product.price).reduce((a, b) => a + b, 0);
        // Sadece fiyat bilgilerini gönderiyoruz yukarıda ki kod sayırı ile. Reduce arraylerde soldan sağa doğru işlemler gerçekleştirir.
        if (!binNumber || !price) {
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