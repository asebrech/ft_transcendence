import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ApiLoginDto {

	@IsString()
	@IsNotEmpty()
	login: string;

	@IsEmail()
	email: string;

	image: string;
}