import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/model/user.interface';
import * as otplib from 'otplib';


const bcrypt = require('bcrypt');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const password = Buffer.from('2f971f6e1f2c3615abd130ed8e0d64b973a45aa9b50e671406a0e37ad7b52d10', "hex");
const iv = Buffer.from('2f971f6e1f2c3615abd130ed8e0d64b9', "hex");

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

	encrypteSecret(): string {
		const secret: string = otplib.authenticator.generateSecret();
		const cipher = crypto.createCipheriv(algorithm, password, iv);
		let crypted = cipher.update(secret, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return `${crypted}:${iv.toString('hex')}`;
	}

	decrypteSecret(secret: string): string {
		const parts = secret.split(':');
		const crypted = parts[0];
		const decipherIv = Buffer.from(parts[1], 'hex');
		const decipher = crypto.createDecipheriv(algorithm, password, decipherIv);
		let dec = decipher.update(crypted, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	}

	getQrCodeKeyuri(user: UserI, secret: string): string {
		return otplib.authenticator.keyuri(user.email, 'spacepong', secret);
	}
	
	checkToken(user: UserI, token: string): boolean {
		return otplib.authenticator.check(token, this.decrypteSecret(user.google_auth_secret));
	}

}
