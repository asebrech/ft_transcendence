import { Player } from "./player.interface";

export interface UserI {
	id?: number;
	email?: string,
	username?: string,
	isConnected?: boolean,
	password?: string;
	wins?: number;
	losses?: number;
	ratio?: number;
	total?: number;
	level?:number;
	friends?: Friend[];
	colorPad?: string;
	history?: playerHistory[];
	colorBall?: string;
}

export interface Friend {
	id?: number;
	username?: string;
	isConnected?: boolean,
	photo?: string;
	win?: number;
	losses?: number;
	history?: playerHistory[];
}

export interface playerHistory {
	userId?: number;
	opponentId?: number;
	won?: boolean;
}
