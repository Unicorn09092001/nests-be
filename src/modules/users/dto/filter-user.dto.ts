import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

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
