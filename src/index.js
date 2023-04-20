import 'express-async-errors'; //express üzerinde bir hata oldumu sunucuyu patlatmıyor çalışmaya devam ettiriyor. Bütün methodları çağırdık.
import dotenv from 'dotenv';
import config from './config';
import express, { application } from 'express';
import logger from 'morgan';
import https from 'https';
import fs from 'fs';
import path from 'path';    
import helmet from 'helmet';
import cors from 'cors';
import DBModels from './db'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import GenericErrorHandler from './middlewares/GenericErrorHandler';
import ApiError from './error/ApiError';
import Users from './db/users';
import mongoose from 'mongoose';
import passport from 'passport';
import Session from './middlewares/Session';
import routes from './routes/index'; // index dosyasındaki routerları importladık.


const envPath = config?.production ? "./env/.prod" : "./env/.dev" // çalışma ortamı
dotenv.config({
    path: envPath
})
// console.log(process.env.DEPLOYMENT);
// console.log(process.env.HTTPS_ENABLED);

// Begin mongodb connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})
// End mongodb connection

const app = express(); // express app oluşturuldu.
const router = express.Router() // router oluşturuldu.
routes.forEach((routeFn, index) => {
    routeFn(router)
})
app.use("/api", router)
// /api /check ile aynı. 


app.use(logger(process.env.LOGGER)); // Logların hepsini göstericek.

//!Sunucu güvenligi(helmet-cors)
app.use(helmet()); // En tepeden gelen hataları ya da oluşan isteklerle beraber atakları engellemeye çalışır.
app.use(cors( { 
    origin:"*", 
    //origin:İstek alınan adresler. Herhangi bir adresdende alınabilirdi.Tüm adreslerden istek al dedik. Tarayıcılara özeldir.
}));


app.use(express.json({ //Yüksek dosyalar ile sunucuya atak gerçekleştirilmemesi için sınırlayıcı bir mekanizma 
    limit:"1mb", // 1mb üzerindeki json dosyalarını sunucu hata olarak görücektir.
}))  
app.use(express.urlencoded({extended:true})); //url parametre okumak için kullanıyoruz.



passport.serializeUser((user, done) => {  // tokenı alıyor
    done(null, user);
});
passport.deserializeUser((id, done) => { // token üzerinden id yazmaya çalışıyor.
    done(null, id)
});
app.use(passport.initialize())

const jwtOpts = {   
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}
passport.use(
    new JwtStrategy( 
        jwtOpts,
        async (jwtPayload, done) => {
            try {
                const user = await Users.findOne({_id: jwtPayload._id}); // kullanıcıyı buluyoruz ve karşılatırıyoruz
                if (user) {
                    done(null, user.toJSON())
                } 
                else { // hata verdiricez. ApiError ile
                    done(new ApiError("Autorization is not valid", 401, "authorizationInvalid"), false);
                }
            }
            catch (err) {
                return done(err, false)
            }
        }
    )
)





// app.all("/", (req,res) =>{
//     throw new ApiError("Hata oluştu.",404,"something wrong happened");
//     res.json({
//         test: 1
//     })
// })

app.all("/test-auth", Session, (req,res) =>{
    res.json({
        test: true
    })
})

app.use(GenericErrorHandler); // Genel hata yönetimi



if(process.env.HTTPS_ENABLED === "true") {
    const key = fs.readFileSync(path.join(__dirname, "./certs/key.pem")).toString();
    const cert = fs.readFileSync(path.join(__dirname, "./certs/cert.pem")).toString();

    const server = https.createServer({
        key: key,
        cert: cert
    }, app);

    server.listen(process.env.PORT, () => {
        console.log("Express Uygulamamız " + process.env.PORT + " üzerinden çalışmaktadır");        
    })
}
else {
    app.listen(process.env.PORT, () => {
        console.log("Express Uygulamamız " + process.env.PORT + " üzerinden çalışmaktadır");
    })
}
