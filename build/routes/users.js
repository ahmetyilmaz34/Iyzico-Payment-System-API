"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _users = _interopRequireDefault(require("../db/users"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  router.post("/login", async (req, res) => {
    const {
      email,
      password
    } = req.body; // kullanıcının email ve şifresini body üzerinden alıyoruz.
    const user = await _users.default.findOne({
      email: email
    }); // veritabanındaki modelden users bilgilerini alıyoruz. Findone ile veritabanından bir adet veri buluyoruz. email ile eşleşen kullanıcı geliyor
    if (!user) {
      throw new _ApiError.default("Incorrect password or email", 401, "userOrPasswordIncorrect");
    }
    const passwordConfirmed = await _bcryptjs.default.compare(password, user.password); // şifreleri karşılaştırıyoruz. boolean ifade değişkene dönecek.
    if (passwordConfirmed) {
      // eğer true ise bu blok çalışacak yani şifre doğru ise
      const UserJson = user.toJSON(); // kullanıcı bilgileri json dosyasına dönüştürülüyor ama şifresi bu json dosyasına eklenmiyordu siliniyordu.
      const token = _jsonwebtoken.default.sign(UserJson, process.env.JWT_SECRET); // token oluşturup jwt ile imzalancak. 
      res.json({
        // tokenı isteğin içerisine veriyoruz.
        token: `Baerer ${token}`,
        user: UserJson
      });
    } else {
      throw new _ApiError.default("Incorrect password or email", 401, "userOrPasswordIncorrect");
    }
  });
};
exports.default = _default;