import { IsNotEmpty, IsString } from "class-validator";

export class ChangePadSkinDto {

    @IsNotEmpty()
    @IsString()
    color: string;
}