import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
		foundUser.google_auth_secret = this.authService.encrypteSecret();
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
		if (!session) {
			throw new HttpException('Login was not successful, invalid session', HttpStatus.UNAUTHORIZED);
		}
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
		} else {
			throw new HttpException('Login was not successful, invalid token', HttpStatus.UNAUTHORIZED);
		}
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
	
	// also returns the password
	private async findByEmail(email: string): Promise<UserI> {
		return this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'username', 'password', 'google_auth', 'google_auth_secret'] });
	}

	private async hashPassword(password: string): Promise<string> {
		return this.authService.hashPassword(password);
	}

	private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
		return this.authService.comparePassword(password, storedPasswordHash);
	}

	private async findOne(id: number): Promise<UserI> {
		return this.userRepository.findOneBy({ id });
	}

	public getOne(id: number): Promise<UserI> {
		return this.userRepository.findOneByOrFail({ id });
	}

	private async mailExists(email: string): Promise<boolean> {
		const user = await this.userRepository.findOneBy({ email });
		if (user) {
			return true;
		} else {
			return false;
		}
	}

}
