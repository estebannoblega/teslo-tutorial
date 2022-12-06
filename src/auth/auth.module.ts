import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [

    ConfigModule,

    TypeOrmModule.forFeature([ User ]),
    
    PassportModule.register({defaultStrategy: 'jwt'}),

    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,    //se lo define en las variables de entorno, entonces conviene utilizar una combinación asincrona, ya que puede que noe esté defida esta clave cuando se levanta la aplicación 
    //   signOptions:{
    //     expiresIn: '2h'
    //   }
    // }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: ()=>{
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
