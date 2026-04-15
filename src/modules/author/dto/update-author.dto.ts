import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
    @IsNotEmpty()
    @IsString()
    id: string;
}
