import { Controller, Get } from '@nestjs/common';
import { ApiTags,ApiResponse,ApiBasicAuth } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { SeedService } from './seed.service';


@ApiTags('SEED')
@Auth()
@ApiBasicAuth()
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @Get()
  @ApiResponse({ status:201, description: 'Seed Executed'})
  @ApiResponse({ status:401, description: 'Unauthorized'})
  executedSeed(){
    return this.seedService.runSeed();
  }
}
