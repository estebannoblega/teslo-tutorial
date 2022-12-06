import { BadRequestException, Get, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto) {
    try {

      const {password, ...userData} = createUserDto;


      const user = await this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password,10)
      });
      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };
    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto:LoginUserDto) {
    const {email, password} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: { email: true, password: true, id:true}
    });

    if(!user || !bcrypt.compareSync(password,user.password)){
      throw new UnauthorizedException('Credentials are not valid (email or password)');
    }

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };
  }

  checkAuthStatus(user: User){
    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };
  }


  private handleDBErrors(error: any){
    if(error.code==='23505'){
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Checks server logs');
  }

  private getJwtToken(payload: JwtPayload){
    //Para generar el token necesito el servicio JwtService
    const token = this.jwtService.sign( payload );
    return token;
  }
}
