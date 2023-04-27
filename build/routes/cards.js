"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards"));
var _users = _interopRequireDefault(require("../db/users"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var _Session = _interopRequireDefault(require("../middlewares/Session"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//! Kullanıcıya Kart Ekleme
var _default = router => {
  router.post("/cards", _Session.default, async (req, res) => {
    const {
      card
    } = req.body; // body üzerinden kart bilgilerini alıyoruz.
    let result = await Cards.createUserCard({
      // iyzico dönen sonucu bu result değişkenine vericek.
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      email: req.user.email,
      externalId: (0, _nanoid.default)(),
      ...(req.user?.cardUserKey && {
        // conditional bir ifade yani cardUserKey var mı yok mu onu kontrol ediyoruz. Kullanıcının kartı olmayabilir onun kontrolü.
        cardUserKey: req.user.cardUserKey // kartı var ise userKeyini alırız.
      }),

      card: card
    });
    if (!req.user.cardUserKey) {
      // daha önceden kart oluşturulmadıysa
      if (result?.status === "success" && result?.cardUserKey) {
        // soru işareti, güvenli şekilde bu kodun var olup olmadığını kontrol etmek için kullanılır.
        const user = await _users.default.findOne({
          // kullanıcıyı bularak veritabanına kayıt atıyoruz
          _id: req.user?._id
        });
        user.cardUserKey = result?.cardUserKey;
        await user.save(); // Bu kaydı veritabanına kaydediyoruz. 
        //Eklenilen  kart isteği otomatik olarak istekden dönen cevabın içerisindeki cardUserKey kullanıcın hesabına yazılacak ve yeni kartlar eklenirken bu cardUserKey kullanılmaya devam edicek.
      }
    }

    res.json(result);
  });

  //! Kart Okuma
  router.get("/cards", _Session.default, async (req, res) => {
    if (!req.user?.cardUserKey) {
      // kullanıcının cardUserkey kontrolünü yapmamız gerekiyor. Eğer yoksa hata döndürecek
      throw new _ApiError.default("User has no credit card", 403, "userHasNoCard");
    }
    let cards = await Cards.getUserCards({
      //kartları alıyoruz.
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    res.status(200).json(cards);
  });

  //! Token ile Kart Silme 
  router.delete("/cards/delete-by-token", _Session.default, async (req, res) => {
    const {
      cardToken
    } = req.body; // body üzerinden tokenı alıyoruz.
    if (!cardToken) {
      // token olmadığı durum hata döndürecek
      throw new _ApiError.default("Card token is required", 400, "cardTokenRequired");
    }
    let deleteResult = await Cards.deleteUserCard({
      // Cards methodu içerisindeki deleteUserCard methodunu çağırıyoruz.
      locale: req.user.locale,
      //
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey,
      cardToken: cardToken
    });
    res.status(200).json(deleteResult);
  });

  //! Index ile Kart Silme (Sıra ile, hızlı silme mesela ön yüzdeki kart bilgilerini seçerek index numarasına göre siliyoruz.)
  router.delete("/cards/:cardIndex/delete-by-index", _Session.default, async (req, res) => {
    if (!req.params?.cardIndex) {
      // cardIndex gelip gelmediği kontrol ediyoruz. CardIndex gelmez ise hata döndürecek
      throw new _ApiError.default("Card index is required", 400, "cardIndexRequired");
    }
    let cards = await Cards.getUserCards({
      // Kullanıcının kartlarını backend de silmek için önce okumak gerekiyor(getUserCards).
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey // soru işeretini ? işaretini safe call yani güvenli çağırmak için kullanıyoruz bazen undifened olarak değer dönebiliyor  patlamaması için bu şekilde kullanılıyor.
    });

    const index = parseInt(req.params?.cardIndex); // indexi integer çeviriyoruz.
    if (index >= cards?.cardDetails.length) {
      // index numarası kullanıcının kart sayısından fazla ise hata döndürecek
      throw new _ApiError.default("Card doesn't exists, check index number", 400, "cardIndexInvalid");
    }
    const {
      cardToken
    } = cards?.cardDetails[index]; // body üzerinden almıyoruz cardTokenı index numarasına göre siliyoruz artık.
    let deleteResult = await Cards.deleteUserCard({
      // iyzico üzerinden gelen cevabı deleteResult değişkeni üzerine atanıyor.
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey,
      cardToken: cardToken
    });
    res.json(deleteResult);
  });
};
exports.default = _default;