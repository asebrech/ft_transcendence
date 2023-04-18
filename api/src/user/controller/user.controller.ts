/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Logger, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user-service/user.service';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserI } from '../model/user.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { LoginResponseI } from '../model/login-response.interface';
import { AccessTokenI } from '../model/access-token.interface';
import { AccessTokenDto } from '../model/dto/access-token.dto';
import { RequestModel } from 'src/middleware/auth.middleware';
import { UserEntity } from '../model/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ChangePasswordDto } from '../model/dto/change-password.dto';
import { ChangeUsernameDto } from '../model/dto/change-username.dto';
import { ChangeEmailDto } from '../model/dto/change-email.dto';
import { ChangeBallSkinDto } from '../model/dto/change-ball-skin.dto';
import { ChangePadSkinDto } from '../model/dto/change-pad-skin.dto';


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
	async findAll(@Req() req: RequestModel): Promise<UserI[]> {
		return this.userService.findAll();
	}

	@Get('/find-by-username')
	async findAllByUsername(@Query('username') username: string) {
		return this.userService.findAllByUsername(username);
	}

	@Post('login')
	async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
		const userEntity: UserI = this.userHelperService.loginUserDtoToEntity(loginUserDto);
		const user: UserI = await this.userService.login(userEntity);
		const jwt: string = await this.userService.returnJwt(user);
		if (!user.google_auth) {
			const jwt: string = await this.userService.returnJwt(user);
			return {
				access_token: jwt,
				token_type: 'JWT',
				expires_in: 10000
			}
		}
		else {
			const sessionToken: string = this.userService.returnSession(user);
			return {session: sessionToken}
		}
	}

	@Post('api-login')
	async apiLogin(@Body() accessTokenDto: AccessTokenDto): Promise<LoginResponseI>{
		const accessToken: AccessTokenI = this.userHelperService.accessTokenDtoToEntity(accessTokenDto);
		const userApi: UserI = await this.userHelperService.getDataFromApi(accessToken.access_token);
		const user : UserI = await this.userService.apiLoginHandle(userApi);
		if (!user.google_auth) {
			const jwt: string = await this.userService.returnJwt(user);
			return {
				access_token: jwt,
				token_type: 'JWT',
				expires_in: 10000
			}
		}
		else {
			const sessionToken: string = this.userService.returnSession(user);
			return {session: sessionToken};
		}
	}

	@Get('enable-2fa')
	async enable2FA(@Req() req: RequestModel) {
	  let user: UserI = req.user;
	  user = await this.userService.googleAuthCreate(user);
	}

	@Get('disable-2fa')
	async disable2FA(@Req() req: RequestModel) {
	  let user: UserI = req.user;
	  user = await this.userService.googleAuthRemove(user);
	}

	@Get('qr-code')
	async getQrCode(@Req() req: RequestModel): Promise<{qr: string}> {
	  let user: UserI = req.user;
	  if (user.google_auth) {
		const qr: string = await this.userService.getQrCode(user);
		return {qr};
	  }
	  else {
		return {qr: null};
	  }
	}
  
	@Post('verify')
	async verifyToken(@Body() body: { token: string; session: string;}) {
		const user: UserI = await this.userService.handleVerifyToken(body.token, body.session);
		const jwt: string = await this.userService.returnJwt(user);
		return {
			access_token: jwt,
			token_type: 'JWT',
			expires_in: 10000
		}
	}

	@Get('check-email')
	async checkEmail(@Query('mail') mail :string ) : Promise<boolean> {
		return this.userService.checkEmail(mail);
	}

	@Put(':id/change-password')
	//@UseGuards(JwtAuthGuard)
	async changePassword(@Param('id') userId : number, @Body() { oldPassword, newPassword }: ChangePasswordDto) {
		await this.userService.updatePassword(userId, oldPassword, newPassword);
	}

	@Put(':id/change-username')
	//@UseGuards(JwtAuthGuard)
	async changeUsername(@Param('id') userId : number, @Body() { newUsername }: ChangeUsernameDto) {
		await this.userService.updateUsername(userId, newUsername);
	}

	@Put(':id/change-email')
	//@UseGuards(JwtAuthGuard)
	async changeEmail(@Param('id') userId : number, @Body() { newEmail }: ChangeEmailDto) {
		await this.userService.updateEmail(userId, newEmail);
	}

	@Post(':id/addfriend')	
	async addFriend(@Param('id') userId : number, @Body('newFriend') newFriend : UserI) {
		await this.userService.addFriend(userId, newFriend);
	} 

	@Post(':id/remove-friend')
	async removeFriend(@Param('id') userId : number, @Body('friend') friend : UserI) {
		await this.userService.removeFriend(userId, friend);
	}

	@Post(':id/addwins')
	async addWin(@Param('id') userId: number) {
	  return this.userService.addWinOrLoss(userId, true);
	}
  
	@Post(':id/addlosses')
	async addLoss(@Param('id') userId: number) {
	  return this.userService.addWinOrLoss(userId, false);
	}

	@Get('all')
	async getAllUsers() {
		return this.userService.getAllUsers();
	}

	@Get(':id')
  	async getUserInfo(@Param('id') id: number): Promise<UserI> {
    // Récupérer les informations de l'utilisateur avec l'ID fourni
    const user = await this.userService.getUserInfo(id);
    // Retourner les informations de l'utilisateur
    return user;
  }

  	@Put(':id/update-color-pad')
  	async updateColorPad(@Param('id') id: number, @Body() { color } : ChangePadSkinDto) {
		await this.userService.updateColorPad(id, color);
  }

	@Put(':id/update-color-ball')
	async updateColorBall(@Param('id') id: number, @Body() { color } : ChangeBallSkinDto) {
		await this.userService.updateColorBall(id, color);
}
}