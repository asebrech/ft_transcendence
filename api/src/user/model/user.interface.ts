import { boolean } from "yargs";
import { UserEntity } from "./user.entity";

export interface UserI {
	id?: number;
	username?: string;
	email?: string;
	password?: string;
	google_auth?: boolean;
	google_auth_secret?: string;
	wins? : number;
	losses? : number;
	ratio? : number;
	timePlayed?: number;
	friend?: UserEntity[];
}
