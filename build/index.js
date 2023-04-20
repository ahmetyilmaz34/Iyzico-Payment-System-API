"use strict";

require("express-async-errors");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _config = _interopRequireDefault(require("./config"));
var _express = _interopRequireWildcard(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _https = _interopRequireDefault(require("https"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _helmet = _interopRequireDefault(require("helmet"));
var _cors = _interopRequireDefault(require("cors"));
var _db = _interopRequireDefault(require("./db"));
var _GenericErrorHandler = _interopRequireDefault(require("./middlewares/GenericErrorHandler"));
var _ApiError = _interopRequireDefault(require("./error/ApiError"));
var _users = _interopRequireDefault(require("./db/users"));
var _mongoose = _interopRequireDefault(require("mongoose"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//express üzerinde bir hata oldumu sunucuyu patlatmıyor çalışmaya devam ettiriyor. Bütün methodları çağırdık.

const envPath = _config.default?.production ? "./env/.prod" : "./env/.dev"; // çalışma ortamı
_dotenv.default.config({
  path: envPath
});
// console.log(process.env.DEPLOYMENT);
// console.log(process.env.HTTPS_ENABLED);

// Begin mongodb connection
_mongoose.default.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.log(err);
});
// End mongodb connection

const app = (0, _express.default)(); // express app oluşturuldu.

app.use((0, _morgan.default)(process.env.LOGGER)); // Logların hepsini göstericek.

//!Sunucu güvenligi(helmet-cors)
app.use((0, _helmet.default)()); // En tepeden gelen hataları ya da oluşan isteklerle beraber atakları engellemeye çalışır.
app.use((0, _cors.default)({
  origin: "*"
  //origin:İstek alınan adresler. Herhangi bir adresdende alınabilirdi.Tüm adreslerden istek al dedik. Tarayıcılara özeldir.
}));

app.use(_express.default.json({
  //Yüksek dosyalar ile sunucuya atak gerçekleştirilmemesi için sınırlayıcı bir mekanizma 
  limit: "1mb" // 1mb üzerindeki json dosyalarını sunucu hata olarak görücektir.
}));

app.use(_express.default.urlencoded({
  extended: true
})); //url parametre okumak için kullanıyoruz.

app.all("/", (req, res) => {
  throw new _ApiError.default("Hata oluştu.", 404, "something wrong happened");
  res.json({
    test: 1
  });
});
app.use(_GenericErrorHandler.default); // Genel hata yönetimi

if (process.env.HTTPS_ENABLED === "true") {
  const key = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/key.pem")).toString();
  const cert = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/cert.pem")).toString();
  const server = _https.default.createServer({
    key: key,
    cert: cert
  }, app);
  server.listen(process.env.PORT, () => {
    console.log("Express Uygulamamız " + process.env.PORT + " üzerinden çalışmaktadır");
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log("Express Uygulamamız " + process.env.PORT + " üzerinden çalışmaktadır");
  });
}