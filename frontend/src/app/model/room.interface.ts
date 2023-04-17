import { BlockedUser } from "./blockedUser.interface";
import { UserI } from "./user.interface";

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
	Baned?: UserI[];
	created_at?: Date;
	updated_at?: Date;
}