import { IsDataURI, IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class BorrowBookDto {
    @IsNotEmpty()
    @IsDateString() // Kiểm tra chuỗi format ISO (YYYY-MM-DD...)
    @Type(() => Date) // Chuyển chuỗi thành đối tượng Date sau khi validate
    borrowDate: Date;

    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
    dueDate: Date;

    @IsOptional()
    returnDate: Date;

    @IsNotEmpty()
    @IsUUID()
    bookId: string;

    @IsNotEmpty()
    @IsUUID()
    userId: string;
}
