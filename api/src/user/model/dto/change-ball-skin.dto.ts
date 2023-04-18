import { IsNotEmpty, IsString } from "class-validator";

export class ChangeBallSkinDto {

    @IsNotEmpty()
    @IsString()
    color: string;
}