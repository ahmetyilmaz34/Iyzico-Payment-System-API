"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _carts = _interopRequireDefault(require("../db/carts"));
var _users = _interopRequireDefault(require("../db/users"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var _Session = _interopRequireDefault(require("../middlewares/Session"));
var Payments = _interopRequireWildcard(require("../services/iyzico/methods/payments"));
var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var _payments2 = require("../utils/payments");
var _iyzipay = _interopRequireDefault(require("iyzipay"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  //! YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDETMİYORUZ
  router.post("/payments/:cartId/with-new-card", _Session.default, async (req, res) => {
    const {
      card
    } = req.body; // json olarak gelen kart bilgisini alıyoruz.
    if (!card) {
      // kart yoksa yani bilgiler gelmediyse hata döndürecek
      throw new _ApiError.default("Card is required", 400, "cardRequired");
    }
    if (!req.params?.cartId) {
      // karta tanımlanan id bilgisi
      throw new _ApiError.default("Card id is required", 400, "cardIdRequired");
    }
    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products"); // sepeti çağırıyoruz.
    // parametre filtrelemesi yapmadan bütün bilgilerin gelmesini populate ile sağladık. buyer ve ürün bilgileri gelmiş oldu.
    if (!cart) {
      // kart yoksa yani sepet bilgisi yoksa hata döndürecek
      throw new _ApiError.default("Cart not found", 400, "cartNotFound");
    }
    if (cart?.completed) {
      // sepetin tamamlanıp tamamlanmadığını kontrol ediyor ve hata döndürüyor.
      throw new _ApiError.default("Cart is Completed", 400, "cartCompleted");
    }
    card.registerCard = "0"; // kartın kaydedilip kaydedilmemesini sağlıyor burada kaydetmiyoruz.
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0); // Ödenecek fiyat.
    // ürünün fiyatlarını map ile dönüyor. Reduce ile soldan sağa doğru büyün keylerin üzerinden geçerek topmalam işlemini gerçekleştiriyor.
    // 0 parametresi, 0 dan başlayıp bütün ürünlerin fiyatlarını toplayacak.
    const data = {
      // createPayment içerisindeki bilgileri obje olarak ödeme fonksiyonuna gönderiyoruz.
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installment: "1",
      basketId: String(cart?._id),
      // sepet idsi
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      paymentCard: card,
      // body üzerinden gelen kart bilgisi
      buyer: {
        id: String(req.user._id),
        // kullanıcı idsi
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
        // iyzico istenilen formatta veriyi alamazsa hata verir.
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode
      },
      shippingAddress: {
        // Kargo adresi
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        // Fatura adresi
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, index) => {
        // Ürünlerin verileri
        // map ile bir array döndürmek istiyoruz.
        return {
          // map ile  dönülecek arrayin bilgileri return edilecek
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await Payments.createPayment(data); //ödeme methodunu çağırıyoruz.
    await (0, _payments2.CompletePayment)(result); // ödeme durumunu gösteriyor failed success
    res.json(result);
  });
};
exports.default = _default;