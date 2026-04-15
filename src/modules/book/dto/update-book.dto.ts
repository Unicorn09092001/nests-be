import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { EBookStatus } from './filter-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsOptional()
    status: EBookStatus
}
