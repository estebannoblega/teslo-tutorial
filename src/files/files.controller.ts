import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FILES')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly cofigService: ConfigService,  
  ) {}


  @Get('product/:imageName')
  findOne(
    @Res() res: Response, //con esto aseguramos que manualmente emitimos la respuesta a la peticion. Tambien salta los interceptorede definidos de manera global, tambien algunas restrincciones utilizadas por nest
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile( path );
  }


  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,    //mandamos la referencia (no la estamos ejecutando)
    storage: diskStorage({//para indicar donde guardar los archivos
      destination: './static/products',
      filename: fileNamer
    })    
    //limits: {fileSize: 10000} //limitamos el tamaño del archivo
  }))
  uploadProductImage( 
    @UploadedFile('file') file: Express.Multer.File
    ){
      if(!file){
        throw new BadRequestException('Make sure that the file is an image');
      }
      //en este punto ya se subió la imagen, a una carpeta temporal. En proyectos reales no es conveniente tener estos archivos en el mismos servidor que el codigo de nuestra aplicación.
    
    const secureUrl=`${this.cofigService.get('HOST_API')}/files/product/${file.filename}`;

    return {secureUrl};
  }
}
