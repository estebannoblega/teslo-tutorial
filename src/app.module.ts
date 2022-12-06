import { join } from 'path';

import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
 
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot( {
      rootPath: join(__dirname,'..','public'),
    }),
    TypeOrmModule.forRoot({

      ssl: process.env.STAGE === 'prod', 
      extra: {
        ssl:process.env.STAGE === 'prod'
        ? {rejectUnauthorized: false}
        : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,  
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,  //Esto hace que cuando modificamos entidades(borrar una columna) automaticamente la sincroniza con la DB. Usualmente en producción no se utiliza, se puede crear una variable de entorno para controlar la sincronización
      
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessagesWsModule,
  ],
  
})
export class AppModule {}
