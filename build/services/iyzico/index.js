"use strict";

var _iyzipay = _interopRequireDefault(require("iyzipay"));
var Cards = _interopRequireWildcard(require("./methods/cards"));
var Installments = _interopRequireWildcard(require("./methods/installments"));
var PaymentsThreeDS = _interopRequireWildcard(require("./methods/threeds-payments"));
var Checkouts = _interopRequireWildcard(require("./methods/checkouts"));
var CancelPayments = _interopRequireWildcard(require("./methods/cancel-payments"));
var RefundPayments = _interopRequireWildcard(require("./methods/refund-payments"));
var _nanoid = _interopRequireDefault(require("../../utils/nanoid"));
var Logs = _interopRequireWildcard(require("../../utils/logs"));
var Payments = _interopRequireWildcard(require("./methods/payments"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// * -----------------------------------------------------------------
//! a)CARDS 
// * -----------------------------------------------------------------
//! Bir kullanıcı ve kart oluşturma
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    card: {
      cardAlias: "Kredi Kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", err);
  });
};
// createUserAndCards();

//! Bir kullanıcıya yeni bir kart ekleme
const createCardForUser = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    cardUserKey: "nSCf5s8Z4BamQ43Cph1sLFZuuOI=",
    card: {
      cardAlias: "Kredi Kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("2-bir-kullanıcıya-kart-ekle", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("2-bir-kullanıcıya-kart-ekle-hata", err);
  });
};
// createCardForUser();

//! Bir kullanıcının kartlarını okuma
const readCardsOfAUser = () => {
  Cards.getUserCards({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "nSCf5s8Z4BamQ43Cph1sLFZuuOI="
  }).then(result => {
    console.log(result);
    Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku-hata", err);
  });
};
// readCardsOfAUser()

//! Bir kullanıcının bir kartını silme
const deleteCardsOfAUser = () => {
  Cards.deleteUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "kT8f59LBTM1BUCSMfkjZKXUeEhs=",
    cardToken: "R8TimubU9ujOkvNLYPd3u2h/Qm0=" // bu tokena ait olan kart silinecektir.
  }).then(result => {
    console.log(result);
    Logs.logFile("4-cards-bir-kullanıcının-kartını-sil", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("4-cards-bir-kullanıcının-kartını-sil-hata", err);
  });
};
// deleteCardsOfAUser()

// * -----------------------------------------------------------------
//! b)INSTALLMENTS 
// * -----------------------------------------------------------------

//! Bir kart ve ücretle ilgili gerçekleşebilecek taksitlerin kontrolü
const checkInstallments = () => {
  return Installments.checkInstallment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    // İletişim idsi
    binNumber: "55287900",
    // Kartın başındaki sayıların 5 hanesi
    price: "1000"
  }).then(result => {
    console.log(result);
    Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolu", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolu-hata", err);
  });
};
// checkInstallments()

// * -----------------------------------------------------------------
// ! c)Normal Payments 
// * -----------------------------------------------------------------

//! Kayıtlı olmayan kart ile ödeme yapmak ve kartı kaydetme
const createPayment = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    // total ödeme
    paidPrice: "300",
    // asıl ödenmesi gereken tutardır
    currency: _iyzipay.default.CURRENCY.TRY,
    // iyzipay içerisindeki enumarationlardan currency geliyor
    installment: "1",
    // taksitlendirme, installmentNumbers
    basketId: "B67JDL",
    // sepet içerisindeki ürünlerin kendi sistemimizdeki ürünün idsine işaret ediyor. Sİstemimizde bu idnin olması gerekir
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      // ödeme yapacak kart bilgileri tanımlanıyor.
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      // ödemeler için kullanabiliriz.
      registerCard: '0' // ödeme yapılan kart kaydetmiyor.
    },

    buyer: {
      // kullanıcı bilgileri tanımlanıyor.
      id: "SDFJKL",
      // kendi sistemimizdeki idyi buraya ekleyebiliriz. Kullanıcı idsidir.
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      // kullanıcının telefon numarası
      email: "email@email.com",
      identityNumber: "743008664791",
      // tc kimlik numarası
      lastLoginDate: "2020-10-05 12:43:35",
      // kullanıcının girdiği son tarih
      registrationDate: "2022-09-09 12:43:35",
      // kullanıcının kayıt tarihi
      registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      // kullanıcının adresi
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      // fatura bilgileri tanımlanıyor
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      // kargolama bilgileri tanımlanıyor.
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [
    // ürünleri barındıran dizidir.
    {
      id: "BT101",
      // ürün idisidir. Sistemdeki ürün idsi verilebilir.
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      // fiziksel bir ürün olduğunu gösterir.
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("6-payments-yeni-bir-kartla-odeme-al-ve-kartı-kaydetme", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("6-payments-yeni-bir-kartla-odeme-al-ve-kartı-kaydetme-hata", err);
  });
};
// createPayment()

//! Kayıtlı bir kart ile ödeme yapma işlemi
const createPaymentAndSaveCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "nSCf5s8Z4BamQ43Cph1sLFZuuOI=",
      // kartın kaydedilmesi için kart idsi veriliyor.
      cardAlias: "Kredi Kartım Ödemeden Sonra",
      // kartın kaydedilme ismi
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      registerCard: '1'
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("7-payments-yeni-bir-kartla-odeme-al-ve-kartı-kaydet", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("7-payments-yeni-bir-kartla-odeme-al-ve-kartı-kaydet-hata", err);
  });
};
// createPaymentAndSaveCard()
// readCardsOfAUser()

