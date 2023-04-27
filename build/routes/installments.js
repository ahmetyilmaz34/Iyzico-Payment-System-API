"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
var _moment = _interopRequireDefault(require("moment/moment"));
var _Session = _interopRequireDefault(require("../middlewares/Session"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var Installments = _interopRequireWildcard(require("../services/iyzico/methods/installments"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var _carts = _interopRequireDefault(require("../db/carts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  ObjectId
} = _mongoose.Types;
var _default = router => {
  //! Fiyata Göre Taksit Kontrolü
  router.post("/installments", _Session.default, async (req, res) => {
    const {
      binNumber,
      price
    } = req.body;
    if (!binNumber || !price) {
      // bin numarası veya fiyat yoksa hata döndürecek
      throw new _ApiError.default("Missing Parameters", 400, "missingParameters");
    }
    const result = await Installments.checkInstallment({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      binNumber: binNumber,
      price: price
    });
    res.json(result);
  });

  //! Sepetin Fiyatına Göre Taksit Kontrolü
  router.post("/installments/:cartId", _Session.default, async (req, res) => {
    const {
      binNumber
    } = req.body;
    const {
      cartId
    } = req.params; // url üzerinden kart idsini alıyoruz.
    if (!cartId) {
      // kart id yoksa hata vericek
      throw new _ApiError.default("Cart id is required", 400, "cartIdRequired");
    }
    const cart = await _carts.default.findOne({
      // sepet üzerinde arama yapıyor.
      _id: ObjectId(cartId)
    }).populate("products", {
      _id: 1,
      price: 1
    });
    const price = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    // Sadece fiyat bilgilerini gönderiyoruz yukarıda ki kod sayırı ile. Reduce arraylerde soldan sağa doğru işlemler gerçekleştirir.
    if (!binNumber || !price) {
      throw new _ApiError.default("Missing Parameters", 400, "missingParameters");
    }
    const result = await Installments.checkInstallment({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      binNumber: binNumber,
      price: price
    });
    res.json(result);
  });
};
exports.default = _default;