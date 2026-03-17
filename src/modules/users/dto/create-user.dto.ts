import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "Ten nguoi dung khong duoc de trong"})
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string; 

    @IsEmpty()
    phone: string;

    @IsEmpty()
    address: string;

    @IsEmpty()
    image: string;
}
