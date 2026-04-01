import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Dayjs } from "dayjs";

export class CreateUserDto {
    @IsNotEmpty({message: "Ten nguoi dung khong duoc de trong"})
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    avatar: string;

    @IsOptional()
    codeId: string;

    @IsOptional()
    codeExpired: string;
}
