import fs from 'fs';
import path from 'path';


// ! logs klasörü içerisine log dosyaları oluşturuluyor
export const logFile = (filename,data) => {
    const dir = path.join(__dirname,`../logs/${filename}.json`,);
    const writeData = JSON.stringify(data,null,4);
    fs.writeFileSync(dir,writeData);
}