//! Kayıtlı bir kart ödeme yapmak
const createPaymentWithSavedCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "nSCf5s8Z4BamQ43Cph1sLFZuuOI=",
      cardToken: "3VnmlRXdbtn4Jhc94zZnoYkBu3I="
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("8-payments-kayıtlı-bir-kartla-odeme-al", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("8-payments-kayıtlı-bir-kartla-odeme-al-hata", err);
  });
};
// createPaymentWithSavedCard()

// * -----------------------------------------------------------------
// ! d) 3D Secure Paments  
// * -----------------------------------------------------------------

//! 3D secure ödeme başlatılıyor.
const initializeThreeDSPayments = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    //iyziconun bize döneceği istekdir.
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      registerCard: '0'
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [
    // sepetteki ürünler
    {
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("9-threeds-payments-yeni-bir-kartla-odeme-al", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("9-threeds-payments-yeni-bir-kartla-odeme-al-hata", err);
  });
};
// initializeThreeDSPayments();

//! 3DS ödemesini tamamla
const completeThreeDSPayment = () => {
  PaymentsThreeDS.completePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "19232305",
    conversationData: "conversation data"
  }).then(result => {
    console.log(result);
    Logs.logFile("10-threeds-payments-odeme-tamamla", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("10-threeds-payments-odeme-tamamla-hata", err);
  });
};
// completeThreeDSPayment()

//! 3S ödemesini kayıtlı karttan gerçekleştirme
const initializeThreeDSPaymentsWithRegisteredCard = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "nSCf5s8Z4BamQ43Cph1sLFZuuOI=",
      cardToken: "3VnmlRXdbtn4Jhc94zZnoYkBu3I="
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("11-threeds-payments-kayıtlı-kartla-odeme-al", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("11-threeds-payments-kayıtlı-kartla-odeme-al-hata", err);
  });
};
// initializeThreeDSPaymentsWithRegisteredCard()

//! Yeni kartla 3d ödeme yap ve kartı kaydet
const initializeThreeDSPaymentsWithNewCardAndRegister = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "nSCf5s8Z4BamQ43Cph1sLFZuuOI=",
      cardAlias: "Kredi Kartım 3D",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      registerCard: '1'
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("12-threeds-payments-yeni-kart-kaydet", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("12-threeds-payments-yeni-kart-kaydet-hata", err);
  });
};
// initializeThreeDSPaymentsWithNewCardAndRegister()

// * -----------------------------------------------------------------
// ! e) Checkout Form  
// * -----------------------------------------------------------------

//! Checkout form içerisinde ödeme başlat 
const initializeCheckoutForm = () => {
  Checkouts.initialize({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/checkout/complete/payment",
    cardUserKey: "nSCf5s8Z4BamQ43Cph1sLFZuuOI=",
    enableInstallments: [1, 2, 3, 6, 9],
    // taksitlendirmeler
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("13-checkout-form-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("13-checkout-form-payments-hata", err);
  });
};
// initializeCheckoutForm()

//! Checkout form ödeme bilgisini gösterir. Ödemenin gerçekleşip gerçekleşmediğini gösterir.
const getFormPayment = () => {
  Checkouts.getFormPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    token: "5559ba07-25b3-4575-a947-0b8a7f569c0c"
  }).then(result => {
    console.log(result);
    Logs.logFile("14-checkout-form-payments-get-details", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("14-checkout-form-payments-get-details-hata", err);
  });
};
getFormPayment();

// * -----------------------------------------------------------------
// ! f) Cancel Payments   
// * -----------------------------------------------------------------

//! Ödeme ipal etme testi
const cancelPayments = () => {
  CancelPayments.cancelPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "19232209",
    // ödeme idsi, bu ödemeyi iptal edeceğiz
    ip: "85.34.78.122"
  }).then(result => {
    console.log(result);
    Logs.logFile("15-cancel-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("15-cancel-payments-hata", err);
  });
};
// cancelPayments()

//! Açıklamalı ödeme iptal etme işlemi
const cancelPaymentsWithReason = () => {
  CancelPayments.cancelPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "19228790",
    // ödeme idsi, bu ödemeyi iptal edeceğiz
    ip: "85.34.78.122",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı isteği ile iptal edildi"
  }).then(result => {
    console.log(result);
    Logs.logFile("16-cancel-payments-reason", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("16-cancel-payments-reason-hata", err);
  });
};
// cancelPaymentsWithReason()

// * -----------------------------------------------------------------
// ! g) Refund Payment -- Kısmi Geri Ödeme 
// * -----------------------------------------------------------------
//! Ödemenin belirli bir kısmını  iade etme işlemi
const refundPayment = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "20464124",
    //Gerçekleşen her bir ödeme altında farklı kalemlere(id) ayrılan ödemelerdir.
    price: "50",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: "85.34.78.112"
  }).then(result => {
    console.log(result);
    Logs.logFile("17-refund-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("17-refund-payments-hata", err);
  });
};
// refundPayment()

//! Ödemenin belirli bir kısmını açıklama ile iade etme işlemi
const refundPaymentWithReason = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "20464123",
    price: "50",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: "85.34.78.112",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    // kullanıcı isteği ile iade etme işlemidir.
    description: "Kullanıcı iade istedi"
  }).then(result => {
    console.log(result);
    Logs.logFile("17-refund-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("17-refund-payments-hata", err);
  });
};
//createPayment()
// refundPaymentWithReason()