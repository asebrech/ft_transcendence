/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {


	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private authService: AuthService
	) { }

	async create(newUser: UserI): Promise<UserI> {
		try {
			const exists: boolean = await this.mailExists(newUser.email);
			if (!exists) {
				const passwordHash: string = await this.hashPassword(newUser.password);
				newUser.password = passwordHash;
				const user = await this.userRepository.save(this.userRepository.create(newUser));
				return this.findOne(user.id);
			} else {
				throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
			}
		} catch {
			throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
		}
	}

	async login(user: UserI): Promise<UserI> {
		try {
			const fondUser: UserI = await this.findByEmail(user.email.toLowerCase());
			if (fondUser) {
				const matches: boolean = await this.validatePassword(user.password, fondUser.password);
				if (matches) {
					return fondUser;
				} else {
					throw new HttpException('Login was not successful, wrong credentials', HttpStatus.UNAUTHORIZED);
				}
			} else {
				throw new HttpException('Login was not successful, wrong credentials', HttpStatus.UNAUTHORIZED);
			}
		} catch {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
	}

	async apiLoginHandle(apiUser: UserI): Promise<UserI> {
		const exists: boolean = await this.mailExists(apiUser.email);
		if (!exists) {
			const passwordHash: string = await this.hashPassword(this.authService.generatePassword(12));
			apiUser.password = passwordHash;
			const user = await this.userRepository.save(this.userRepository.create(apiUser));
		}
		return await this.findByEmail(apiUser.email);
	}

	async googleAuthCreate(user: UserI): Promise<UserI> {
		const foundUser: UserI =  await this.findByEmail(user.email);
		foundUser.google_auth = true;
		foundUser.google_auth_secret = this.authService.encrypteSecret(this.authService.genrateSecret());
		return this.userRepository.save(foundUser);
	}

	async googleAuthRemove(user: UserI): Promise<UserI> {
		const foundUser: UserI =  await this.findByEmail(user.email);
		foundUser.google_auth = false;
		foundUser.google_auth_secret = null;
		return this.userRepository.save(foundUser);
	}

	async getQrCode(user: UserI): Promise<string> {
		const foundUser: UserI =  await this.findByEmail(user.email);
		const secret: string = this.authService.decrypteSecret(foundUser.google_auth_secret);
		return this.authService.getQrCodeKeyuri(foundUser, secret);
	}

	async handleVerifyToken(token: string, sessionId: string): Promise<UserI> {
		const session = this.authService.getSession(sessionId);
		if (!session)
			throw new HttpException('Login was not successful, invalid session', HttpStatus.UNAUTHORIZED);
		const foundUser: UserI =  await this.findByEmail(session.email);
		if (!token)
		{
			this.authService.deleteSession(sessionId);
			throw new HttpException('Session leaved', HttpStatus.NO_CONTENT);
		}
		const check: boolean = this.authService.checkToken(foundUser, token);
		if (check) {
			this.authService.deleteSession(sessionId);
			return foundUser;
		} else
			throw new HttpException('Login was not successful, invalid token', HttpStatus.UNAUTHORIZED);
	}

	async returnJwt(apiUser: UserI): Promise<string> {
		const payload: UserI = await this.findOne(apiUser.id);
		return this.authService.generateJwt(payload);
	}

	async findAll(options: IPaginationOptions): Promise<Pagination<UserI>> {
		return paginate<UserEntity>(this.userRepository, options);
	}

	async findAllByUsername(username: string): Promise<UserI[]> {
		return this.userRepository.find({
			where: {
				username: Like(`%${username}%`.toLowerCase())
			}
		})
	}

	returnSession(user: UserI): string {
		return this.authService.createSession(user);
	}

	async checkEmail(mail: string) : Promise<boolean> {
		return this.mailExists(mail);
	}

	private async findByEmail(email: string): Promise<UserI> {
		return this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'username', 'password', 'google_auth', 'google_auth_secret'] });
	}



	private async hashPassword(password: string): Promise<string> {
		return this.authService.hashPassword(password);
	}

	private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
		return this.authService.comparePassword(password, storedPasswordHash);
	}

	async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<UserI> {
		const user = await this.findOne(userId);
		const passwordMatches = await this.authService.comparePassword(oldPassword, user.password);
		if (!passwordMatches)
			throw new HttpException('Old password is incorrect', HttpStatus.UNAUTHORIZED);
		const newPasswordHash = await this.authService.hashPassword(newPassword);
		await this.userRepository.update(userId, { password: newPasswordHash });
		const updatedUser = await this.findOne(userId);
		return updatedUser;
	}

	async updateEmail(userId: number, oldEmail: string, newEmail: string): Promise<UserI> {
		const user = await this.findOne(userId);
		if (this.checkEmail(newEmail))
			throw new HttpException('This email address is already used', HttpStatus.UNAUTHORIZED);
		await this.userRepository.update(userId, { email: newEmail });
		const updatedUser = await this.findOne(userId);
		return updatedUser;
	}

	async updateUsername(userId: number, oldUsername: string, newUsername: string): Promise<UserI> {
		const user = await this.findOne(userId);
		if (this.usernameExists(newUsername))
			throw new HttpException('This username is already taken', HttpStatus.UNAUTHORIZED);
		await this.userRepository.update(userId, { username: newUsername });
		const updatedUser = await this.findOne(userId);
		return updatedUser;
	}

	private async findOne(id: number): Promise<UserI> {
		return this.userRepository.findOneBy({ id });
	}

	public getOne(id: number): Promise<UserI> {
		return this.userRepository.findOneByOrFail({ id });
	}

	private async mailExists(email: string): Promise<boolean> {
		const user = await this.userRepository.findOneBy({ email });
		if (user)
			return true;
		else
			return false;
	}

	private async usernameExists(username: string): Promise<boolean> {
		const user = await this.userRepository.findOneBy({ username });
		if (user)
			return true;
		else
			return false;
	}

	async addFriend(id : number, newFriend : UserEntity) : Promise<UserI> {
		const user = await this.userRepository.findOneBy({id});
		if (!user.friend.includes(newFriend)) {
			user.friend.push(newFriend);
			await this.userRepository.save(user);
		}
		return user;
	}

	async removeFriend(id: number, friendId: number): Promise<UserI> {
		const user = await this.userRepository.findOneBy({id});
		user.friend = user.friend.filter((friend) => friend.id !== friendId);
		return this.userRepository.save(user);
	  }

	async addWinOrLoss(id: number, isWin: boolean): Promise<UserEntity> {
		const user = await this.userRepository.findOneBy({id});
		if (isWin)
		  user.wins += 1;
		else
		  user.losses += 1;
		user.ratio = user.wins / user.losses;
		return this.userRepository.save(user);
	  }

	async getUserInfo(id: number): Promise<UserEntity> {
		const user = await this.userRepository.findOneBy({id});
		return user;
	  }
}


