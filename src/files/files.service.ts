import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

  /**
   * Comprueba si existe la imagen en el filesystem
   */
  public getStaticProductImage(imageName: string){
      const path = join(__dirname,'../../static/products',imageName); //direccion fisica de donde se encuentra la imagen en el servidor
      if(!existsSync(path)){
        throw new BadRequestException(`No product found with image ${imageName}`)
      }
      return path;
  }
  
}
