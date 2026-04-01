import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Dayjs } from 'dayjs';

export class UpdateUserDto {
    @IsMongoId({message: "ID khong hop le"})
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
}
