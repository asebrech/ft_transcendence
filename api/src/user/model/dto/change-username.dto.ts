import { IsNotEmpty, IsString } from "class-validator";

export class ChangeUsernameDto {

    @IsNotEmpty()
    @IsString()
    oldUsername: string;

    @IsNotEmpty()
    @IsString()
    newUsername: string;
}