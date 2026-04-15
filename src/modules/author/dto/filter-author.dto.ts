import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class FilterAuthorDto {
    @IsString()
    name: string;

    @IsOptional()
    description: string;

    @IsOptional()
    bookIds: string[];

    @IsDate()
    @IsOptional()
    createdAt?: string

    @IsDate()
    @IsOptional()
    updatedAt?: string

    @IsOptional()
    @IsNumber()
    page: number;

    @IsOptional()
    @IsNumber()
    pageSize: number;
}
