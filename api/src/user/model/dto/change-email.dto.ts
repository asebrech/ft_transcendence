import { IsEmail, IsNotEmpty } from "class-validator";

export class ChangeEmailDto {

    @IsNotEmpty()
    @IsEmail()
    oldEmail: string;

    @IsNotEmpty()
    @IsEmail()
    newEmail: string;
}