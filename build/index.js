"use strict";

require("express-async-errors");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _config = _interopRequireDefault(require("./config"));
var _express = _interopRequireWildcard(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import https from 'https';
// import fs from 'fs';
// import path from 'path';
// import helmet from 'helmet';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import passport from 'passport';
// import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
// import DBModels from './db'
// import GenericErrorHandler from './middlewares/GenericErrorHandler';
// import ApiError from './error/ApiError';
// import Session from './middlewares/Session';
// import Users from './db/users';
// import routes from './routes';
const envPath = _config.default?.production ? "./env/.prod" : "./env/.dev";
_dotenv.default.config({
  path: envPath
});
// console.log(process.env.DEPLOYMENT);
// console.log(process.env.HTTPS_ENABLED);

const app = (0, _express.default)(); // express app oluşturuldu.

app.use((0, _morgan.default)(process.env.LOGGER)); // Logların hepsini göstericek.
app.use(_express.default.json({
  //Yüksek dosyalar ile sunucuya atak gerçekleştirilmemesi için sınırlayıcı bir mekanizma 
  limit: "1mb" // 1mb üzerindeki json dosyalarını sunucu hata olarak görücektir.
}));

app.use(_express.default.urlencoded({
  extended: true
})); //url parametre okumak için kullanıyoruz.

app.listen(process.env.PORT, () => {
  // sunucuyu dinlemeye başladık.
  console.log("Express uygulamamız " + process.env.PORT + " üzerinden çalışmaktadır.");
});