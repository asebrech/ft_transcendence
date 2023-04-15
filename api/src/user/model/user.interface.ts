import { RoomI } from "src/chat/model/room/room.interface";
/* eslint-disable prettier/prettier */
import { boolean } from "yargs";
import { UserEntity } from "./user.entity";

export interface UserI {
	id?: number;
	username?: string;
	email?: string;
	password?: string;
	blockedUsers?: UserI[];
	selectedRoom?: number;
	google_auth?: boolean;
	google_auth_secret?: string;
	wins? : number;
	losses? : number;
	ratio? : number;
	total?: number;
	level?: number;
	profilPic?: string;
	friends?: Friend[];
}

export interface Friend {
	id?: number;
	username?: string;
	profilPic?: string;
	win?: number;
	losses?: number;
}