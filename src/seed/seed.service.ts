import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){

  }

  public async runSeed(){
    await this.deleteTable();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'Excecuted SEDD';
  }

  private async deleteTable(){
    //Borramos los productos, (cmo se borra en cascada se borran también las imagenes)
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
          .delete()
          .where({})
          .execute()


  }

  private async insertUsers(){
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach(user=>{
      users.push(this.userRepository.create(user))
    });

    await this.userRepository.save(users);

    return users[0];
  }

  private async insertNewProducts(user: User){
    await this.productService.deleteAllProducts(); 

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product =>{
      // a pesar que no es una instancia del dto, typescript pide que el parametro tenga la misma forma que el objeto quye espera, (en este caso el createDto). Por eso es que no da error
      insertPromises.push(this.productService.create(product,user)); 
    });

    await Promise.all(insertPromises);  //con esto esperamos que cada una de las promesas se resuelva
    //Una cosa a tener en cuenta es que estamos haciendo una inserción para cada dato, en lugar de hacer una inserción de muchos datos!!!

  }
}
