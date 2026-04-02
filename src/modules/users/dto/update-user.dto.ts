import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty({message: "ID khong duoc de trong"})
    id: string | number;

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
    roles: number[]
}
