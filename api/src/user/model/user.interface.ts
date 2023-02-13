import { boolean } from "yargs";

export interface UserI {
	id?: number;
	username?: string;
	email: string;
	password?: string;
	google_auth?: boolean;
	google_auth_secret?: string;
}