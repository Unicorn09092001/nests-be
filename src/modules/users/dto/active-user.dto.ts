import { IsNotEmpty } from "class-validator";

export class ActiveUserDto {
    @IsNotEmpty({message: "Ten nguoi dung khong duoc de trong"})
    userId: string;

    @IsNotEmpty({message: "Code verify khong duoc de trong"})
    verifyCode: string
}
