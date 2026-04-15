import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "Ten nguoi dung khong duoc de trong"})
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    codeId: string;

    @IsOptional()
    codeExpired: string;
}

export class UpdateUserDto {
    @IsNotEmpty({message: "ID khong duoc de trong"})
    id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    avatar: string;

    @IsOptional()
    isEmailVerified: boolean;

    @IsOptional()
    refreshToken: string;

    @IsOptional()
    codeId: string;

    @IsOptional()
    codeExpired: string;

    @IsOptional()
    roles: string[]
}

export class ActiveUserDto {
    @IsNotEmpty({message: "Ten nguoi dung khong duoc de trong"})
    userId: string;

    @IsNotEmpty({message: "Code verify khong duoc de trong"})
    verifyCode: string
}

export class FilterUserDto {
    @IsOptional()
    id: string;

    @IsOptional()
    email: string;

    @IsOptional()
    refreshToken: string;

    @IsOptional()
    page: number

    @IsOptional()
    pageSize: number
}