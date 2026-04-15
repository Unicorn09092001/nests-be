import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FilterCategoryDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsDate()
    @IsOptional()
    createdAt?: string

    @IsDate()
    @IsOptional()
    updatedAt?: string

    @IsOptional()
    page: number

    @IsOptional()
    pageSize: number
}
