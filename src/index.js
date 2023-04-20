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
import GenericErrorHandler from './middlewares/GenericErrorHandler';
import ApiError from './error/ApiError';
import Users from './db/users';
import mongoose from 'mongoose';





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

app.all("/", (req,res) =>{
    throw new ApiError("Hata oluştu.",404,"something wrong happened");
    res.json({
        test: 1
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
