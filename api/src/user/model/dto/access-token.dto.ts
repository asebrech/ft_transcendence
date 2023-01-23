import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AccessTokenDto {
	@IsString()
	@IsNotEmpty()
	access_token: string;

	@IsString()
	token_type?: string;

	@IsNumber()
    expires_in?: number;

	@IsString()
    refresh_token?: string;

	@IsString()
    scope?: string;

	@IsNumber()
    created_at?: number;
}