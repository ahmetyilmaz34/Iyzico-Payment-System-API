import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../db/users";
import ApiError from "../error/ApiError";

export default (router) => {
    router.post("/login", async (req, res) => {
        const { email, password } = req.body; // kullanıcının email ve şifresini body üzerinden alıyoruz.
        const user = await Users.findOne({ email: email }); // veritabanındaki modelden users bilgilerini alıyoruz. Findone ile veritabanından bir adet veri buluyoruz. email ile eşleşen kullanıcı geliyor
        if(!user) { 
            throw new ApiError("Incorrect password or email", 401, "userOrPasswordIncorrect")
        }
        const passwordConfirmed = await bcrypt.compare(password, user.password); // şifreleri karşılaştırıyoruz. boolean ifade değişkene dönecek.
        if(passwordConfirmed){ // eğer true ise bu blok çalışacak yani şifre doğru ise
            const UserJson = user.toJSON(); // kullanıcı bilgileri json dosyasına dönüştürülüyor ama şifresi bu json dosyasına eklenmiyordu siliniyordu.
            const token = jwt.sign(UserJson, process.env.JWT_SECRET); // token oluşturup jwt ile imzalancak. 
            res.json({ // tokenı isteğin içerisine veriyoruz.
                token: `Baerer ${token}`, 
                user: UserJson
            })
        }
        else{ 
            throw new ApiError("Incorrect password or email", 401, "userOrPasswordIncorrect")
        }
    })
}