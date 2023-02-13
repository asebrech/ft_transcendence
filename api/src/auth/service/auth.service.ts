import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/model/user.interface';
import { v4 as uuidv4 } from 'uuid';
import * as otplib from 'otplib';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const algorithm = process.env.ALGORITHM;
const password = Buffer.from(process.env.ENCRYPT_PASS, "hex");
const iv = Buffer.from(process.env.IV, "hex");

@Injectable()
export class AuthService {

	private sessions = new Map<string, UserI>();

	constructor(private readonly jwtService: JwtService) { }

	async generateJwt(user: UserI): Promise<string> {
		return this.jwtService.signAsync({ user });
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

	genrateSecret(): string {
		return otplib.authenticator.generateSecret();	
	}

	getQrCodeKeyuri(user: UserI, secret: string): string {
		return otplib.authenticator.keyuri(user.email, 'spacepong', secret);
	}

	checkToken(user: UserI, token: string): boolean {
		return otplib.authenticator.check(token, this.decrypteSecret(user.google_auth_secret));
	}

	createSession(user: UserI): string {
		const sessionToken: string = uuidv4();
		this.sessions.set(sessionToken, user);
		return sessionToken;
	}

	getSession(sessionToken): UserI {
		return this.sessions.get(sessionToken);
	}

	deleteSession(sessionToken) {
		this.sessions.delete(sessionToken);
	}

	generatePassword(length: number) {
		return crypto
			.randomBytes(Math.ceil(length / 2))
			.toString("hex")
			.slice(0, length);
	}

}
