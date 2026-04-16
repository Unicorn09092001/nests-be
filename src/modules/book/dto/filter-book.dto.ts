import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export enum EBookStatus {
    AVAILABLE = "AVAILABLE",
    BORROWED = "BORROWED",
    MAINTENANCE = "MAINTENANCE"
}

export class PagingDto {
    @IsOptional()
    @IsNumber()
    page: number;

    @IsOptional()
    @IsNumber()
    pageSize: number;
}

export class FilterBookDto extends PagingDto{
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
}

export class FilterBorrowHistory extends PagingDto {
    @IsOptional()
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsUUID()
    bookId: string;
}