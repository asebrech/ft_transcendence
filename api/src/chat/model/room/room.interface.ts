import { UserI } from "src/user/model/user.interface";
import { BlockedUser } from "../blockedUser.interface";

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
	muted?: BlockedUser[];
	baned?: UserI[];
	created_at?: Date;
	updated_at?: Date;
}