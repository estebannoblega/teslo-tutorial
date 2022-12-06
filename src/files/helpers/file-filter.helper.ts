
//Metodo utilizado para validar los archivos que se reciben en el endpoint. Apecta o no un archivo.
export const fileFilter=( req: Express.Request, file: Express.Multer.File, callback: Function)=>{

    //console.log({file});
    if(!file) return callback(new Error('File is empty'),false);       //si no se cumple esto genera un server error
    
    const fileExptension = file.mimetype.split('/')[1];
    
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];  

    if( validExtensions.includes(fileExptension)){
        return callback(null,true); //se acepta el archivo
    }
    callback(null,false);

}