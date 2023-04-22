import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {

    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    newPassword: string;

  }