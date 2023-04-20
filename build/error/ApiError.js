"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//! API Error objesini oluşturuldu. Alınan api hataları kullanıcıya gösterilebilecek.
class ApiError extends Error {
  constructor(message, status = 500, code) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
var _default = ApiError;
exports.default = _default;