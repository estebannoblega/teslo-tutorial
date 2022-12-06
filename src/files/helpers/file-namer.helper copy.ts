import { v4 as uuid } from "uuid";
//Metodo utilizado para validar los archivos que se reciben en el endpoint. Apecta o no un archivo.
export const fileNamer=( req: Express.Request, file: Express.Multer.File, callback: Function)=>{

    //console.log({file});
    if(!file) return callback(new Error('File is empty'),false);       //esto debería ser innecesario
    
    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${uuid()}.${fileExtension}`;

    callback(null,fileName);

}