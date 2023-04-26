/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Logger, Param, Post, Query, Req, UseGuards, Put, UseInterceptors, UploadedFile, Request, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../service/user-service/user.service';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserI, playerHistory } from '../model/user.interface';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { LoginResponseI } from '../model/login-response.interface';
import { AccessTokenI } from '../model/access-token.interface';
import { AccessTokenDto } from '../model/dto/access-token.dto';
import { RequestModel } from 'src/middleware/auth.middleware';
import { ChangePasswordDto } from '../model/dto/change-password.dto';
import { ChangeEmailDto } from '../model/dto/change-email.dto';
import { ChangeUsernameDto } from '../model/dto/change-username.dto';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs/internal/observable/of';
import { Observable, map, tap } from 'rxjs';
import { ChangePadSkinDto } from '../model/dto/change-pad-skin.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { AuthGuard } from '@nestjs/passport';
import { ChangeBallSkinDto } from '../model/dto/change-ball-skin.dto';
import axios from 'axios';


export const storage = {
	storage: diskStorage({
		destination: './uploads/profileimages',
		filename: (req, file, cb) => {
			const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
			const extension: string = path.parse(file.originalname).ext;

			cb(null, `${filename}${extension}`)
		}
	})
}

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
		try {
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
				return { session: sessionToken }
			}
		}
		catch {
			return {};
		}
	}


	@Post('api-login')
	async apiLogin(@Body() body: any): Promise<LoginResponseI> {
		const bodyJson = JSON.stringify(body);
		const headers = {
			'Content-Type': 'application/json',
		};
		let response;
		try {
			response = await axios.post('https://api.intra.42.fr/oauth/token', bodyJson, { headers });
		} catch (error) {
			if (error.response) {
				return;
			}
		}
		if (!response)
			return;
		const accessToken: AccessTokenI = this.userHelperService.accessTokenDtoToEntity(response.data);
		const userApi: UserI = await this.userHelperService.getDataFromApi(accessToken.access_token);
		const user: UserI = await this.userService.apiLoginHandle(userApi);
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
			return { session: sessionToken };
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
	async getQrCode(@Req() req: RequestModel): Promise<{ qr: string }> {
		let user: UserI = req.user;
		if (user.google_auth) {
			const qr: string = await this.userService.getQrCode(user);
			return { qr };
		}
		else {
			return { qr: null };
		}
	}

	@Post('verify')
	async verifyToken(@Body() body: { token: string; session: string; }) {
		const user: UserI = await this.userService.handleVerifyToken(body.token, body.session);
		if (!user)
			return {};
		const jwt: string = await this.userService.returnJwt(user);
		return {
			access_token: jwt,
			token_type: 'JWT',
			expires_in: 10000
		}
	}

	@Get('check-email')
	async checkEmail(@Query('mail') mail: string): Promise<boolean> {
		try {
			return this.userService.checkEmail(mail);
		} catch {
			return;
		}
	}

	// @UseGuards(JwtAuthGuard)
	// @Put(':id/change-password')
	// async changePassword(@Param('id') userId : number, @Body() { oldPassword, newPassword }: ChangePasswordDto) {
	// 	await this.userService.updatePassword(userId, oldPassword, newPassword);
	// }

	@Put(':id/change-username')
	async changeUsername(@Param('id') userId: number, @Body() { newUsername }: ChangeUsernameDto) {
		try {
			await this.userService.updateUsername(userId, newUsername);
		}
		catch {
			return;
		}
	}

	@Put(':id/change-email')
	async changeEmail(@Param('id') userId: number, @Body() { newEmail }: ChangeEmailDto) {
		try {
			await this.userService.updateEmail(userId, newEmail);
		}
		catch {
			return;
		}
	}

	@Post(':id/addfriend')
	async addFriend(@Param('id') userId: number, @Body('newFriend') newFriend: UserI) {
		try {
			await this.userService.addFriend(userId, newFriend);
		} catch {
			return;
		}
	}

	@Post(':id/remove-friend')
	async removeFriend(@Param('id') userId: number, @Body('friend') friend: UserI) {
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

	@Post(':id/incr-level')
	async incrLevel(@Param('id') userId: number) {
		return this.userService.incrOrDecrLevel(userId, true);
	}

	@Post(':id/decr-level')
	async decrLevel(@Param('id') userId: number) {
		return this.userService.incrOrDecrLevel(userId, false);
	}

	@Get('all')
	async getAllUsers() {
		return this.userService.getAllUsers();
	}

	@Get(':id')
	async getUserInfo(@Param('id') id: number): Promise<UserI> {
		try {
			// Récupérer les informations de l'utilisateur avec l'ID fourni
			const user = await this.userService.getUserInfo(id);
			// Retourner les informations de l'utilisateur
			return user;
		}
		catch {
			return;
		}
	}

	@Put(':id/update-color-pad')
	async updateColorPad(@Param('id') id: number, @Body() { color }: ChangePadSkinDto) {
		await this.userService.updateColorPad(id, color);
	}

	@Put(':id/update-color-ball')
	async updateColorBall(@Param('id') id: number, @Body() { color }: ChangeBallSkinDto) {
		await this.userService.updateColorBall(id, color);
	}

	@Post(':id/upload-profil-pic')
	//@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file', storage))
	async uploadFile(@UploadedFile() file, @Param('id') id: number) {
		try {
			const user: UserI = await this.userService.getOne(id);

			return this.userService.updateOne(user.id, { profilPic: file.filename }).pipe(
				map((user: UserI) => ({ profileImage: user.profilPic }))
			)
		}
		catch {
			return;
		}
	}

	@Get('profile-image/:imagename')
	findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
		try {
			return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
		} catch {
			return;
		}
	}

	@Post(':id/add-to-history')
	async setHistory(@Param('id') id: number, @Body('history') history: playerHistory) {
		try {
			await this.userService.setHistory(id, history);
		} catch {
			return;
		}
	}
}
