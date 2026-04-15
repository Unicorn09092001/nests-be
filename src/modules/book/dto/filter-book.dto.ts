import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export enum EBookStatus {
    AVAILABLE = "AVAILABLE",
    BORROWED = "BORROWED",
    MAINTENANCE = "MAINTENANCE"
}

export class FilterBookDto {
    @IsString()
    @IsOptional()
    keyword: string;

    @IsOptional()
    status: EBookStatus

    @IsOptional()
    authorIds: string[];

    @IsOptional()
    @IsString()
    categoryId: string

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
