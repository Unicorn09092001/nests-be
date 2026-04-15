import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsInt()
    pageNumber: number

    @IsOptional()
    @IsString()
    isbn: string;

    @IsOptional()
    @IsString()
    categoryId: string

    @IsOptional()
    authorIds: string[]
}
