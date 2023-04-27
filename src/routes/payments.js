import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Payments from "../services/iyzico/methods/payments";
import * as Cards from "../services/iyzico/methods/cards";
import nanoid from "../utils/nanoid";
import { CompletePayment } from "../utils/payments";
import Iyzipay from "iyzipay";


export default (router) => {
    //! YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDETMİYORUZ
    router.post("/payments/:cartId/with-new-card", Session, async (req, res) => {
        const { card } = req.body; // json olarak gelen kart bilgisini alıyoruz.
        if (!card) { // kart yoksa yani bilgiler gelmediyse hata döndürecek
            throw new ApiError("Card is required", 400, "cardRequired")
        }
        if (!req.params?.cartId) { // karta tanımlanan id bilgisi
            throw new ApiError("Card id is required", 400, "cardIdRequired")
        }
        const cart = await Carts.findOne({ _id: req.params?.cartId }).populate("buyer").populate("products"); // sepeti çağırıyoruz.
        // parametre filtrelemesi yapmadan bütün bilgilerin gelmesini populate ile sağladık. buyer ve ürün bilgileri gelmiş oldu.
        if (!cart) { // kart yoksa yani sepet bilgisi yoksa hata döndürecek
            throw new ApiError("Cart not found", 400, "cartNotFound")
        }
        if (cart?.completed) { // sepetin tamamlanıp tamamlanmadığını kontrol ediyor ve hata döndürüyor.
            throw new ApiError("Cart is Completed", 400, "cartCompleted")
        }
        card.registerCard = "0" // kartın kaydedilip kaydedilmemesini sağlıyor burada kaydetmiyoruz.
        const paidPrice = cart.products.map((product) => product.price).reduce((a, b) => a + b, 0); // Ödenecek fiyat.
        // ürünün fiyatlarını map ile dönüyor. Reduce ile soldan sağa doğru büyün keylerin üzerinden geçerek topmalam işlemini gerçekleştiriyor.
        // 0 parametresi, 0 dan başlayıp bütün ürünlerin fiyatlarını toplayacak.
        const data = { // createPayment içerisindeki bilgileri obje olarak ödeme fonksiyonuna gönderiyoruz.
            locale: req.user.locale,
            conversationId: nanoid(),
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installment: "1",
            basketId: String(cart?._id), // sepet idsi
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            paymentCard: card, // body üzerinden gelen kart bilgisi
            buyer: {
                id: String(req.user._id), // kullanıcı idsi
                name: req.user?.name,
                surname: req.user?.surname,
                gsmNumber: req.user?.phoneNumber,
                email: req.user?.email,
                identityNumber: req.user?.identityNumber,
                lastLoginDate: moment(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"), // iyzico istenilen formatta veriyi alamazsa hata verir.
                registrationDate: moment(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress: req.user?.address,
                ip: req.user?.ip,
                city: req.user?.city,
                country: req.user?.country,
                zipCode: req.user?.zipCode
            },
            shippingAddress: { // Kargo adresi
                contactName: req.user?.name + " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            billingAddress: { // Fatura adresi
                contactName: req.user?.name + " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            basketItems: cart.products.map((product, index) => { // Ürünlerin verileri
                // map ile bir array döndürmek istiyoruz.
                return { // map ile  dönülecek arrayin bilgileri return edilecek
                    id: String(product?._id),
                    name: product?.name,
                    category1: product?.categories[0],
                    category2: product?.categories[1],
                    itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price: product?.price
                }
            })
        }
        let result = await Payments.createPayment(data); //ödeme methodunu çağırıyoruz.
        await CompletePayment(result); // ödeme durumunu gösteriyor failed success
        res.json(result);
    })


    //! YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDET
    router.post("/payments/:cartId/with-new-card/register-card", Session, async (req, res) => {
        const { card } = req.body;
        if (!card) {
            throw new ApiError("Card is required", 400, "cardRequired")
        }
        if (!req.params?.cartId) {
            throw new ApiError("Card id is required", 400, "cardIdRequired")
        }
        const cart = await Carts.findOne({ _id: req.params?.cartId }).populate("buyer").populate("products");
        if (!cart) {
            throw new ApiError("Cart not found", 400, "cartNotFound")
        }
        if (cart?.completed) {
            throw new ApiError("Cart is Completed", 400, "cartCompleted")
        }
        if (req.user?.cardUserKey) { // sistemde carUserkey var ise bu cardUserkey i kullanıcının cardUserkeyi olarak ekleyecek
            card.cardUserKey = req.user?.cardUserKey
        }
        card.registerCard = "1" // kartı kaydediyoruz
        const paidPrice = cart.products.map((product) => product.price).reduce((a, b) => a + b, 0);

        const data = {
            locale: req.user.locale,
            conversationId: nanoid(),
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installment: "1",
            basketId: String(cart?._id),
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            paymentCard: card,
            buyer: {
                id: String(req.user._id),
                name: req.user?.name,
                surname: req.user?.surname,
                gsmNumber: req.user?.phoneNumber,
                email: req.user?.email,
                identityNumber: req.user?.identityNumber,
                lastLoginDate: moment(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationDate: moment(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress: req.user?.address,
                ip: req.user?.ip,
                city: req.user?.city,
                country: req.user?.country,
                zipCode: req.user?.zipCode
            },
            shippingAddress: {
                contactName: req.user?.name + " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            billingAddress: {
                contactName: req.user?.name + " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            basketItems: cart.products.map((product, index) => {
                return {
                    id: String(product?._id),
                    name: product?.name,
                    category1: product?.categories[0],
                    category2: product?.categories[1],
                    itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price: product?.price
                }
            })
        }
        let result = await Payments.createPayment(data);
        if (!req.user?.cardUserKey) { // cardUserKey yoksa
            const user = await Users.findOne({ _id: req.user?._id });// id üzerinden kullanıcıyı buluyoruz.
            user.cardUserKey = result?.cardUserKey; // result üzerinden gelen cardUserKeyi alıyoruz
            await user.save(); // kullanıcı bilgisini kaydediyoruz.
        }
        await CompletePayment(result);
        res.json(result);
    })

    //! HALİ HAZIRDA VAR OLAN BİR KART İLE  cardIndex KULLANARAK ÖDEME YAPMA VE KARTI KAYDETMİYORUZ
    router.post("/payments/:cartId/:cardIndex/with-registered-card-index", Session, async (req, res) => {
        let { cardIndex } = req.params; // url üzerinden indexi alıyoruz
        if (!cardIndex) { // kart index yok ise hata döndürüyoruz.
            throw new ApiError("Card index is required", 400, "cardIndexRequired")
        }
        if (!req.user?.cardUserKey) { //cardUserKey kontrolünü gerçekleştiriyoruz.
            throw new ApiError("No registred card available", 400, "cardUserKeyRequired")
        }
        const cards = await Cards.getUserCards({
            locale: req.user.locale,
            conversationId: nanoid(),
            cardUserKey: req.user?.cardUserKey
        })
        const index = parseInt(cardIndex); // cardIndexi integere çeviriyoruz.
        if (index >= cards?.cardDetails?.length) { // index numarası kart sayısından fazla ise hata verir
            throw new ApiError("Card doesn't exists", 400, "cardIndexInvalid")
        }
        const { cardToken } = cards?.cardDetails[index]; // kart index kullanarak cardtoken bilgisini aldık.

        if (!req.params?.cartId) {
            throw new ApiError("Card id is required", 400, "cardIdRequired")
        }
        const cart = await Carts.findOne({ _id: req.params?.cartId }).populate("buyer").populate("products");
        if (!cart) {
            throw new ApiError("Cart not found", 400, "cartNotFound")
        }
        if (cart?.completed) {
            throw new ApiError("Cart is Completed", 400, "cartCompleted")
        }
        const paidPrice = cart.products.map((product) => product.price).reduce((a, b) => a + b, 0);
        const card = { // kart bilgilerini gönderiyoruz.
            cardToken,
            cardUserKey: req.user?.cardUserKey
        }
        const data = {
            locale: req.user.locale,
            conversationId: nanoid(),
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installment: "1",
            basketId: String(cart?._id),
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            paymentCard: card,
            buyer: {
                id: String(req.user._id),
                name: req.user?.name,
                surname: req.user?.surname,
                gsmNumber: req.user?.phoneNumber,
                email: req.user?.email,
                identityNumber: req.user?.identityNumber,
                lastLoginDate: moment(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationDate: moment(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress: req.user?.address,
                ip: req.user?.ip,
                city: req.user?.city,
                country: req.user?.country,
                zipCode: req.user?.zipCode
            },
            shippingAddress: {
                contactName: req.user?.name + " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            billingAddress: {
                contactName: req.user?.name + " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            basketItems: cart.products.map((product, index) => {
                return {
                    id: String(product?._id),
                    name: product?.name,
                    category1: product?.categories[0],
                    category2: product?.categories[1],
                    itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price: product?.price
                }
            })
        }
        let result = await Payments.createPayment(data);
        await CompletePayment(result);
        res.json(result);
    })


}