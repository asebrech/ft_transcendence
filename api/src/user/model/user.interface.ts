import { RoomI } from "src/chat/model/room/room.interface";
import { boolean } from "yargs";

export interface UserI {
	id?: number;
	username?: string;
	email: string;
	password?: string;
	blockedUsers?: UserI[];
	selectedRoom?: number;
	google_auth?: boolean;
	google_auth_secret?: string;
}