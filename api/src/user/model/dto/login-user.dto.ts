import { IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

export class LoginUserDto {

	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;

}