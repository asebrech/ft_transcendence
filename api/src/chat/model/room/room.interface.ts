import { UserI } from "src/user/model/user.interface";

export interface RoomI {
	id?: number;
	name?: string;
	description?: string;
	privateMessage?: boolean;
	isPrivate?: boolean;
	channelPassword?: string;
	owner?: UserI;
	users?: UserI[];
	admins?: UserI[];
	muted?: UserI[];
	baned?: UserI[];
	created_at?: Date;
	updated_at?: Date;
}