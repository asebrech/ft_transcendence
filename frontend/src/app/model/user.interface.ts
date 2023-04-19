import { Player } from "./player.interface";

export interface UserI {
	id?: number;
	email?: string,
	username?: string,
	password?: string;
	wins?: number;
	losses?: number;
	ratio?: number;
	total?: number;
	level?:number;
	friends?: Friend[];
	colorPad?: string;
  profilPic?: string;
}

export interface Friend {
	id?: number;
	username?: string;
	profilPic?: string;
	win?: number;
	losses?: number;
}
