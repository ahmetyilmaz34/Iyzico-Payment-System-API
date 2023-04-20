import ApiError from "../error/ApiError";
import * as Cards from "../services/iyzico/methods/cards"
import Users from "../db/users";
import nanoid from "../utils/nanoid";
import Session from "../middlewares/Session";



//! Kullanıcıya Kart Ekleme
export default (router) => {
    router.post("/cards", Session, async (req, res) => {
        const { card } = req.body; // body üzerinden kart bilgilerini alıyoruz.
        let result = await Cards.createUserCard({ // iyzico dönen sonucu bu result değişkenine vericek.
            locale: req.user.locale,
            conversationId: nanoid(),
            email: req.user.email,
            externalId: nanoid(),
            ...req.user?.cardUserKey && { // conditional bir ifade yani cardUserKey var mı yok mu onu kontrol ediyoruz. Kullanıcının kartı olmayabilir onun kontrolü.
                cardUserKey: req.user.cardUserKey // kartı var ise userKeyini alırız.
            },
            card: card
        })
        if (!req.user.cardUserKey) { // daha önceden kart oluşturulmadıysa
            if (result?.status === "success" && result?.cardUserKey) { // soru işareti, güvenli şekilde bu kodun var olup olmadığını kontrol etmek için kullanılır.
                const user = await Users.findOne({ // kullanıcıyı bularak veritabanına kayıt atıyoruz
                    _id: req.user?._id
                });
                user.cardUserKey = result?.cardUserKey;
                await user.save() // Bu kaydı veritabanına kaydediyoruz. 
                //Eklenilen  kart isteği otomatik olarak istekden dönen cevabın içerisindeki cardUserKey kullanıcın hesabına yazılacak ve yeni kartlar eklenirken bu cardUserKey kullanılmaya devam edicek.
            }
        }
        res.json(result)
    })
}