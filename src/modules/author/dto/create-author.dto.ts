import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAuthorDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    bookIds: string[]
}
