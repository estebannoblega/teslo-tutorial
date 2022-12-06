import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product Title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        default: 10, description: 'Product Price', minimum:0,nullable:true
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Product Description',
        minLength: 3,
        nullable: true
    })
    @IsString()
    @MinLength(3)
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Product Slug', nullable: true
    })
    @IsString()
    @IsOptional()
    slug ?: string;

    @ApiProperty({
        default: 0, description: 'Product stock'
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock ?: number;

    @ApiProperty({
        example: ['M','XL','XXL'],
        description: 'Product Sizes',
    })
    @IsString({each:true})
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product Gender'
    })
    @IsIn(['men','women','kid','unisex'])
    gender: string;

    @ApiProperty({
        example: ['hats','shirt'],
        description: 'Product Tags',
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        example: ["7652465-00-A_0_2000.jpg",
        "7652465-00-A_1.jpg"],
        description: 'Product Image',
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?: string[];
}
