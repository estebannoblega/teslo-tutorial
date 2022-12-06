import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetUser, RawHeaders} from './decorators/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus( 
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userMail: string,
    @RawHeaders() rawHeaders: string[],
  ){
    return {
      ok: true,
      message: 'Accediendo a la ruta privada',
      user,
      userMail,
      rawHeaders,
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)  //Sigue siendo no fiable, ya que podemos olvidar colocar esta linea
  @UseGuards(AuthGuard(),UserRoleGuard) //si usamos nuestros guards personalizados utilizamos una instancia NO UNA FUNCION
  privateRoute2(
    @GetUser() user: User
  ){
      return {
        ok: true,
        user
      }

  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateRoute3(
    @GetUser() user: User
  ){
      return {
        ok: true,
        user
      }

  }
}
