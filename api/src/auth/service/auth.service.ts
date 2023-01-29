import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/model/user.interface';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const key = crypto.randomBytes(32);
@Injectable()
export class AuthService {

	constructor(private readonly jwtService : JwtService) {}

	async generateJwt(user: UserI): Promise<string> {
		return this.jwtService.signAsync({user});
	}

	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 12);
	}

	async comparePassword(password: string, storedPasswordHash: string): Promise<any> {
		return bcrypt.compare(password, storedPasswordHash);
	}

	verifyJwt(jwt: string): Promise<any> {
		return this.jwtService.verifyAsync(jwt);
	}

	encrypteSecret(secret: string): string {
		const cipher = crypto.createCipher('aes-256-cbc', key);
		let encrypted_message = cipher.update(secret, 'utf8', 'hex');
		encrypted_message += cipher.final('hex');
		return encrypted_message;
	}

	decrypteSecret(secret: string): string {
		const decipher = crypto.createDecipher('aes-256-cbc', key);
		let decrypted_message = decipher.update(secret, 'hex', 'utf8');
		decrypted_message += decipher.final('utf8');
		return secret;
	}
	
}
