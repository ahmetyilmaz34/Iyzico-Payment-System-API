"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelPayments = void 0;
var _iyzipay = _interopRequireDefault(require("../connection/iyzipay"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//! Geri ödeme işlemleri

const cancelPayments = data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.cancel.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
exports.cancelPayments = cancelPayments;