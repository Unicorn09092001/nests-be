import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsMongoId({message: "ID khong hop le"})
    @IsNotEmpty({message: "_id khong duoc de trong"})
    _id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    image: string;
}
