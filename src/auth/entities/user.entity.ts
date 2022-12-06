import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Product } from 'src/products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';


@Entity('users')
export class User {
    
    @ApiProperty({
        example: '01b23bff-ee51-4192-8d3f-5123658c150e',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ApiProperty({
        example: 'fernando@gmail.com',
        description: 'User Email',
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    email: string;

    @ApiProperty({
        example: 'Nd5o4in2YBP9',
        description: 'User Password',
    })
    @Column('text',{
        select: false
    })
    password: string;

    @ApiProperty({
        example: 'Julissa McCurrie',
        description: 'User FullName',
    })
    @Column('text',{
        nullable: false
    })
    fullName: string;

    @ApiProperty({
        example: true,
        description: 'User isActive',
    })
    @Column('bool',{
        default: true,
        nullable:false
    })
    isActive: boolean;

    @ApiProperty({
        example: ['user','admin'],
        description: 'User Roles',
    })
    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[];

    @ApiProperty({
        example: Product,
        description: 'User Product',
    })
    @OneToMany(
        ()=> Product,
        (product) => product.user,
    )
    product: Product;



    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }

}
