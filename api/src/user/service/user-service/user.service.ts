import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Like, Repository } from 'typeorm';
import * as crypto from 'crypto'

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

	async login(user: UserI): Promise<string> {
		try {
			const fondUser: UserI = await this.findByEmail(user.email.toLowerCase());
			if (fondUser) {
				const matches: boolean = await this.validatePassword(user.password, fondUser.password);
				if (matches) {
					const payload: UserI = await this.findOne(fondUser.id);
					return this.authService.generateJwt(payload);
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

	async apiLoginHandle(apiUser: UserI): Promise<string> {
		const exists: boolean = await this.mailExists(apiUser.email);
		if (!exists) {
			const passwordHash: string = await this.hashPassword(this.generatePassword(12));
			apiUser.password = passwordHash;
			const user = await this.userRepository.save(this.userRepository.create(apiUser));
			return this.apiLogin(user);
		} else {
			return this.apiLogin(apiUser);
		}
	}

	private generatePassword(length: number) {
		return crypto
			.randomBytes(Math.ceil(length / 2))
			.toString("hex")
			.slice(0, length);
	}

	private async apiLogin(apiUser: UserI): Promise<string> {
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

	// also returns the password
	private async findByEmail(email: string): Promise<UserI> {
		return this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'username', 'password'] });
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
