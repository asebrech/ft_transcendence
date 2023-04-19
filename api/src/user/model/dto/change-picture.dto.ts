import { IsNotEmpty, IsString, IsUrl, isString } from "class-validator";

export class ChangePictureDto {

    @IsNotEmpty()
    @IsString()
    profilPic: string;
  }