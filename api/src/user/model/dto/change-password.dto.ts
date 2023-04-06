import { isNotEmpty, isString } from "class-validator";

export class ChangePasswordDto {

    @isNotEmpty()
    oldPassword: string;

    @isNotEmpty()
    newPassword: string;

    @isNotEmpty()
    confirmNewPassword: string;
  }