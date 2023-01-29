import { Body, Controller, Get, Logger, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user-service/user.service';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserI } from '../model/user.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { LoginResponseI } from '../model/login-response.interface';
import { AccessTokenI } from '../model/access-token.interface';
import { AccessTokenDto } from '../model/dto/access-token.dto';
import * as otplib from 'otplib';
import { RequestModel } from 'src/middleware/auth.middleware';

@Controller('users')
export class UserController {

	constructor(
		private userService: UserService,
		private userHelperService: UserHelperService
	) { }

	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
		const userEntity: UserI = this.userHelperService.createUserDtoEntity(createUserDto);
		return this.userService.create(userEntity);
	}

	@Get()
	async findAll(
		@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<UserI>> {
		limit = limit > 100 ? 100 : limit;
		return this.userService.findAll({ page, limit, route: 'http://localhost:3000/api/users' });
	}

	@Get('/find-by-username')
	async findAllByUsername(@Query('username') username: string) {
		return this.userService.findAllByUsername(username);
	}

	@Post('login')
	async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
		const userEntity: UserI = this.userHelperService.loginUserDtoToEntity(loginUserDto);
		const jwt: string = await this.userService.login(userEntity);
		return {
			access_token: jwt,
			token_type: 'JWT',
			expires_in: 10000
		};
	}

	@Post('api-login')
	async apiLogin(@Body() accessTokenDto: AccessTokenDto) {
		const accessToken: AccessTokenI = this.userHelperService.accessTokenDtoToEntity(accessTokenDto);
		const user: UserI = await this.userHelperService.getDataFromApi(accessToken.access_token);
		const jwt: string = await this.userService.apiLoginHandle(user);
		return {
			access_token: jwt,
			token_type: 'JWT',
			expires_in: 10000
		}
	}

	@Get('qr-code')
	async getQrCode(@Req() req: RequestModel): Promise<{qr: string}> {
	  let user: UserI = req.user;
	  if (!user.google_auth) {
		user = await this.userService.googleAuthCreate(user);
	  }
	  const qr: string = await this.userService.getQrCode(user);
	  this.userService.test();
	  return {qr};
	}
  
	@Post('verify')
	verifyToken(@Body() body: { token: string; secret: string }): boolean {
	  return otplib.authenticator.check(body.token, body.secret);
	}

}