"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompletePayment = void 0;
var _mongoose = require("mongoose");
var _paymentSuccess = _interopRequireDefault(require("../db/payment-success"));
var _paymentFailed = _interopRequireDefault(require("../db/payment-failed"));
var _carts = _interopRequireDefault(require("../db/carts"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  ObjectId
} = _mongoose.Types;

// ! Ödeme tamamlama Utils fonksiyonu
const CompletePayment = async result => {
  // result iyzicodan gelen sonuçdur.
  if (result?.status === "success") {
    // result ya failed ya da success oluyordu.
    await _carts.default.updateOne({
      _id: ObjectId(result?.basketId)
    }, {
      $set: {
        // sepet verisini güncelliyoruz.
        completed: true // ödemenin gerçeleşdiğini gösteriyor.
      }
    });

    await _paymentSuccess.default.create({
      // kullanıcıya gösterilecek kısımlar
      status: result.status,
      cartId: result?.basketId,
      // sepet id 
      conversationId: result?.conversationId,
      currency: result?.currency,
      paymentId: result?.paymentId,
      price: result?.price,
      paidPrice: result?.paidPrice,
      // ürünlerin ilişkilendirilmesini kontrol eden bir değişkendi.
      itemTransactions: result?.itemTransactions.map(item => {
        return {
          itemId: item?.itemId,
          paymentTransactionId: item?.paymentTransactionId,
          price: item?.price,
          paidPrice: item?.paidPrice
        };
      }),
      log: result // legal bir durumda tüm sonuçları log şeklinde göstermek için.
    });
  } else {
    // ödeme olmadığında 
    await _paymentFailed.default.create({
      status: result?.status,
      conversationId: result?.conversationId,
      errorCode: result?.errorCode,
      errorMessage: result?.errorMessage,
      log: result
    });
  }
};
exports.CompletePayment = CompletePayment;