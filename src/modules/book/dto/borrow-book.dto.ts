import { IsDateString, IsISO8601, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class BorrowBookDto {
    @IsNotEmpty()
    @IsDateString() // Kiểm tra chuỗi format ISO (YYYY-MM-DD...)
    // @Type(() => Date) // Chuyển chuỗi thành đối tượng Date sau khi validate
    borrowDate: Date;

    @IsNotEmpty()
    @IsDateString()
    // @Type(() => Date)
    dueDate: Date;

    @IsOptional()
    @IsDateString()
    // @Type(() => Date)
    returnDate: Date;

    @IsNotEmpty()
    bookIds: string[];

    @IsNotEmpty()
    @IsUUID()
    userId: string;
}
