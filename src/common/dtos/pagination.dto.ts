import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    @ApiProperty({
        default: 10, description: 'How many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    @Type( ()=>Number ) //es lo mismo que poner enableImplicitConversions: true
    limit?: number;

    @ApiProperty({
        default: 0, description: 'How many rows do you want to skip'
    })
    @IsOptional()
    //@IsPositive() --> Deprecated: No considera el valor '0' como positivo
    @Min(0)
    @Type( ()=>Number ) //es lo mismo que poner enableImplicitConversions: true
    offset?: number;
}