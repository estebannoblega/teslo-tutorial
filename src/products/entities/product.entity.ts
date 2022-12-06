import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import {Entity, Column,PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: '01b23bff-ee51-4192-8d3f-5123658c150e',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text',{
        unique:true,
    })
    title:string;

    @ApiProperty({
        example: 0,
        description: 'Product Price'
    })
    @Column('float',{
        default:0
    })
    price:number;

    @ApiProperty({
        example: 'Designed for fit, comfort and style, the Tesla T Logo Tee is made from 100% Peruvian cotton and features a silicone-printed T Logo on the left chest.',
        description: 'Product Description'
    })
    @Column({
        type: 'text',
        nullable: true,
        default: ''
    })
    description: string;

    @ApiProperty({
        example: 'kids_3d_t_logo_tee',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text',{
        unique:true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: 0
    })
    @Column('int',{
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','XL','XXL'],
        description: 'Product Sizes',
        
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product Gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['hats','shirt'],
        description: 'Product Tags',
    })
    @Column({
        type:'text',
        array: true,
        default:[]
    })
    tags: string[];


    @ApiProperty({
        example: ["7652465-00-A_0_2000.jpg",
        "7652465-00-A_1.jpg"],
        description: 'Product Image',
        
    })
    @OneToMany(
        ()=> ProductImage,
        productImage => productImage.product,
        {
            cascade: true,   //Eliminacion en cascada- Recordar que esto en general no es conveniente
            eager: true     //con esto al utilizar cualquier find para búsqueda traerá las imágenes
        }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User, 
        (user) => user.product,
        {eager: true}
    )
    user: User;
    //Antes de insertar debe cumplir con estas condiciones
    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug=this.title;    
        }
        this.slug = this.slug.toLowerCase()
                        .replaceAll(' ','_')
                        .replaceAll("'", '');

    }
    @BeforeUpdate()
    checkSlugUpdate(){
        if(this.slug){
            this.slug = this.slug.toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'", '');
        }
    }
}
