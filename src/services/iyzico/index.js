import Iyzipay from "iyzipay";
import * as Cards from "./methods/cards";
import nanoid from "../../utils/nanoid";
import * as Logs from "../../utils/logs";







/*-----------------------------------------------------------------*/
/* a)CARDS */
/*-----------------------------------------------------------------*/
//Bir kullanıcı ve kart oluştur
const createUserAndCards = () => {
    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        email: "email@email.com",
        externalId: nanoid(),
        card: {
            cardAlias: "Kredi Kartım",
            cardHolderName: "John Doe",
            cardNumber: "5528790000000008",
            expireMonth: "12",
            expireYear: "2030",
        }
    }).then((result) => {
        console.log(result);
        Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", err)
    })
}
// createUserAndCards();

// Bir kullanıcıya yeni bir kart ekle
const createCardForUser = () => {
    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        email: "email@email.com",
        externalId: nanoid(),
        cardUserKey: "ULalPsROKnCMKrtKuvtFoCtfYxM=",
        card: {
            cardAlias: "Kredi Kartım",
            cardHolderName: "John Doe",
            cardNumber: "5528790000000008",
            expireMonth: "12",
            expireYear: "2030",
        }
    }).then((result) => {
        console.log(result);
        Logs.logFile("2-bir-kullanıcıya-kart-ekle", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("2-bir-kullanıcıya-kart-ekle-hata", err)
    })
}
// createCardForUser();


//Bir kullanıcının kartlarını oku
const readCardsOfAUser = () => {
    Cards.getUserCards({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        cardUserKey: "ULalPsROKnCMKrtKuvtFoCtfYxM=",
    }).then((result) => {
        console.log(result);
        Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku-hata", err)
    })
}
// readCardsOfAUser()

//Bir kullanıcının bir kartını sil
const deleteCardsOfAUser = () => {
    Cards.deleteUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        cardUserKey: "ULalPsROKnCMKrtKuvtFoCtfYxM=", 
        cardToken: "/i1b0fA0gqutDs9wBaslMlvNWho=", // bu tokena ait olan kart silinecektir.
    }).then((result) => {
        console.log(result);
        Logs.logFile("4-cards-bir-kullanıcının-kartını-sil", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("4-cards-bir-kullanıcının-kartını-sil-hata", err)
    })
}
// deleteCardsOfAUser()