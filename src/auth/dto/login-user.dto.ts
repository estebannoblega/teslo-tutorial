import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class LoginUserDto{
    
    @ApiProperty({
        example: 'fernando@gmail.com',
        description: 'User Email',
        uniqueItems: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Nd5o4in2YBP9',
        description: 'User Password',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'The password must have a Uppercase, lowercase letter and a number'
        }
    )
    password: string;
   

}