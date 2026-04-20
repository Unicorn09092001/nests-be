import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    codeId: string;

    @IsOptional()
    codeExpired: string;

    @IsOptional()
    isEmailVerified: boolean;
}

export class UpdateUserDto {
    @IsNotEmpty({message: "ID khong duoc de trong"})
    id: string;

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

export class CreateProfileDto {
    @IsOptional()
    name: string;

    @IsOptional() 
    phone: string;

    @IsOptional()
    avatar: string;

    @IsOptional()
    address: string;

    @IsNotEmpty()
    @IsUUID()
    userId: string;
}