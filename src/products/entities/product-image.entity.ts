import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name: 'produc_images'})
export class ProductImage{

    @ApiProperty({
        example: '01b23bff-ee51-4192-8d3f-5123658c150e',
        description: 'Image ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty({
        example: ['1740417-00-A_0_2000.jpg'],
        description: 'Image Url',
        uniqueItems: true
    })
    @Column('text')
    url: string;

    
    @ManyToOne(
        () => Product,
        product => product.images,
        {onDelete:"CASCADE"}
    )
    product: ProductImage;
}