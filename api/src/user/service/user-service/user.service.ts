/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Observable, from, map, switchMap, of, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserEntity } from 'src/user/model/user.entity';
import { Friend, UserI, playerHistory } from 'src/user/model/user.interface';
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
		if (!foundUser) {
			throw new NotFoundException('User not found');
		  }
		  if (!foundUser.google_auth) {
			throw new BadRequestException('Google Authenticator is not enabled for this user');
		  }
		const secret: string = this.authService.decrypteSecret(foundUser.google_auth_secret);
		return this.authService.getQrCodeKeyuri(foundUser, secret);
	}

	async handleVerifyToken(token: string, sessionId: string): Promise<UserI> {
		const session = this.authService.getSession(sessionId);
		if (!session) {
			return null
			//throw new HttpException('Login was not successful, invalid session', HttpStatus.UNAUTHORIZED);
		}
		const foundUser: UserI =  await this.findByEmail(session.email);
		if (!token)
		{
			this.authService.deleteSession(sessionId);
			//throw new HttpException('Session leaved', HttpStatus.NO_CONTENT);
			return null;
		}
		const check: boolean = this.authService.checkToken(foundUser, token);
		if (check) {
			this.authService.deleteSession(sessionId);
			return foundUser;
		} else {
			return null
			//throw new HttpException('Login was not successful, invalid token', HttpStatus.UNAUTHORIZED);
		}
	}

	async returnJwt(apiUser: UserI): Promise<string> {
		const payload: UserI = await this.findOne(apiUser.id);
		return this.authService.generateJwt(payload);
	}

	async findAll(): Promise<UserI[]> {
		return this.userRepository.find({relations: ['blockedUsers']});
	}

	async findAllByUsername(username: string): Promise<UserI[]> {
		return this.userRepository.find({
			where: {
				username: Like(`%${username}%`.toLowerCase())
			}
		})
	}

	async getAllUsers(): Promise<UserI[]> {
		return this.userRepository.find();
	}

	returnSession(user: UserI): string {
		return this.authService.createSession(user);
	}

	async checkEmail(mail: string) : Promise<boolean> {
		return this.mailExists(mail);
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

	async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<UserI> {
		const user = await this.findOne(userId);
		if(await this.authService.comparePassword(oldPassword, user.password))
			throw new HttpException('Old password is incorrect', HttpStatus.UNAUTHORIZED);
		const newPasswordHash = await this.authService.hashPassword(newPassword);
		await this.userRepository.update(userId, { password: newPasswordHash });
		const updatedUser = await this.findOne(userId);
		return updatedUser;
	}

	async updateEmail(userId: number, newEmail: string): Promise<UserI> {
		if (await this.checkEmail(newEmail))
			throw new HttpException('This email address is already used', HttpStatus.UNAUTHORIZED);
		await this.userRepository.update(userId, { email: newEmail });
		const updatedUser = await this.findOne(userId);
		return updatedUser;
	}

	private async usernameExists(username: string): Promise<boolean> {
		const user = await this.userRepository.findOneBy({ username });
		if (user)
			return true;
		else
			return false;
	}

	updateOne(id: number, user: UserI): Observable<any> {
        // delete user.email;
        // delete user.password;
        // delete user.role;

        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne2(id))
        );
	}

	async updateUsername(userId: number, newUsername: string): Promise<UserI> {
		const user = await this.findOne(userId);
		const usernameExists = await this.usernameExists(newUsername);
		if (usernameExists){
			throw new HttpException('This username is already taken', HttpStatus.UNAUTHORIZED);
		}
		await this.userRepository.update(userId, { username: newUsername });
		const updatedUser = await this.findOne(userId);
		return updatedUser;
	}

	private async findOne(id: number): Promise<UserI> {
		return this.userRepository.findOneBy({ id });
	}

	findOne2(id: number): Observable<UserI> {
        return from(this.userRepository.findOneBy({id})).pipe(
            map((user: UserI) => {
                const {password, ...result} = user;
                return result;
            } )
        )
    }

	public async getOne(id: number): Promise<UserI> {
		const user = await this.userRepository.findOne({ where: {id}, relations: ['blockedUsers'] });
		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`);
		  }
		  
		  return user;
	}

	private async mailExists(email: string): Promise<boolean> {
		const user = await this.userRepository.findOneBy({ email });
		if (user) {
			return true;
		} else {
			return false;
		}
	}

	async addFriend(id: number, newFriend: UserI): Promise<UserI> {
		const user = await this.userRepository.findOneBy({ id });
		const friend: Friend = {
			id: newFriend.id,
			username: newFriend.username,
			profilPic: newFriend.profilPic, 
			win: newFriend.wins, 
			losses: newFriend.losses,
		  };
		if (!user.friends)
			user.friends = [];
		const existingFriend = user.friends.find(friend => friend.id === newFriend.id);
  		if (existingFriend) {
		  throw new Error(`Friend of id : ${newFriend.id} is already on friend list.`);
		}
		user.friends.push(friend);
		await this.userRepository.save(user);
		return user;
	  }

	async removeFriend(id: number, friend: UserI): Promise<UserI> {
		const user = await this.userRepository.findOneBy({ id });
		const friendIndex = user.friends.findIndex(f => f.id === friend.id);
		console.table(friend);
		if (friendIndex !== -1) {
		  user.friends.splice(friendIndex, 1);
		  return this.userRepository.save(user);
		} else {
		  throw new Error('Friend not found');
		}
	  }

	async addWinOrLoss(id: number, isWin: boolean): Promise<UserEntity> {
		const user = await this.userRepository.findOneBy({id});
		if (isWin) {
		  user.wins += 1;
		} else {
		  user.losses += 1;
		}
		user.ratio = user.wins / user.losses;
		return this.userRepository.save(user);
	  }

	  async incrOrDecrLevel(id: number, isWin: boolean): Promise<UserEntity> {
		const user = await this.userRepository.findOneBy({id});
		if (isWin)
		  user.level += 1;
		else {
			if(user.level > 1)
		  		user.level -= 1;
		}
		return this.userRepository.save(user);
	  }

	async getUserInfo(id: number): Promise<UserEntity> {
		const user = await this.userRepository.findOneBy({id});
		// Retourner l'utilisateur avec toutes ses informations
		return user;
	  }

	async addBlockedUser(userToBlock: UserI, user: UserI): Promise<UserI> {		
		if (!user.blockedUsers){
			user.blockedUsers = [];
		}
		user.blockedUsers.push(userToBlock);
		return this.userRepository.save(user);
	} 

	async removeBlockedUser(userToBlock: UserI, user: UserI): Promise<UserI> {		
		const index = user.blockedUsers.findIndex(obj => obj.id === userToBlock.id);
			if (index !== -1)
  				user.blockedUsers.splice(index, 1);
 			return this.userRepository.save(user);
	} 

	async updateColorPad(id : number, color: string) : Promise<UserI> {
		await this.userRepository.update(id, {colorPad : color});
		const updateUser = await this.findOne(id);
		return updateUser;
	}

	async uploadProfilPic(id : number, profilPic: string) : Promise<UserI> {
		this.userRepository.update(id, { profilPic : profilPic });
		const updatedUser = await this.findOne(id);
		return updatedUser;
	}

	async updateColorBall(id : number, color: string) : Promise<UserI> {
		await this.userRepository.update(id, {colorBall : color});
		const updateUser = await this.findOne(id);
		return updateUser;
	}

	async setHistory(id: number, addhistory: playerHistory) : Promise<UserI> {
		const user = await this.userRepository.findOneBy({ id });
		const history: playerHistory = {
			userId: addhistory.userId,
			opponentId: addhistory.opponentId,
			won: addhistory.won
		  };
		if (!user.history)
			user.history = [];
		user.history.push(history);
		await this.userRepository.save(user);
		return user;
	  }
}