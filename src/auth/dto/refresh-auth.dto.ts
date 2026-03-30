import { IsNotEmpty, IsOptional } from "class-validator";

export class RefreshAuthDto {
    @IsNotEmpty()
    refreshToken: string;

    @IsNotEmpty()
    userId: string
}
