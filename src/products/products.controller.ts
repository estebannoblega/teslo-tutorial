import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags,ApiBearerAuth,ApiBasicAuth } from '@nestjs/swagger';


import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('PRODUCTS')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiResponse({ status:201, description: 'Product was created', type: Product})
  @ApiResponse({ status:400, description: 'Bad Request' })
  @ApiResponse({ status:403, description: 'Token related' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
    ) {
    return this.productsService.create(createProductDto,user);
  }

  @Get()
  @ApiResponse({ status:201, description: 'Return all products', type: Product})
  findAll(@Query() paginationDto: PaginationDto) {
    
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiResponse({ status:200, description: 'Return a product', type: Product})
  @ApiResponse({ status:400, description: 'Bad Request'})
  @ApiProperty({
    description: 'Search by Id, title or Slug',
    type: 'string'
  })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth()
  @ApiResponse({ status:200, description: 'Update Successful'})
  @ApiBasicAuth()
  update(
    @Param('id',ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
    ) {
    return this.productsService.update(id, updateProductDto,user);
  }

  @Delete(':id')
  @ApiBasicAuth()
  @ApiResponse({ status:201, description: 'Delete Successful'})
  @ApiResponse({ status:400, description: 'Product not found'})
  @Auth(ValidRoles.admin)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
