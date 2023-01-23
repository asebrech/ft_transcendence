import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AccessTokenI } from 'src/user/model/access-token.interface';
import { AccessTokenDto } from 'src/user/model/dto/access-token.dto';
import { ApiLoginDto } from 'src/user/model/dto/api-login.dto';
import { CreateUserDto } from 'src/user/model/dto/create-user.dto';
import { LoginUserDto } from 'src/user/model/dto/login-user.dto';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class UserHelperService {

	createUserDtoEntity(createUserDto: CreateUserDto): UserI {
		return {
			email: createUserDto.email,
			username: createUserDto.username,
			password: createUserDto.password
		}
	}

	loginUserDtoToEntity(loginUserDto: LoginUserDto): UserI {
		return {
			email: loginUserDto.email,
			password: loginUserDto.password
		}
	}

	accessTokenDtoToEntity(apiLoginDto: AccessTokenDto): AccessTokenI {
		return {
			access_token: apiLoginDto.access_token,
			token_type: apiLoginDto.token_type,
			expires_in: apiLoginDto.expires_in,
			refresh_token: apiLoginDto.refresh_token,
			scope: apiLoginDto.scope,
			created_at: apiLoginDto.created_at
		}
	}
	
	async getDataFromApi(token: string): Promise<UserI> {
		try {
			const response = await axios.get('https://api.intra.42.fr/v2/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return this.apiLoginDtoToEntity(response.data);
		} catch {
			throw new HttpException('wrong token', HttpStatus.UNAUTHORIZED);
			
		}
	}
	
	private apiLoginDtoToEntity(loginUserDto: ApiLoginDto): UserI {
		return {
			username: loginUserDto.login,
			email: loginUserDto.email
		}
	}
}
