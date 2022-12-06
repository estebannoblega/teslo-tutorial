import { NotFoundException } from '@nestjs/common';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product,ProductImage } from './entities';

import {validate as isUUID} from 'uuid';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    
    private readonly dataSource: DataSource,
  ){}

  /**
   * Crea un producto en la tabla producto, a pesar que la tabla no posee la propiedad 'images', 
   * TypeORM infiere que se esta tambien creando instancias de 'productImages', es decir, tambien crea las imagenes en la tabla product_image
   * @param createProductDto 
   * @returns 
   */
  async create(createProductDto: CreateProductDto, user: User) {
    try {

      const {images=[] , ...productDetails} = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image=>this.productImageRepository.create({url: image})),
        user: user

      }); //esto genera el producto con todas sus propiedades
      await this.productRepository.save(product); //esto lo guarda en la BD

      return {...product, images};    //asi evitamos enviar al front la id de cada imagen
    } catch (error) {
      this.hadleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit=5, offset=0} = paginationDto;
    const products = await this.productRepository.find({
      take:limit,
      skip: offset,
      //* TODO: Relaciones
      relations:{
        images: true,
      }
    });
    return products.map( product => ({
      ...product,
      images: product.images.map( img => img.url )

    }));
  }

  async findOne(term: string) {
    let product : Product;
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({ id: term });
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
                      .where(`UPPER(title)=:title or slug=:slug`,{
                        title: term.toUpperCase(),
                        slug: term.toLowerCase(),
                      })
                      .leftJoinAndSelect('prod.images','prodImages')
                      .getOne();
    }

    if(!product){
      throw new NotFoundException(`Product with id ${term} not found`);
    }
    return product;
  }

  async findOnePlain(term :string){
    const {images=[], ...product} = await this.findOne(term);
    return {
      ...product,
      images: images.map( image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto,user: User) {

    const {images, ...toUpdate} = updateProductDto;


    //Busca un objeto por id, y coloca todas las propiedades del objeto updateProdcut. ESTO NO LO GUARDA EN LA BD
    const product = await this.productRepository.preload({
      id,
      ...toUpdate
    });
    

    if(!product){
      throw new NotFoundException(`Product with id:${id} not Found`);
    }
    //Si vienen nuevas imagenes hay que borrar las anteriores, entones en la actualización se trabaja con las dos tablas
    //Create Query Runner, permite hacer transacciones en la base de datos (solo se aplicacn los cambios si todas las transacciones son exitosas)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if(images){
        //Borra todas las imagenes cuya columna 'producId' sea igual al id pasado por parametro
        await queryRunner.manager.delete( ProductImage, {
          product:{ id }
        } );

        product.images = images.map(
          img => this.productImageRepository.create({url: img})
          );

        }
      product.user=user;
      
      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release();  

      return this.findOnePlain(id);
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.hadleDBExceptions(error);
    }

  }
  

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    //En casos mas complejos se puede realizar el borrado utilizando transacciones, ya q tendríamos mayor control de lo que borramos
    //En este caso como es simple utilizamos un borrado en cascada

  }

  private hadleDBExceptions(error: any){
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
  /**
   * Metodo utilizado para borrar todo cuando utilizamos el SEED
   * @returns 
   */
  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete()
                        .where({})
                        .execute();  //Elimina todos los registros 
    } catch (error) {
      this.hadleDBExceptions(error);
    }
  }
}
